import React from "react"; // eslint-disable-line no-unused-vars

// Mirrors CBlog.jsx's real layout (container-fluid > container > 3-col grid,
// col-span-2 card list + sidebar) so the page doesn't collapse to a near-zero
// height while the initial Firestore query is in flight, then jump to full
// height once it resolves - that jump was the dominant cause of this page's
// CLS. `getBlogs()` fetches 4 posts on first load, so 4 placeholder cards is
// an exact match for the common case; other list lengths (search, category
// filter, "load more") still see a closer approximation than an empty page.
const CardPlaceholder = () => (
  <div className="py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="hover-blogs-img">
        <div className="blogs-img">
          <div className="w-full aspect-[16/9] rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-3">
        <div>
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-3" />
          <div className="h-7 w-3/4 rounded bg-gray-200 animate-pulse mb-3" />
          <div className="h-4 w-40 rounded bg-gray-200 animate-pulse mb-4" />
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-10 w-28 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  </div>
);

const FeatureItemPlaceholder = () => (
  <div className="flex items-center gap-4 pb-3">
    <div className="w-20 h-20 rounded bg-gray-200 animate-pulse flex-shrink-0" />
    <div className="flex flex-col justify-center gap-2 flex-1">
      <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

const BlogListSkeleton = () => (
  <div className="container-fluid pb-4 pt-4 padding">
    <div className="container padding">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="blog-heading text-start py-2 mb-4">Daily Blogs</div>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardPlaceholder key={i} />
          ))}
        </div>
        <div>
          <div className="h-6 w-32 rounded bg-gray-200 animate-pulse mb-4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <FeatureItemPlaceholder key={i} />
          ))}
          <div className="h-6 w-24 rounded bg-gray-200 animate-pulse mt-6 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 w-32 rounded bg-gray-200 animate-pulse mb-3" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default BlogListSkeleton;
