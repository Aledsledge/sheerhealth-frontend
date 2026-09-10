import React, { useRef, useState, useEffect } from "react"; // eslint-disable-line no-unused-vars
import WordReveal from "./WordReveal";
import { prefersReducedMotion } from "../../utility";
import { initTwoSystemsAnimation } from "./twoSystemsAnimations";

// All supplied images (photorealistic, AI-generated art direction - see
// twoSystemsAnimations.js for the fuller note on why that's called out here).
// Compressed to WebP - see the two-systems asset pipeline notes in the
// PASS/FAIL report for exact per-file sizes.
//
// conven2 (a different-looking physician, no hijab/mask) is imported but
// deliberately NOT used anywhere in this composition: an explicit
// instruction requires every conventional-medicine image actually used to
// show Dr. Shi Meiyan in the black hijab and blue surgical mask, matching
// conven3/conven4 - conven2 doesn't match that and was pulled rather than
// risk depicting a named physician inconsistently. Flagged in the report
// this rebuild shipped with.
import conven1 from "../../assets/images/two-systems/conven1.webp";
import conven3 from "../../assets/images/two-systems/conven3.webp";
import conven4 from "../../assets/images/two-systems/conven4.webp";
import tcm1 from "../../assets/images/two-systems/tcm1.webp";
import tcm2 from "../../assets/images/two-systems/tcm2.webp";
import tcm3 from "../../assets/images/two-systems/tcm3.webp";
import tcm4 from "../../assets/images/two-systems/tcm4.webp";
import tcm5 from "../../assets/images/two-systems/tcm5.webp";
import tcm6 from "../../assets/images/two-systems/tcm6.webp";
import tcm7 from "../../assets/images/two-systems/tcm7.webp";
import tcm8 from "../../assets/images/two-systems/tcm8.webp";

const CONVENTIONAL_TEXT =
  "Understanding the diagnosis, identifying risk, ordering investigations when needed, and using appropriate conventional treatment.";
const TCM_TEXT =
  "Traditional Chinese herbs, acupuncture, cupping, moxibustion, and other procedures when appropriate for the individual patient.";

// Desktop-only supporting panel shapes (photo crops, not cutouts): portrait
// cards for the conventional side, square for the TCM side. This whole
// stage (see the `hidden lg:flex` wrapper below) only renders at >=1024px -
// mobile gets its own much lighter, non-sticky visual per block further
// down. See twoSystemsAnimations.js for what actually animates these.
const PANEL_TALL =
  "w-full aspect-[4/5] object-cover rounded-2xl shadow-[0_20px_45px_-18px_rgba(10,20,30,0.45)] lg:absolute";
const PANEL_SQUARE =
  "w-full aspect-square object-cover rounded-2xl shadow-[0_20px_45px_-18px_rgba(10,20,30,0.45)] lg:absolute";
const ATMOSPHERE_CLASS = "w-full h-60 sm:h-72 object-cover rounded-2xl lg:absolute lg:inset-0 lg:w-full lg:h-full lg:rounded-[28px]";

const TwoSystemsSection = () => {
  const sectionRef = useRef(null);
  const visualStageRef = useRef(null);
  const conventionalBlockRef = useRef(null);
  const tcmBlockRef = useRef(null);

  // Desktop atmosphere backdrops - the blue -> green crossfade chain
  // (conven1 opens in blue, tcm1 hands off to the TCM half's own
  // blue-to-green gradient, tcm8 closes the section in warm amber).
  const conven1Ref = useRef(null);
  const tcm1Ref = useRef(null);
  const tcm8Ref = useRef(null);
  const glowBlueRef = useRef(null);
  const glowGreenRef = useRef(null);

  // Desktop conventional-side panels (photo crops - conven2 excluded, see
  // the import comment above).
  const conven3Ref = useRef(null);
  const conven4Ref = useRef(null);

  // Desktop TCM-side hero objects - real isolated cutouts, already carrying
  // the blue-to-green gradient baked into the render.
  const tcm2Ref = useRef(null);
  const tcm4Ref = useRef(null);
  const tcm3Ref = useRef(null);

  // Desktop TCM-side supporting panels.
  const tcm5Ref = useRef(null);
  const tcm6Ref = useRef(null);
  const tcm7Ref = useRef(null);

  // Mobile's own non-sticky visual per block (see the render below) - a
  // staggered, overlapping collage of the same supporting images desktop
  // uses (not a cut-down 2-image version), each tile getting its own
  // individual scroll-scrubbed pop-out. Still no rotateX/Y depth transforms
  // and no shared 3D stage the way desktop's pinned composition has - the
  // "no sticky" constraint (see the render comment) is unrelated to how
  // many tiles are shown, just to how they're positioned during scroll.
  const mobileConven1Ref = useRef(null);
  const mobileConven3Ref = useRef(null);
  const mobileConven4Ref = useRef(null);
  const mobileTcm1Ref = useRef(null);
  const mobileTcm3Ref = useRef(null);
  const mobileTcm2Ref = useRef(null);
  const mobileTcm4Ref = useRef(null);
  const mobileTcm5Ref = useRef(null);
  const mobileTcm6Ref = useRef(null);
  const mobileTcm7Ref = useRef(null);

  const [reducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      // Temporary diagnostic, not permanent instrumentation: if this section
      // "looks static" on a device during testing, check here first before
      // assuming the ScrollTrigger setup is broken - prefers-reduced-motion
      // is a real, common OS/browser/battery-saver setting (iOS Settings ->
      // Accessibility -> Motion -> Reduce Motion; Android battery saver can
      // also force it) that intentionally skips ALL scroll/entrance motion
      // on this section (and the hero's) for accessibility. That's correct
      // behavior, not a bug - but it's indistinguishable from "the animation
      // is broken" just by looking at the page, so surface it loudly.
      // eslint-disable-next-line no-console
      console.warn(
        "%c[TwoSystemsSection] prefers-reduced-motion: reduce is TRUE on this device/browser – all scroll/entrance animation here (and in the hero) is intentionally skipped. If the section looks static during testing, this is very likely why - check this device's reduced-motion / battery-saver setting before assuming the animation code is broken.",
        "font-weight:bold;font-size:13px;color:#92400e;background:#fef3c7;padding:3px 8px;border-radius:4px;"
      );
      return undefined;
    }
    return initTwoSystemsAnimation({
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
    });
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="two-systems-section relative z-10 bg-white">
        <div className="container">
          <h2 className="heading mb-10 lg:mb-16">Two Systems. One Approach.</h2>
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div className="mb-14 lg:mb-0">
              <h3 className="text-[22px] font-[700] text-headingColor mb-3">Conventional Medicine</h3>
              <img
                src={conven1}
                alt="Digital diagnostic overview alongside a stethoscope and lab results, representing conventional medical evaluation"
                className="w-full h-auto rounded-2xl mb-4"
              />
              <div className="grid grid-cols-2 gap-3 mb-5">
                <img
                  src={conven3}
                  alt="Dr. Shi Meiyan, in a black hijab and blue surgical mask, checking a patient's blood pressure"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <img src={conven4} alt="" className="w-full aspect-square object-cover rounded-xl" />
              </div>
              <WordReveal text={CONVENTIONAL_TEXT} className="text_para" />
            </div>
            <div>
              <h3 className="text-[22px] font-[700] text-headingColor mb-3">Traditional Chinese Medicine</h3>
              <img
                src={tcm1}
                alt="An acupuncture needle, cupping glass, and bundled herbs arranged in a calm treatment space"
                className="w-full h-auto rounded-2xl mb-4"
              />
              <div className="grid grid-cols-2 gap-3 mb-5">
                <img src={tcm3} alt="" className="w-full aspect-square object-contain bg-[#F6F4EE] rounded-xl p-3" />
                <img src={tcm4} alt="" className="w-full aspect-square object-contain bg-[#F3F6FB] rounded-xl p-3" />
                <img src={tcm2} alt="" className="w-full aspect-square object-contain bg-[#F3F6FB] rounded-xl p-3" />
                <img src={tcm6} alt="" className="w-full aspect-square object-cover rounded-xl" />
              </div>
              <WordReveal text={TCM_TEXT} className="text_para" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="two-systems-section relative z-10 bg-white">
      <div className="container">
        {/* 62/38 split (not an even 2-col grid) - the visual is the
            section's main event on desktop, not a small side panel. */}
        <div className="lg:grid lg:grid-cols-[1.65fr_1fr] lg:gap-12 items-start">
          {/* Desktop-only: the full sticky/pinned composition. Mobile gets
              its own separate, much lighter sticky visual further down,
              since a single shared sticky container can't also be split
              apart to sit next to two separate text blocks. */}
          <div className="two-systems-visual hidden lg:flex items-center justify-center mb-12 lg:mb-0 lg:sticky lg:top-[80px] lg:h-[82vh]">
            <div
              ref={visualStageRef}
              className="two-systems-stage relative w-full max-w-[820px] lg:h-[680px] [perspective:1400px]"
            >
              {/* Ambient color-narrative glow, desktop only - behind
                  everything, a soft wash rather than fighting the
                  blue-green gradient already baked into tcm2/tcm4. */}
              <div
                ref={glowBlueRef}
                aria-hidden="true"
                className="hidden lg:block absolute -inset-16 rounded-[40px] blur-3xl opacity-70 -z-10"
                style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(47,111,237,0.35), transparent 70%)" }}
              />
              <div
                ref={glowGreenRef}
                aria-hidden="true"
                className="hidden lg:block absolute -inset-16 rounded-[40px] blur-3xl [opacity:0] -z-10"
                style={{ background: "radial-gradient(60% 60% at 50% 60%, rgba(62,207,142,0.35), transparent 70%)" }}
              />

              {/* Atmosphere backdrops - stacked, crossfaded by opacity. */}
              <img
                ref={conven1Ref}
                src={conven1}
                alt="Digital diagnostic overview alongside a stethoscope and lab results, representing conventional medical evaluation"
                className={`[opacity:0] lg:[opacity:1] ${ATMOSPHERE_CLASS}`}
              />

              {/* Conventional panels - both depict Dr. Shi Meiyan in the
                  black hijab and blue surgical mask (conven2 excluded, see
                  the import comment at the top of this file). The extra
                  negative space where a third panel used to sit is
                  intentional, not a gap to fill. */}
              <img
                ref={conven3Ref}
                src={conven3}
                alt="Dr. Shi Meiyan, in a black hijab and blue surgical mask, checking a patient's blood pressure"
                className={`[opacity:0] ${PANEL_TALL} lg:w-[46%] lg:right-0 lg:top-[8%] lg:[transform:translateZ(45px)_rotate(2deg)]`}
              />
              <img
                ref={conven4Ref}
                src={conven4}
                alt="Dr. Shi Meiyan reviewing lab results with a patient"
                className={`[opacity:0] ${PANEL_TALL} lg:w-[50%] lg:left-[6%] lg:bottom-[4%] lg:[transform:translateZ(70px)_rotate(-1.5deg)]`}
              />

              <img
                ref={tcm1Ref}
                src={tcm1}
                alt="An acupuncture needle, cupping glass, and bundled herbs arranged in a calm treatment space"
                className={`[opacity:0] ${ATMOSPHERE_CLASS}`}
              />

              {/* TCM hero objects - isolated cutouts, no card framing. */}
              <img
                ref={tcm2Ref}
                src={tcm2}
                alt=""
                className="[opacity:0] h-56 mx-auto object-contain lg:absolute lg:h-[78%] lg:w-auto lg:mx-0 lg:right-[10%] lg:top-0 lg:[transform:translateZ(70px)_rotate(4deg)] drop-shadow-[0_25px_30px_rgba(10,20,30,0.25)]"
              />
              <img
                ref={tcm4Ref}
                src={tcm4}
                alt=""
                className="[opacity:0] h-56 mx-auto object-contain lg:absolute lg:h-auto lg:w-[38%] lg:mx-0 lg:left-0 lg:bottom-[4%] lg:[transform:translateZ(40px)_rotate(-6deg)] drop-shadow-[0_25px_30px_rgba(10,20,30,0.25)]"
              />

              {/* TCM featured panel - the branded herb bag. */}
              <img
                ref={tcm3Ref}
                src={tcm3}
                alt="A branded Sheer Health herb bag surrounded by traditional Chinese medicine ingredients"
                className="[opacity:0] w-full max-w-xs mx-auto object-contain lg:absolute lg:max-w-none lg:left-1/2 lg:top-1/2 lg:w-[58%] lg:mx-0 lg:[transform:translate(-50%,-50%)_translateZ(95px)_scale(0.85)] drop-shadow-[0_30px_40px_rgba(10,20,30,0.3)]"
              />

              {/* TCM supporting panels. */}
              <img
                ref={tcm5Ref}
                src={tcm5}
                alt=""
                className={`[opacity:0] ${PANEL_SQUARE} lg:w-[28%] lg:left-[4%] lg:top-[6%] lg:[transform:translateZ(30px)_rotate(-2deg)]`}
              />
              <img
                ref={tcm6Ref}
                src={tcm6}
                alt=""
                className={`[opacity:0] ${PANEL_SQUARE} lg:w-[27%] lg:right-0 lg:bottom-0 lg:[transform:translateZ(60px)_rotate(3deg)]`}
              />
              <img
                ref={tcm7Ref}
                src={tcm7}
                alt=""
                className={`[opacity:0] ${PANEL_SQUARE} lg:w-[20%] lg:right-[6%] lg:top-[12%] lg:[transform:translateZ(15px)_rotate(-4deg)]`}
              />

              <img
                ref={tcm8Ref}
                src={tcm8}
                alt=""
                className={`[opacity:0] ${ATMOSPHERE_CLASS}`}
              />
            </div>
          </div>

          {/* Content column */}
          <div className="two-systems-content lg:pt-[6vh]">
            <h2 className="heading mb-8 lg:mb-16">Two Systems. One Approach.</h2>

            <div
              ref={conventionalBlockRef}
              className="two-systems-block lg:min-h-[130vh] flex flex-col justify-center mb-10 lg:mb-0"
            >
              <h3 className="text-[26px] lg:text-[30px] font-[700] tracking-[-0.01em] text-headingColor mb-4">
                Conventional Medicine
              </h3>

              {/* Mobile-only: an open, borderless stage - not a framed box.
                  Not sticky (that constraint is about how the visual moves
                  during scroll, not about layout: a sticky visual sharing a
                  single column with the following text was tried and
                  rejected, since the text has to pass through the same
                  horizontal band as the sticky element to reach its
                  scrolled position, which visibly overlaps it along the way
                  - confirmed directly, not just eyeballed, by measuring
                  both elements' rects mid-scroll). No overflow-hidden/
                  shadow on the wrapper itself - it's just a layout anchor;
                  conven1 is a heavily-faded texture, not a hard backdrop
                  photo, so conven3/conven4 (real photos, legitimately
                  card-framed the same as desktop's own PANEL_TALL
                  treatment) read as the actual content, floating rather
                  than sitting inside a box. Each tile's pop-out is one
                  staggered timeline triggered by this block (see
                  twoSystemsAnimations.js). */}
              <div className="lg:hidden relative w-full h-[56vh] mb-6 overflow-hidden">
                <img
                  ref={mobileConven1Ref}
                  src={conven1}
                  alt="Digital diagnostic overview alongside a stethoscope and lab results, representing conventional medical evaluation"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
                <img
                  ref={mobileConven3Ref}
                  src={conven3}
                  alt="Dr. Shi Meiyan, in a black hijab and blue surgical mask, checking a patient's blood pressure"
                  className="absolute right-3 top-[10%] w-[48%] aspect-[4/5] object-cover rounded-xl shadow-2xl z-10 [transform:rotate(2deg)]"
                />
                <img
                  ref={mobileConven4Ref}
                  src={conven4}
                  alt="Dr. Shi Meiyan reviewing lab results with a patient"
                  className="absolute left-3 bottom-3 w-[46%] aspect-[4/5] object-cover rounded-xl shadow-2xl z-20 [transform:rotate(-1.5deg)]"
                />
              </div>

              <WordReveal text={CONVENTIONAL_TEXT} className="text_para lg:text-[19px] lg:leading-[32px]" />
            </div>

            <div aria-hidden="true" className="h-[45vh] lg:h-[35vh]" />

            <div
              ref={tcmBlockRef}
              className="two-systems-block lg:min-h-[150vh] flex flex-col justify-center"
            >
              <h3 className="text-[26px] lg:text-[30px] font-[700] tracking-[-0.01em] text-headingColor mb-4">
                Traditional Chinese Medicine
              </h3>

              {/* Mobile-only: see the matching comment in the Conventional
                  block above. A denser stage - desktop's TCM composition is
                  the richer of the two (atmosphere + needle + cupping jar +
                  the featured herb bag + 3 supporting panels), and this
                  mirrors that full set rather than a trimmed-down version
                  of it. tcm2/tcm3/tcm4 are real transparent-background
                  cutouts (confirmed via their actual alpha channel, not
                  assumed) - same as desktop, they get NO background color,
                  border, or padding box, just object-contain and a drop-
                  shadow, so they float directly on the page. tcm5/tcm6/tcm7
                  are ordinary opaque photos (also confirmed, not assumed),
                  so they keep the rounded-card treatment desktop's own
                  PANEL_SQUARE gives them - that's not the same kind of
                  asset and was never the complaint. tcm3 (herb bag) is
                  centered and largest, on top of everything (z-30) - the
                  one clear focal point the other tiles stagger in around,
                  same as desktop's own treatment. */}
              <div className="lg:hidden relative w-full h-[60vh] mb-6 overflow-hidden">
                <img
                  ref={mobileTcm1Ref}
                  src={tcm1}
                  alt="An acupuncture needle, cupping glass, and bundled herbs arranged in a calm treatment space"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
                <img
                  ref={mobileTcm5Ref}
                  src={tcm5}
                  alt=""
                  className="absolute left-3 top-3 w-[26%] aspect-square object-cover rounded-lg shadow-xl z-10 [transform:rotate(-3deg)]"
                />
                <img
                  ref={mobileTcm7Ref}
                  src={tcm7}
                  alt=""
                  className="absolute right-3 top-3 w-[22%] aspect-square object-cover rounded-lg shadow-xl z-10 [transform:rotate(3deg)]"
                />
                <img
                  ref={mobileTcm2Ref}
                  src={tcm2}
                  alt=""
                  className="absolute left-2 bottom-[10%] h-[30%] w-auto object-contain drop-shadow-[0_20px_25px_rgba(10,20,30,0.35)] z-20"
                />
                <img
                  ref={mobileTcm4Ref}
                  src={tcm4}
                  alt=""
                  className="absolute right-2 bottom-2 w-[32%] h-auto object-contain drop-shadow-[0_20px_25px_rgba(10,20,30,0.35)] z-20"
                />
                <img
                  ref={mobileTcm6Ref}
                  src={tcm6}
                  alt=""
                  className="absolute right-[4%] top-[30%] w-[20%] aspect-square object-cover rounded-lg shadow-lg z-10 [transform:rotate(-4deg)]"
                />
                <img
                  ref={mobileTcm3Ref}
                  src={tcm3}
                  alt="A branded Sheer Health herb bag surrounded by traditional Chinese medicine ingredients"
                  className="absolute left-1/2 top-1/2 w-[56%] h-auto object-contain drop-shadow-[0_25px_35px_rgba(10,20,30,0.35)] z-30"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
              </div>

              <WordReveal text={TCM_TEXT} className="text_para lg:text-[19px] lg:leading-[32px]" />
            </div>

            <div aria-hidden="true" className="h-[35vh] lg:h-[35vh]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoSystemsSection;
