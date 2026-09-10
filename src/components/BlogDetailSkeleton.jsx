import React from "react"; // eslint-disable-line no-unused-vars

// Mirrors Detail.jsx's real layout (cover image, title/meta, body, comments,
// related posts) so the page doesn't collapse to a near-zero height while
// the post is being fetched, then jump to full height once it resolves -
// that jump was the dominant cause of this page's CLS. Body-copy length
// varies per post and can't be known ahead of the fetch, so the body
// placeholder is an approximation, not an exact match.
const RelatedItemPlaceholder = () => (
  <div className="flex items-center gap-4 pb-3">
    <div className="w-20 h-20 rounded bg-gray-200 animate-pulse flex-shrink-0" />
    <div className="flex flex-col justify-center gap-2 flex-1">
      <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

const BlogDetailSkeleton = () => (
  <div className="container mx-auto px-6 py-8">
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-8">
        <div className="mb-8">
          <div className="w-full aspect-[16/9] rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-9 w-3/4 rounded bg-gray-200 animate-pulse mb-4" />
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-3" />
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-3" />
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse mb-3" />
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-3" />
          <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="border-t border-gray-200 bg-gray-50 rounded-lg p-6 mt-4">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-4" />
          <div className="h-4 w-56 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse mb-4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <RelatedItemPlaceholder key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default BlogDetailSkeleton;
