import React, { useRef, useState, useEffect } from "react"; // eslint-disable-line no-unused-vars
import { Link } from "react-router-dom";
import { prefersReducedMotion } from "../../utility";
import { initHeroLogoAssemble, initHeroScrollTimeline, LOGO_PIECES } from "./heroAnimations";
import heroPoster from "../../assets/video/hero-poster.webp";
import heroDesktopVideo from "../../assets/video/hero-desktop.mp4";
import heroMobileVideo from "../../assets/video/hero-mobile.mp4";
import logo1 from "../../assets/images/logo1.png";

// Architecture, current state and why:
//
// - ASSEMBLE ON LOAD, DISASSEMBLE ON SCROLL. The logo starts scattered and
//   flies together into the assembled mark automatically on mount (a
//   time-based GSAP timeline, no ScrollTrigger - initHeroLogoAssemble),
//   then holds. Only once that finishes does scrolling start disassembling
//   it again, scrubbed and reversible, handing off into the video phase -
//   see heroAnimations.js's initHeroScrollTimeline and the `introDoneRef`
//   gate it reads.
// - OPTIMIZED VIDEO SCRUB (approved architecture). A single <video> element
//   picks the right source natively via the browser's <source media="...">
//   matching, no JS viewport branching needed. Both hero-desktop.mp4 and
//   hero-mobile.mp4 are re-encoded with a keyframe on every frame
//   (`-g 1 -keyint_min 1`) so scrubbing video.currentTime backward never has
//   to decode from a prior keyframe. Global smooth scrolling (Lenis, see
//   src/components/SmoothScroll/SmoothScroll.jsx, mounted in Layout.jsx)
//   drives GSAP ScrollTrigger's update loop so the scrub reads as one
//   continuous motion instead of native-scroll jitter.
// - The pinned-canvas overlap (TwoSystemsSection sliding up over the
//   pinned stage as the 450vh scroll driver runs out) is unaffected by any
//   of the above.
// - The logo layer (the wrapping div wrapping the 4 LOGO_PIECES) is
//   `absolute inset-0` at z-20, stacked *above* the text/CTA layer at
//   z-10. Even once every piece animates to opacity:0, that wrapper (and
//   its children) still fully covers the CTA button and intercepts its
//   clicks - opacity:0 does not disable hit-testing on its own. Fixed with
//   `pointer-events-none` on that wrapper - keep this on any future edit.
//
// Opening title-card logo itself unchanged from the earlier brand-accuracy
// pass: real logo1.png raster, split into the same clip-path quadrants as
// AnimatedLogo.jsx's PIECES. logo1.png/AnimatedLogo.jsx remain untouched.

const AssembledLogoIcon = ({ className }) => (
  <div className={className} style={{ aspectRatio: "900 / 741" }} role="img" aria-label="Sheer Health">
    {LOGO_PIECES.map((piece) => (
      <div
        key={piece.key}
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: piece.clip,
          backgroundImage: `url(${logo1})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    ))}
  </div>
);

const HeroCopy = () => (
  <>
    <h1 className="text-[32px] md:text-[52px] leading-tight font-[800] text-white text-wrap-balance max-w-[820px]">
      We Help Patients Live a Healthy Quality Life
    </h1>
    <p className="text-[16px] md:text-[18px] leading-7 text-white/85 max-w-[620px] mt-5">
      As dedicated allopathic physicians, we combine conventional medical practice with Traditional Chinese Medicine,
      built around each patient&apos;s individual needs.
    </p>
    <Link to="/Appoinment">
      <button type="button" className="btn-primary mt-8">
        Request an Appointment
      </button>
    </Link>
  </>
);

const CinematicHero = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const pieceRefs = useRef({});
  const videoRef = useRef(null);
  const videoDurationRef = useRef(24.2);
  const textRef = useRef(null);
  const introDoneRef = useRef(false);

  const [reducedMotion] = useState(prefersReducedMotion);
  const runScrub = !reducedMotion;

  useEffect(() => {
    if (!runScrub) return undefined;

    const video = videoRef.current;
    const onLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) videoDurationRef.current = video.duration;
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.load();

    const onScrubUpdate = (fraction) => {
      if (!videoRef.current) return;
      const d = videoDurationRef.current;
      // Seeking to exactly `duration` lands past the last decodable frame
      // in some browsers and renders black instead of clamping to the
      // final frame - stay a hair short of it.
      videoRef.current.currentTime = Math.min(fraction * d, d - 0.08);
    };

    const scrollTimeline = initHeroScrollTimeline({
      sectionRef,
      stageRef,
      pieceRefs: pieceRefs.current,
      textRef,
      introDoneRef,
      onScrubUpdate,
    });

    const assembleTl = initHeroLogoAssemble({
      pieceRefs: pieceRefs.current,
      onComplete: () => {
        introDoneRef.current = true;
        scrollTimeline.syncNow();
      },
    });

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      assembleTl.kill();
      scrollTimeline.cleanup();
    };
  }, [runScrub]);

  // prefers-reduced-motion: a single static frame (the poster image), the
  // assembled logo, and the text - all immediately visible, no scroll
  // binding, no video created at all. Applies on every viewport.
  if (reducedMotion) {
    return (
      <section className="cinematic-hero relative h-[100vh] min-h-[560px] w-full overflow-hidden bg-[#0A1520]">
        <img src={heroPoster} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1520]/90 via-[#0A1520]/40 to-[#0A1520]/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <AssembledLogoIcon className="relative w-[110px] mb-6" />
          <HeroCopy />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="cinematic-hero relative w-full" style={{ height: "450vh" }}>
      {/* Pinned by GSAP (see heroAnimations.js) as an immersive background
          video (z-0) that TwoSystemsSection (relative z-10 bg-white)
          physically slides up and over once the hero's 450vh scroll
          distance runs out - not just a block that scrolls away. */}
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-[#0A1520] z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={heroPoster}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={heroMobileVideo} media="(max-width: 767px)" type="video/mp4" />
          <source src={heroDesktopVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1520]/85 via-[#0A1520]/10 to-[#0A1520]/55" />

        {/* Logo layer - the opening title card. Assembles automatically on
            mount, then disassembles as the user scrolls (both via
            heroAnimations.js). pointer-events-none: this layer sits above
            the text/CTA layer in z-index, and stays hit-testable at
            opacity:0 without it - see the header comment for the button
            bug this caused. */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ perspective: "1400px" }}
        >
          <div className="relative w-[140px] sm:w-[180px] md:w-[220px]" style={{ aspectRatio: "900 / 741" }}>
            {LOGO_PIECES.map((piece) => (
              <div
                key={piece.key}
                ref={(el) => {
                  pieceRefs.current[piece.key] = el;
                }}
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  clipPath: piece.clip,
                  backgroundImage: `url(${logo1})`,
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transformOrigin: piece.origin,
                }}
              />
            ))}
          </div>
        </div>

        {/* Text overlay - fades in as the logo clears and the scrub phase
            begins. */}
        <div ref={textRef} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 [opacity:0]">
          <HeroCopy />
        </div>
      </div>
    </section>
  );
};

export default CinematicHero;
