const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

admin.initializeApp();
const db = admin.firestore();

const CRAWLER_UA = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|Googlebot|Applebot|Embedly|Quora Link Preview/i;

const SPA_HTML_PATH = path.join(__dirname, 'spa', 'index.html');
const LIVE_HTML_URL = 'https://sheerhealth.in/index.html';
const LIVE_HTML_TTL_MS = 60 * 1000;
let liveHtmlCache = { html: null, fetchedAt: 0 };

// Fetches the *currently deployed* Hosting index.html at request time so the
// script/style tags always match live asset hashes, instead of the copy
// bundled into this function at its last deploy (which goes stale the moment
// Hosting is redeployed with new hashed asset filenames).
async function getFreshSpaHtml() {
  const now = Date.now();
  if (liveHtmlCache.html && now - liveHtmlCache.fetchedAt < LIVE_HTML_TTL_MS) {
    return liveHtmlCache.html;
  }
  try {
    const resp = await fetch(LIVE_HTML_URL, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) throw new Error(`status ${resp.status}`);
    const html = await resp.text();
    liveHtmlCache = { html, fetchedAt: now };
    return html;
  } catch (err) {
    console.error('Falling back to bundled index.html, live fetch failed:', err);
    return fs.readFileSync(SPA_HTML_PATH, 'utf8');
  }
}

const OG_FALLBACK_IMAGE = 'https://sheerhealth.in/og-fallback.png';
const OG_CACHE_PREFIX = 'og-cache/';
const OG_TARGET_WIDTH = 1200;
const OG_TARGET_HEIGHT = 630;
const OG_MAX_BYTES = 300 * 1024; // 300KB budget for the normalized output
const OG_START_QUALITY = 80;
const OG_MIN_QUALITY = 40;

// Unconditionally normalizes every post's source image into a fixed-size,
// fixed-format og:image, instead of guessing whether the source is "safe"
// enough to pass through as-is. The previous approach (accept/reject based
// on measured size/dimensions) kept producing false positives — first a
// format gap (WebP wasn't parsed), then a threshold that turned out to be
// wrong for a real working image — because "is this safe for WhatsApp"
// is fundamentally a heuristic guess about a third party's undocumented
// internal limits. Normalizing every image to the same known-good shape
// removes the guessing entirely: every og:image is 1200x630-or-smaller
// JPEG under ~300KB, every time, regardless of what the source was.
//
// The processed result is cached in Storage under a path derived from the
// source URL, so a given post's image is only ever resized once — every
// subsequent crawler hit (across the existing 5-10 min HTML cache window,
// and beyond it) reuses the cached file instead of reprocessing.
async function getNormalizedOgImage(imgUrl) {
  if (!imgUrl) return OG_FALLBACK_IMAGE;

  const bucket = getStorage().bucket();
  const cacheKey = crypto.createHash('sha256').update(imgUrl).digest('hex').slice(0, 32);
  const cachePath = `${OG_CACHE_PREFIX}${cacheKey}.jpg`;
  const cacheFile = bucket.file(cachePath);

  try {
    const [exists] = await cacheFile.exists();
    if (exists) {
      const [metadata] = await cacheFile.getMetadata();
      const token = metadata.metadata && metadata.metadata.firebaseStorageDownloadTokens;
      if (token) {
        return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(cachePath)}?alt=media&token=${token}`;
      }
    }
  } catch (err) {
    console.warn(`getNormalizedOgImage: cache lookup failed for ${imgUrl}, will (re)generate:`, err);
  }

  try {
    const resp = await fetch(imgUrl, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) throw new Error(`source fetch failed with status ${resp.status}`);
    const srcBuf = Buffer.from(await resp.arrayBuffer());

    const resizeOpts = { width: OG_TARGET_WIDTH, height: OG_TARGET_HEIGHT, fit: 'inside', withoutEnlargement: true };
    let quality = OG_START_QUALITY;
    let outBuf = await sharp(srcBuf).resize(resizeOpts).jpeg({ quality }).toBuffer();
    while (outBuf.length > OG_MAX_BYTES && quality > OG_MIN_QUALITY) {
      quality -= 10;
      outBuf = await sharp(srcBuf).resize(resizeOpts).jpeg({ quality }).toBuffer();
    }

    const token = crypto.randomUUID();
    await cacheFile.save(outBuf, {
      contentType: 'image/jpeg',
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: { firebaseStorageDownloadTokens: token, sourceUrl: imgUrl },
      },
    });

    console.log(`getNormalizedOgImage: cached normalized image for ${imgUrl} at ${cachePath} (${outBuf.length} bytes, quality ${quality})`);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(cachePath)}?alt=media&token=${token}`;
  } catch (err) {
    console.error(`getNormalizedOgImage: failed to normalize ${imgUrl}, using fallback:`, err);
    return OG_FALLBACK_IMAGE;
  }
}

// Everything under here can also be sent by Hosting's slug rewrite
// (firebase.json's "/*" -> ssrBlogMeta rule) - these are the pass-through
// static routes/assets Hosting already routes elsewhere via explicit rules
// listed *before* that catch-all, so a request for one of them should never
// actually reach here. Kept as a defense-in-depth guard: if it ever does
// (e.g. firebase.json drifts out of sync with Routers.jsx), treat it as
// "not a blog slug" instead of 404ing a real page for crawlers.
const RESERVED_TOP_LEVEL_PATHS = new Set([
  'home', 'appoinment', 'medicalservices', 'login', 'register', 'contact',
  'ourdoctors', 'location', 'service', 'create', 'cblog', 'reset',
  'verify-email', 'addfaq', 'addservice', 'og-fallback.png',
]);

exports.ssrBlogMeta = onRequest(async (req, res) => {
  const ua = req.get('User-Agent') || '';
  const isCrawler = CRAWLER_UA.test(ua);

  // /detail/:id (legacy, still fully supported) or a top-level /:slug (new
  // canonical form) - both resolve to the same post lookup + OG/image logic
  // below, they only differ in how the Firestore doc is found.
  const detailMatch = req.path.match(/^\/detail\/([^/?#]+)/);
  const slugMatch = !detailMatch ? req.path.match(/^\/([^/?#]+)\/?$/) : null;
  const docId = detailMatch ? detailMatch[1] : null;
  const slugParam =
    slugMatch && !RESERVED_TOP_LEVEL_PATHS.has(slugMatch[1].toLowerCase())
      ? slugMatch[1]
      : null;
  const isBlogRequest = Boolean(docId || slugParam);

  if (!isCrawler || !isBlogRequest) {
    try {
      const html = await getFreshSpaHtml();
      // Never share-cache: this branch's content depends on User-Agent, and a
      // cached response here would get served to crawlers too (breaking link
      // previews), same bug this fix addresses on the crawler branch.
      res.set('Cache-Control', 'no-store');
      res.set('Vary', 'User-Agent');
      return res.status(200).send(html);
    } catch (err) {
      console.error('SPA fallback failed:', err);
      return res.status(500).send('Site temporarily unavailable');
    }
  }

  try {
    let snap;
    if (docId) {
      snap = await db.collection('blogs').doc(docId).get();
      if (!snap.exists) snap = null;
    } else {
      const q = await db.collection('blogs').where('slug', '==', slugParam).limit(1).get();
      snap = q.empty ? null : q.docs[0];
    }
    if (!snap) {
      return res.status(404).send('Post not found');
    }
    const post = snap.data();

    const title = esc(post.title || 'Sheer Health');
    const description = esc((post.description || '').slice(0, 200));
    const image = await getNormalizedOgImage(post.imgUrl);
    // Always point crawlers/redirects at the canonical slug URL once a post
    // has one, even when this request came in via the legacy /detail/:id
    // path - avoids two indexable URLs for the same post.
    const canonicalPath = post.slug ? `/${post.slug}` : `/detail/${snap.id}`;
    const url = `https://sheerhealth.in${canonicalPath}`;

    // Vary by User-Agent so a shared/CDN cache never serves this crawler-only
    // response to a real browser, or vice versa (that mismatch was the cause
    // of intermittent missing link previews).
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.set('Vary', 'User-Agent');
    res.status(200).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />
<meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body><a href="${url}">${title}</a></body>
</html>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating preview');
  }
});

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
