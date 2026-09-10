import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { prefersReducedMotion } from "../utility";

// Plays on every full page load - deliberately NOT gated behind a
// once-per-session flag (that was a prior design; removed on request). It
// still won't replay on internal SPA navigation, because Header/Footer
// mount exactly once for the life of the page and React Router never
// remounts them on route changes - "every full load, not every navigation"
// falls out of the normal mount lifecycle for free, no storage needed.
//
// Entirely skipped for prefers-reduced-motion: renders straight to the
// final, pixel-identical static image with no motion at all - no entrance,
// no idle breathing, no scroll pulse (the latter two are disabled via the
// prefers-reduced-motion CSS block in index.css alongside this JS gate).

// Piece geometry derived from the actual pixel content of logo1.png
// (900x741, measured via a raw-pixel alpha-channel scan - not guessed):
//   icon mark:   rows 16-611   (y 2.2%-82.5%), x 170-822 (18.9%-91.3%)
//   blank gap:   rows 612-647
//   wordmark:    rows 648-724  (y 87.4%-97.7%)
// Icon quadrant split uses the icon's own content center (x 55.1%, y 42.3%),
// not the canvas center, so the four pieces divide the checkmark/cross mark
// itself evenly. Every piece shares the same background-size/position, so
// they only differ by clip-path - once each settles at translate(0), the
// stack reproduces the source image pixel-for-pixel.
const PIECES = [
  { key: "top-left", clip: "polygon(0% 0%, 55.1% 0%, 55.1% 42.3%, 0% 42.3%)", from: "translate(-46px, -46px)", delay: 0 },
  { key: "top-right", clip: "polygon(55.1% 0%, 100% 0%, 100% 42.3%, 55.1% 42.3%)", from: "translate(46px, -46px)", delay: 90 },
  { key: "bottom-left", clip: "polygon(0% 42.3%, 55.1% 42.3%, 55.1% 83%, 0% 83%)", from: "translate(-46px, 46px)", delay: 190 },
  { key: "bottom-right", clip: "polygon(55.1% 42.3%, 100% 42.3%, 100% 83%, 55.1% 83%)", from: "translate(46px, 46px)", delay: 280 },
  { key: "wordmark", clip: "polygon(0% 85%, 100% 85%, 100% 100%, 0% 100%)", from: "translate(0, 20px) scale(0.9)", delay: 500 },
];

// Longer + a touch of overshoot (see .logo-piece's cubic-bezier in index.css)
// than the original cut - reads as a more deliberate, premium landing rather
// than a quick snap into place.
const TRANSITION_MS = 750;
const TOTAL_MS = PIECES[PIECES.length - 1].delay + TRANSITION_MS + 150;

const AnimatedLogo = ({ src, alt, heightPx, className, hoverClassName }) => {
  // 'skip'  -> reduced motion: show final state immediately, no animation ever
  // 'start' -> pieces mounted at their off-screen/start transform, about to flip
  // 'enter' -> pieces transitioning to translate(0)/opacity 1 (with overshoot)
  // 'done'  -> entrance finished, pieces unmounted; base image takes over and
  //            picks up the idle-breathe animation (see .logo-idle-breathe)
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? "skip" : "start"));

  useEffect(() => {
    if (phase !== "start") return undefined;
    // A short setTimeout (rather than requestAnimationFrame) so the browser
    // paints the pieces at their start transform before we flip to 'enter' -
    // otherwise the transition can get coalesced into the very first paint
    // and never visibly animate. setTimeout is used instead of rAF because
    // rAF callbacks are suspended indefinitely in a backgrounded/unfocused
    // tab, which would leave the logo stuck mid-animation if the tab loses
    // focus right after load; setTimeout still fires in that case.
    const t = setTimeout(() => setPhase("enter"), 20);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "enter") return undefined;
    const t = setTimeout(() => setPhase("done"), TOTAL_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const showPieces = phase === "start" || phase === "enter";
  const baseVisible = !showPieces;
  const landed = phase === "enter";

  return (
    <div
      // animated-logo-frame: stable hook for index.css's idle-breathe
      // (post-assembly) and the sticky-header scroll pulse
      // (`.sticky_header .animated-logo-frame`, scoped naturally by DOM
      // ancestry to only the Header instance - Footer's frame is never
      // inside a .sticky_header element).
      className={`relative inline-block animated-logo-frame ${phase === "done" ? "logo-idle-breathe" : ""} ${className || ""}`}
      style={{ height: heightPx, aspectRatio: "900 / 741" }}
    >
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-contain ${baseVisible ? hoverClassName || "" : ""}`}
        style={{ opacity: baseVisible ? 1 : 0 }}
      />
      {showPieces &&
        PIECES.map((piece) => (
          <div
            key={piece.key}
            aria-hidden="true"
            className="absolute inset-0 logo-piece"
            style={{
              clipPath: piece.clip,
              backgroundImage: `url(${src})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: landed ? "translate(0, 0) scale(1)" : piece.from,
              opacity: landed ? 1 : 0,
              // Soft depth cue while airborne - shrinks away exactly as each
              // piece lands flush, like it was raised slightly and settles.
              filter: landed ? "none" : "drop-shadow(0 10px 14px rgba(15, 23, 42, 0.35))",
              transitionDelay: `${piece.delay}ms`,
            }}
          />
        ))}
    </div>
  );
};

AnimatedLogo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  heightPx: PropTypes.number,
  className: PropTypes.string,
  hoverClassName: PropTypes.string,
};

AnimatedLogo.defaultProps = {
  alt: "",
  heightPx: 85,
  className: "",
  hoverClassName: "",
};

export default AnimatedLogo;
