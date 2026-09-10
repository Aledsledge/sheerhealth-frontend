import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// All imagery driven by this timeline is photorealistic, AI-generated art
// direction supplied for this section - not real photography - even where
// it depicts clinical scenes or people. Kept as a static import (not a
// dynamic import()) after an earlier attempt at code-splitting this module
// reproducibly made mobile Lighthouse Speed Index/FCP *worse* than just
// shipping gsap in the main bundle; see the TwoSystemsSection performance
// gate history for the measurements behind that call.
//
// Uses gsap.context(), not the @gsap/react useGSAP() hook - this runs from
// a plain useEffect, not synchronously during render, so there's no hook
// to tie it to, and context() is the primitive useGSAP() wraps internally
// anyway. @gsap/react is not a dependency of this project.
//
// Returns a single cleanup function that reverts every tween/timeline/
// ScrollTrigger created here and detaches the pointer-tilt listener.
export function initTwoSystemsAnimation({
  sectionRef,
  visualStageRef,
  conventionalBlockRef,
  tcmBlockRef,
  conven1Ref,
  tcm1Ref,
  tcm8Ref,
  glowBlueRef,
  glowGreenRef,
  conven3Ref,
  conven4Ref,
  tcm2Ref,
  tcm4Ref,
  tcm3Ref,
  tcm5Ref,
  tcm6Ref,
  tcm7Ref,
  mobileConven1Ref,
  mobileConven3Ref,
  mobileConven4Ref,
  mobileTcm1Ref,
  mobileTcm3Ref,
  mobileTcm2Ref,
  mobileTcm4Ref,
  mobileTcm5Ref,
  mobileTcm6Ref,
  mobileTcm7Ref,
}) {
  let removePointerListener = () => {};

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    // Desktop/tablet (>=1024px): the pinned visual (CSS `sticky`, not a GSAP
    // pin) runs one continuous, scrubbed master timeline across the content
    // column's scroll distance. Atmosphere photos hand off to each other
    // (conven1 -> tcm1 -> tcm8) for the blue-to-green-to-warm-close color
    // narrative; tcm2/tcm4 already carry that blue-green gradient baked
    // into the render, so the ambient glow stays deliberately soft.
    mm.add("(min-width: 1024px)", () => {
      const conventionalWords = conventionalBlockRef.current.querySelectorAll(".two-systems-word");
      const tcmWords = tcmBlockRef.current.querySelectorAll(".two-systems-word");

      gsap.set(conventionalWords, { opacity: 0.14, y: 8 });
      gsap.set(tcmWords, { opacity: 0.14, y: 8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // IMPORTANT: GSAP timeline position numbers are absolute time offsets,
      // not fractions of 1 - a timeline's total duration is whatever its
      // furthest-reaching child tween adds up to. A flat `stagger: N` also
      // extends a tween's real span by `N * (itemCount - 1)`, which isn't
      // obvious from the tween's own `duration`. Both of those combined
      // silently stretched an earlier version of this timeline well past
      // its intended 0-1 scale, firing beats 2-4x earlier than actual scroll
      // progress. Fixed by using `stagger: { amount }` (spreads the reveal
      // across a fixed total span regardless of word count) and by
      // hand-summing every span below so the last tween ends at ~1.0 - keep
      // that invariant when editing this timeline (check with
      // `tl.duration()` after any change; it should read ~1).

      // 0.05-0.50: Conventional Medicine phase. conven2 is not part of this
      // composition (see TwoSystemsSection.jsx's import comment) - conven3
      // and conven4 carry the conventional side, each getting a full
      // individual entrance beat rather than splitting the spotlight three
      // ways, and the extra negative space that leaves is intentional.
      tl.to(
        conventionalWords,
        { opacity: 1, y: 0, stagger: { amount: 0.28 }, ease: "none", duration: 0.2 },
        0.08
      );
      tl.fromTo(
        conven3Ref.current,
        { opacity: 0, y: 24, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
        0.06
      );
      tl.fromTo(
        conven4Ref.current,
        { opacity: 0, y: 24, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
        0.16
      );

      // 0.45-0.51: transition - conventional atmosphere and panels fade out,
      // TCM atmosphere fades in, glow crosses from blue to green.
      tl.to(conven1Ref.current, { opacity: 0, duration: 0.05 }, 0.45);
      tl.to([conven3Ref.current, conven4Ref.current], { opacity: 0, duration: 0.05 }, 0.45);
      tl.to(tcm1Ref.current, { opacity: 1, duration: 0.05 }, 0.46);
      tl.to(glowBlueRef.current, { opacity: 0, duration: 0.06 }, 0.45);
      tl.to(glowGreenRef.current, { opacity: 0.7, duration: 0.06 }, 0.45);

      // 0.5-0.58: TCM hero objects enter with depth - needle and cupping
      // jar, asymmetric and overlapping, not a grid.
      tl.fromTo(
        tcm2Ref.current,
        { opacity: 0, y: -20, scale: 0.92, rotate: 4 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "power2.out" },
        0.5
      );
      tl.fromTo(
        tcm4Ref.current,
        { opacity: 0, y: 20, scale: 0.92, rotate: -6 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "power2.out" },
        0.54
      );

      // 0.53-0.99: TCM Medicine word reveal - slowed, spread across nearly
      // the entire remaining TCM phase (through the herb-bag feature beat,
      // the supporting panels, and into the closing atmosphere) rather than
      // a single quick beat.
      tl.to(
        tcmWords,
        { opacity: 1, y: 0, stagger: { amount: 0.24 }, ease: "none", duration: 0.22 },
        0.53
      );

      // 0.62-0.72: the herb bag's featured beat - it scales up and takes
      // the spotlight; the needle and cupping jar recede (smaller, pushed
      // back in z, dimmed) rather than competing with it.
      tl.fromTo(
        tcm3Ref.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.1, ease: "power2.out" },
        0.62
      );
      tl.to([tcm2Ref.current, tcm4Ref.current], { opacity: 0.5, scale: 0.85, duration: 0.1 }, 0.62);

      // 0.72-0.88: supporting panels - a still-life detail, an in-practice
      // photo, and a smaller, deliberately subdued cupping accent (capped
      // below full opacity - the visible marks in that photo read as more
      // clinical/intense than the rest of the section's tone, so it stays a
      // quiet corner detail rather than a focal point).
      tl.fromTo(
        tcm5Ref.current,
        { opacity: 0, y: -16, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "power2.out" },
        0.72
      );
      tl.fromTo(
        tcm6Ref.current,
        { opacity: 0, y: 16, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "power2.out" },
        0.76
      );
      tl.fromTo(
        tcm7Ref.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 0.55, scale: 1, duration: 0.08, ease: "power2.out" },
        0.8
      );

      // 0.9-1.0: closing atmosphere - a warm, restorative beat to end on,
      // deliberately contrasting the cool blue-green that's carried the
      // section so far. Panels settle/dim slightly so the backdrop reads.
      tl.to(tcm1Ref.current, { opacity: 0, duration: 0.1 }, 0.9);
      tl.to(tcm8Ref.current, { opacity: 1, duration: 0.1 }, 0.9);
      tl.to(
        [tcm2Ref.current, tcm4Ref.current, tcm3Ref.current, tcm5Ref.current, tcm6Ref.current, tcm7Ref.current],
        { opacity: (i, target) => (target === tcm3Ref.current ? 0.85 : 0.4), duration: 0.1 },
        0.9
      );

      // Subtle pointer-tilt on the two TCM hero cutouts, only while the
      // section is actually in view (an event listener has near-zero idle
      // cost, so this doesn't reintroduce the continuous-tween CPU issue
      // found earlier - that was specifically about `repeat:-1` tweens
      // running forever off-screen, not about listening for mousemove).
      const stage = visualStageRef.current;
      const tiltTargets = [tcm2Ref.current, tcm4Ref.current];
      const handleMove = (e) => {
        const rect = stage.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(tiltTargets, {
          rotate: `+=${px * 3}`,
          y: `+=${py * 3}`,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const visibility = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) stage?.addEventListener("mousemove", handleMove);
          else stage?.removeEventListener("mousemove", handleMove);
        },
      });
      removePointerListener = () => {
        stage?.removeEventListener("mousemove", handleMove);
        visibility.kill();
      };

      return () => {
        tl.kill();
      };
    });

    // Mobile/tablet-portrait (<1024px): the same supporting images desktop
    // uses, laid out as a bounded "stage" per block (backdrop filling it,
    // panels layered on top) - no pin, no sticky visual (a sticky visual
    // sharing a single column with the following text was tried and
    // rejected: the text has to scroll through the same horizontal band as
    // the sticky element to reach its final position, which visibly
    // overlaps it along the way - confirmed by measuring both elements'
    // rects mid-scroll, not just eyeballing a screenshot). "No sticky" is
    // about *how* the visuals move during scroll, not how many of them
    // there are or how they're framed - dropping to a flat 2-image version
    // was a separate, unwarranted over-correction. opacity/scale/
    // translateY only here, no rotateX/Y depth transforms.
    //
    // One scrubbed gsap.timeline() per stage, triggered by that stage's own
    // block - not independent per-tile ScrollTriggers. Each tile is a
    // gsap.fromTo(opacity 0/scale 0.75/y 40 -> opacity 1/scale 1/y 0) at a
    // staggered position inside that one timeline, so the whole stage reads
    // as one coordinated assembly instead of several unrelated tiles
    // animating on their own schedules. TCM's herb bag (tcm3) lands last
    // and from a more dramatic starting scale (0.6 vs 0.75) since it's the
    // one clear focal point everything else stages around, matching how
    // desktop treats it.
    mm.add("(max-width: 1023px)", () => {
      [conventionalBlockRef, tcmBlockRef].forEach((blockRef) => {
        const words = blockRef.current.querySelectorAll(".two-systems-word");
        gsap.set(words, { opacity: 0.14, y: 8 });
        gsap.to(words, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: blockRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
      });

      // Buttery pop-out physics: scrub 1.8 (was 1.2) for real catch-up
      // momentum instead of feeling locked to the scroll position, and a
      // much wider trigger range ("top 90%" -> "center 45%", was "top 75%"
      // -> "top ~15%") so that momentum has enough physical scroll distance
      // to actually read as gradual instead of resolving in a couple of
      // scroll ticks. force3D:true on every tween keeps the images on the
      // GPU compositor through the scale change - without it, mobile
      // Safari/Chrome can rasterize a tile at its small starting scale and
      // never re-rasterize at full size, leaving it visibly soft once
      // settled at scale:1.
      const popGroup = (tl, refs, position, { fromScale = 0.85, stagger = 0.15, duration = 0.4 } = {}) => {
        const els = refs.map((r) => r.current).filter(Boolean);
        if (!els.length) return;
        tl.fromTo(
          els,
          { opacity: 0, scale: fromScale, y: 50 },
          { opacity: 1, scale: 1, y: 0, ease: "power2.out", stagger, duration, force3D: true },
          position
        );
      };

      // Conventional stage - backdrop settles first (to a heavily faded
      // 0.3, not full opacity - it's a soft texture behind the real
      // content, not a competing photo), then the two floating panels
      // stagger in on top of it as one grouped, staggered pop.
      if (conventionalBlockRef.current && mobileConven1Ref.current) {
        const convTl = gsap.timeline({
          scrollTrigger: {
            trigger: conventionalBlockRef.current,
            start: "top 90%",
            end: "center 45%",
            scrub: 1.8,
          },
        });
        convTl.fromTo(
          mobileConven1Ref.current,
          { opacity: 0, scale: 1.06 },
          { opacity: 0.3, scale: 1, ease: "power2.out", duration: 0.3, force3D: true },
          0
        );
        popGroup(convTl, [mobileConven3Ref, mobileConven4Ref], 0.25);
      }

      // TCM stage - backdrop, then the needle/cupping-jar cutouts and the
      // 3 supporting panels stagger in around the edges as one grouped pop,
      // then the branded herb bag scales up prominently center-stage last.
      if (tcmBlockRef.current && mobileTcm1Ref.current) {
        const tcmTl = gsap.timeline({
          scrollTrigger: {
            trigger: tcmBlockRef.current,
            start: "top 90%",
            end: "center 45%",
            scrub: 1.8,
          },
        });
        tcmTl.fromTo(
          mobileTcm1Ref.current,
          { opacity: 0, scale: 1.06 },
          { opacity: 0.3, scale: 1, ease: "power2.out", duration: 0.25, force3D: true },
          0
        );
        popGroup(
          tcmTl,
          [mobileTcm5Ref, mobileTcm7Ref, mobileTcm2Ref, mobileTcm4Ref, mobileTcm6Ref],
          0.25
        );
        popGroup(tcmTl, [mobileTcm3Ref], 0.65, { fromScale: 0.6, stagger: 0, duration: 0.45 });
      }
    });
  }, sectionRef.current);

  return () => {
    removePointerListener();
    ctx.revert();
  };
}
