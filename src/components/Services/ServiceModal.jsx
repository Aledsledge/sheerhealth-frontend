import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Matches the CSS transition duration below - keep these in sync, the
// unmount timeout has to outlast the actual transition or the exit
// animation gets cut off.
const TRANSITION_MS = 380;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Rendered via a portal straight onto document.body rather than in place.
// The services grid sits in a normal document section, but this keeps the
// modal's `position: fixed` correct regardless of what ancestors elsewhere
// on the page do with CSS transforms (GSAP's pinned hero stage, for one) -
// a transformed ancestor turns `fixed` into "fixed relative to that
// ancestor" instead of the viewport, which is exactly the kind of bug that
// doesn't show up until it's live on the real page.
const ServiceModal = ({ isOpen, onClose, serviceData }) => {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(closeTimeoutRef.current);
      setMounted(true);
      // Mount in the exit state first, then flip to visible a frame later -
      // mounting already-visible skips the enter transition entirely since
      // there's no state change left for the browser to animate.
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setVisible(true));
        closeTimeoutRef.current = raf2;
      });
      return () => cancelAnimationFrame(raf1);
    }
    if (mounted) {
      setVisible(false);
      closeTimeoutRef.current = setTimeout(() => setMounted(false), TRANSITION_MS);
    }
    return () => clearTimeout(closeTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  if (!mounted || !serviceData) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-8">
      {/* Backdrop is the actual "click outside" target - it's a sibling of
          the content panel, not an ancestor, so a click on the panel never
          bubbles into it and doesn't need stopPropagation gymnastics. */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          // bg-slate-950/85 (Tailwind's 950-shade + opacity-modifier
          // combination) silently compiles to nothing in this project's
          // Tailwind 3.3.3 - confirmed by inspecting the built CSS
          // (bg-slate-900/90 elsewhere in this same file DOES generate
          // correctly, isolating it to the 950 shade specifically). Same
          // color (#020617 = slate-950) applied inline instead.
          backgroundColor: "rgba(2, 6, 23, 0.85)",
          transition: `opacity ${TRANSITION_MS}ms ${EASE}`,
          opacity: visible ? 1 : 0,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-white shadow-2xl"
        style={{
          transition: `transform ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ${EASE}`,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(16px)",
          opacity: visible ? 1 : 0,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          &#10005;
        </button>

        <h2 id="service-modal-title" className="text-2xl font-bold pr-10">
          {serviceData.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-white/85">{serviceData.description}</p>

        {serviceData.protocolStandard && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Protocol Standard</p>
            <p className="mt-1 text-sm leading-6 text-white/80">{serviceData.protocolStandard}</p>
          </div>
        )}

        <Link to="/Appoinment" onClick={onClose}>
          <button type="button" className="btn-primary mt-8 w-full">
            Book Initial Consultation
          </button>
        </Link>
      </div>
    </div>,
    document.body
  );
};

ServiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  serviceData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    // Not currently a field on the Firestore `services` documents (only
    // title/description exist there) - rendered only when present so it
    // degrades cleanly rather than showing an empty section.
    protocolStandard: PropTypes.string,
  }),
};

export default ServiceModal;
