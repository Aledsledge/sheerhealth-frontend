import React from "react";
import PropTypes from "prop-types";

// Presentational only - splits `text` into one <span class="two-systems-word">
// per word. Renders fully visible, normal-flow text with no opacity/transform
// applied here; TwoSystemsSection's GSAP timeline is what dims/reveals these
// spans, and only does so when motion is actually enabled. That split means
// this component alone - with no JS, or under prefers-reduced-motion - is
// already the correct, fully readable final state.
const WordReveal = ({ text, className }) => {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p className={className}>
      {words.map((word, i) => (
        <span className="two-systems-word inline-block" key={`${word}-${i}`}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
};

WordReveal.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

WordReveal.defaultProps = {
  className: "",
};

export default WordReveal;
