// Shared by AnimatedLogo.jsx and TwoSystemsSection.jsx - both skip their
// scroll/entrance motion entirely for users who've asked for less of it.
export const prefersReducedMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

export const excerpt = (str, count) => {
  if (str.length > count) {
    str = str.substring(0, count) + " ... ";
  }
  return str;
};

// Shared by BlogSection.jsx (card list) and Detail.jsx (post page) so both
// show the same "August 27, 2026" style instead of one of them falling back
// to a raw JS Date string.
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  const formatted = date.toLocaleString("default", { month: "long", day: "numeric", year: "numeric" });
  return formatted !== "Invalid Date" ? formatted : "";
};

// Base slug from a title only - does not check Firestore for collisions.
// Callers that need a collision-free slug (AddEditBlog.jsx, the one-time
// migration script) append -2/-3/... themselves once they know which
// candidates are already taken.
export const slugify = (title) => {
  return (title || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
