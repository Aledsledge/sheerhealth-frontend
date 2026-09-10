import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Same icon quadrant split as AnimatedLogo.jsx's PIECES (55.1%/42.3%) -
// kept in sync by hand since AnimatedLogo.jsx is explicitly not to be
// touched. Reusing the identical split means the hero's assembled logo is
// the same source pixels cut the same way, not a re-approximation.
//
// No wordmark piece here (unlike AnimatedLogo's 5-piece set): the navy
// "SHEER HEALTH" text is illegible over the hero's dark video background,
// so this title card shows only the cross + checkmark icon and leaves the
// wordmark's band blank - per explicit request.
export const LOGO_PIECES = [
  { key: "top-left", clip: "polygon(0% 0%, 56.1% 0%, 56.1% 43.3%, 0% 43.3%)", origin: "27.5% 21%" },
  { key: "top-right", clip: "polygon(54.1% 0%, 100% 0%, 100% 43.3%, 54.1% 43.3%)", origin: "77.5% 21%" },
  { key: "bottom-left", clip: "polygon(0% 41.3%, 56.1% 41.3%, 56.1% 83%, 0% 83%)", origin: "27.5% 62%" },
  { key: "bottom-right", clip: "polygon(54.1% 41.3%, 100% 41.3%, 100% 83%, 54.1% 83%)", origin: "77.5% 62%" },
];

// Each piece's fully-disassembled ("scattered") 3D transform - used both as
// the FROM state for the on-load assembly animation and the target the
// scroll-driven disassembly interpolates toward. `origin` (see LOGO_PIECES)
// is each piece's own centroid, so rotation pivots around itself rather
// than the whole logo's center.
const SCATTERED = {
  "top-left": { x: -220, y: -160, z: -200, rotateY: -35, rotateX: 20 },
  "top-right": { x: 220, y: -160, z: -200, rotateY: 35, rotateX: 20 },
  "bottom-left": { x: -220, y: 160, z: -200, rotateY: -35, rotateX: -20 },
  "bottom-right": { x: 220, y: 160, z: -200, rotateY: 35, rotateX: -20 },
};
const ASSEMBLED = { x: 0, y: 0, z: 0, rotateY: 0, rotateX: 0, opacity: 1 };

// Each piece's disassembly window, as a span of overall scroll progress
// (0-1). Heavily overlapping starts with a long span each read as one
// unhurried, staggered drift apart rather than four discrete pops -
// matches the on-load assembly's own stagger character.
const DISASSEMBLY_SPANS = {
  "top-left": { start: 0.02, end: 0.24 },
  "top-right": { start: 0.06, end: 0.28 },
  "bottom-left": { start: 0.1, end: 0.32 },
  "bottom-right": { start: 0.14, end: 0.36 },
};
const TEXT_SPAN = { start: 0.32, end: 0.46 };

const pieceEase = gsap.parseEase("sine.inOut");
const textEase = gsap.parseEase("power2.out");

// Scene-cut positions in [0,1] FRACTION-of-video-duration space, not frame
// indices or seconds - callers convert as needed (desktop maps a fraction
// to a frame index into its canvas sequence, mobile maps it to
// video.currentTime). Determined by visually paging through the extracted
// frame sequence, not by trusting ffmpeg's scene-detection filter blindly -
// its first flagged cut (~6s) was a false positive, just a camera angle
// change within the microscope shot. The real cuts are at ~12.0s
// (microscope -> exam table) and ~18.3s (exam table -> TCM tools), i.e.
// fractions 0.5 and 0.7667 of the ~24.2s source.
const SCENE_FRACTIONS = { start: 0, microscopeToExam: 0.5, examToTcm: 0.7667, end: 1 };

// Scroll-progress stops mapping the 0.4 -> 1.0 "scrub phase" of the overall
// timeline onto those scene fractions. power2.inOut applied *within each
// segment* means the advance rate bottoms out right at every stop - both
// approaching a scene cut and leaving it - reading as a brief settle
// through the transition instead of a hard linear snap across it.
const SCROLL_STOPS = [
  { scroll: 0.4, frac: SCENE_FRACTIONS.start },
  { scroll: 0.7, frac: SCENE_FRACTIONS.microscopeToExam },
  { scroll: 0.86, frac: SCENE_FRACTIONS.examToTcm },
  { scroll: 1.0, frac: SCENE_FRACTIONS.end },
];
const sceneEase = gsap.parseEase("power2.inOut");

function scrollToFraction(overall) {
  if (overall <= SCROLL_STOPS[0].scroll) return SCROLL_STOPS[0].frac;
  for (let i = 0; i < SCROLL_STOPS.length - 1; i += 1) {
    const a = SCROLL_STOPS[i];
    const b = SCROLL_STOPS[i + 1];
    if (overall <= b.scroll) {
      const t = Math.min(1, Math.max(0, (overall - a.scroll) / (b.scroll - a.scroll)));
      return a.frac + sceneEase(t) * (b.frac - a.frac);
    }
  }
  return SCROLL_STOPS[SCROLL_STOPS.length - 1].frac;
}

function applyPieceState(el, key, overall) {
  if (!el) return;
  const span = DISASSEMBLY_SPANS[key];
  const t = Math.min(1, Math.max(0, (overall - span.start) / (span.end - span.start)));
  const eased = pieceEase(t);
  const target = SCATTERED[key];
  gsap.set(el, {
    x: target.x * eased,
    y: target.y * eased,
    z: target.z * eased,
    rotateY: target.rotateY * eased,
    rotateX: target.rotateX * eased,
    opacity: 1 - eased,
  });
}

function applyTextState(el, overall) {
  if (!el) return;
  const t = Math.min(1, Math.max(0, (overall - TEXT_SPAN.start) / (TEXT_SPAN.end - TEXT_SPAN.start)));
  gsap.set(el, { opacity: textEase(t) });
}

// Logo assembly - plays once, automatically, on mount. Time-based (a plain
// GSAP timeline, no ScrollTrigger at all), not scroll-bound: pieces start
// scattered (via gsap.set, mirroring the scroll-driven disassembly's own
// end state) and animate IN to the assembled mark, then hold. Disassembly
// itself is handled separately by initHeroScrollTimeline, only once this
// completes (see `onComplete` / the `introDoneRef` gate it flips).
export function initHeroLogoAssemble({ pieceRefs, onComplete }) {
  Object.entries(SCATTERED).forEach(([key, state]) => {
    if (pieceRefs[key]) gsap.set(pieceRefs[key], { ...state, opacity: 0 });
  });

  const tl = gsap.timeline({
    onComplete: () => {
      if (onComplete) onComplete();
    },
  });
  tl.to(pieceRefs["top-left"], { ...ASSEMBLED, duration: 1.0, ease: "sine.inOut" }, 0.1);
  tl.to(pieceRefs["top-right"], { ...ASSEMBLED, duration: 1.0, ease: "sine.inOut" }, 0.25);
  tl.to(pieceRefs["bottom-left"], { ...ASSEMBLED, duration: 1.0, ease: "sine.inOut" }, 0.25);
  tl.to(pieceRefs["bottom-right"], { ...ASSEMBLED, duration: 1.0, ease: "sine.inOut" }, 0.4);
  return tl;
}

// The scroll-driven half: pinned (GSAP ScrollTrigger's own `pin`, not CSS
// `position: sticky` - see the CinematicHero.jsx header comment for why)
// across the hero's ~450vh scroll driver, same trigger/pin for both
// desktop and mobile so the two genuinely share one scroll-mapping, not
// two similar-looking ones.
//
// Everything reactive - piece transforms, text opacity, and the scrub
// target (canvas frame index on desktop, video.currentTime on mobile,
// chosen by whatever `onScrubUpdate` the caller passes) - is computed from
// raw scroll progress inside ONE onUpdate and applied via gsap.set(),
// rather than scheduling separate tl.to() tweens for the pieces. That's
// what makes the `introDoneRef` gate work cleanly: a single `if
// (!introDoneRef.current) return` at the top of onUpdate holds everything
// at whatever the on-load assembly left it (fully assembled, if the
// assembly finished first) until the gate opens, then `syncNow()` applies
// the correct state for the user's *current* scroll position in one shot -
// no fighting between two different tween systems driving the same
// properties, no catch-up animation.
export function initHeroScrollTimeline({ sectionRef, stageRef, pieceRefs, textRef, introDoneRef, onScrubUpdate }) {
  let scrollTrigger = null;

  const applyForProgress = (overall) => {
    Object.keys(DISASSEMBLY_SPANS).forEach((key) => applyPieceState(pieceRefs[key], key, overall));
    applyTextState(textRef.current, overall);
    if (onScrubUpdate) onScrubUpdate(scrollToFraction(overall));
  };

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        // With Lenis now smoothing the raw scroll input (see
        // SmoothScroll.jsx), a second heavy scrub layer here would compound
        // into visible lag between input and motion. 1 (down from the
        // pre-Lenis 1.6) keeps a light catch-up feel without double-damping.
        scrub: 1,
        pin: stageRef.current,
        pinSpacing: false,
      },
    });
    scrollTrigger = tl.scrollTrigger;

    tl.to(
      {},
      {
        duration: 1,
        onUpdate: function () {
          if (!introDoneRef.current) return;
          applyForProgress(tl.scrollTrigger.progress);
        },
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, sectionRef.current);

  // The scrub's onUpdate only fires on an actual scroll/smoothing tick - if
  // the user scrolls (or doesn't) while the on-load assembly is still
  // playing and then stops, nothing re-fires onUpdate the instant
  // introDoneRef flips, which would leave everything stuck at the
  // assembled resting state until the next scroll event. `syncNow` reads
  // the current ScrollTrigger progress directly and applies once, so
  // everything is already correct the moment the gate opens.
  const syncNow = () => {
    if (scrollTrigger) applyForProgress(scrollTrigger.progress);
  };

  return { cleanup: () => ctx.revert(), syncNow };
}
