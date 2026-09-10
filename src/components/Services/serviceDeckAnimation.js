import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// True physical "deck of cards" effect for the Services section: all cards
// sit absolutely stacked in the same spot, each one progressively smaller
// and nudged further down than the one in front of it, so their bottom
// edges visibly peek out from underneath - a real fanned deck, not a hidden
// queue. As the user scrolls, the front card lifts off the top (moves way
// up, its content fading) while EVERY remaining card in the stack shifts
// one slot forward (a little bigger, a little higher) to take its new
// place.
//
// Two separate opacity channels per card, not one - see the shell/content
// split in ServiceCard.jsx:
//   - the SHELL (cardRefs) never fades. It's what GSAP scales/moves for
//     stack position, and it stays a plain visible slate-50 box for as
//     long as the card is anywhere in the stack.
//   - the CONTENT (contentRefs, the image+text inside that shell) only
//     shows for whichever card is currently front-and-center.
// A first version faded the whole card (shell+content together). On
// mobile's stacked image-on-top/text-below layout especially, a waiting
// card's full-opacity text sat almost exactly where the front card's own
// text was, so even a few percent of the front card's fade-out let the
// waiting card's title/button visibly bleed through as ghosted double
// text. Keeping the shell permanently opaque (so the "peeking" edge is
// just blank card, never a content preview) and only ever fading the
// CONTENT - fast on the way out, only once the outgoing content is
// already gone on the way in - removes that overlap entirely.
//
// `start: "top 80px"` (not "top top") pins the container with its top
// already clear of .sticky_header (App.css - 80px tall, sticky, z-index
// 99999) - the same header-collision this project has hit and fixed
// several times now.
//
// Z-index is set ONCE at initialization and never touched again: card k's
// z-index only needs to stay below card (k-1)'s for as long as k-1 is still
// part of the visible stack, and since cards only ever leave (never
// re-enter or reorder among themselves), that original ordering is already
// correct for every later stage of the animation - there's nothing to
// recompute mid-scroll.
//
// Lenis is wired to call ScrollTrigger.update() on every scroll frame (see
// SmoothScroll.jsx), which is what GSAP's own pin documentation asks for
// when pairing pin with a virtual-scroll library - no extra plumbing
// needed here.
const HEADER_CLEARANCE = 80;
const STACK_SCALE_STEP = 0.05;
const STACK_Y_STEP = 40;
const BASE_Z = 50;

export function initServiceDeckAnimation({ containerRef, cardRefs, contentRefs }) {
  const cards = cardRefs.current.filter(Boolean);
  const contents = contentRefs.current.filter(Boolean);
  if (cards.length < 2 || contents.length !== cards.length) return () => {};

  const ctx = gsap.context(() => {
    // Initial fanned stack: card 0 front-and-center, every card after it
    // a little smaller and a little lower - shells all fully opaque (a
    // real deck never has invisible cards), but only card 0's content is
    // actually showing.
    cards.forEach((card, k) => {
      gsap.set(card, {
        scale: 1 - k * STACK_SCALE_STEP,
        y: k * STACK_Y_STEP,
        zIndex: BASE_Z - k,
      });
      gsap.set(contents[k], { opacity: k === 0 ? 1 : 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: `top ${HEADER_CLEARANCE}px`,
        end: "+=4000",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    for (let i = 0; i < cards.length - 1; i++) {
      // Card i's shell peels off the top of the deck and flies away - this
      // spans the card's ENTIRE slot so scrolling always feels continuous
      // ("buttery"), not stalled. `power1.inOut` means it moves slowly at
      // first (still looks basically settled for a good while even though
      // it's technically already animating) and picks up speed later.
      tl.to(cards[i], { y: "-100vh", ease: "power1.inOut", duration: 1 }, i);

      // Every shell still waiting behind it moves up exactly one slot in
      // the stack, simultaneously - card i+1 becomes the new front
      // (scale 1, y 0), card i+2 becomes what i+1 used to be, and so on.
      for (let j = i + 1; j < cards.length; j++) {
        const newSlot = j - i - 1;
        tl.to(
          cards[j],
          { scale: 1 - newSlot * STACK_SCALE_STEP, y: newSlot * STACK_Y_STEP, ease: "power1.inOut", duration: 1 },
          i
        );
      }

      // Content only starts changing in the SECOND HALF of the slot - a
      // first version faded content out starting at the very top of the
      // slot (t=i), which meant the front card started visibly dissolving
      // the instant the user began scrolling at all, with no settled
      // reading time. Delaying it here doesn't cost any "buttery" scroll
      // feedback, since the shell above is already moving continuously the
      // whole time regardless - only the text/button fade waits.
      tl.to(contents[i], { opacity: 0, ease: "power2.out", duration: 0.2 }, i + 0.5);
      tl.to(contents[i + 1], { opacity: 1, ease: "power2.in", duration: 0.3 }, i + 0.7);
    }
  }, containerRef);

  return () => ctx.revert();
}
