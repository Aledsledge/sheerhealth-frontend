import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Exposed so any component can request an in-page scroll (e.g. an
    // anchor-style "Learn More" button) without fighting Lenis: a plain
    // `element.scrollIntoView()`/`window.scrollTo()` call sets the native
    // scroll position for one frame, but Lenis maintains its own animated
    // scroll target independently and reasserts it via requestAnimationFrame,
    // silently reverting anything that didn't go through its own API
    // (confirmed while diagnosing an unrelated click-testing issue this
    // session). window.__lenis.scrollTo(...) is the correct way in.
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return children;
};

export default SmoothScroll;
