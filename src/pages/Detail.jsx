import { isEmpty } from "lodash";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import CommentBox from "../components/CommentBox";
import ImageLightbox from "../components/ImageLightbox";

import FeatureBlogs from "../components/FeatureBlogs";
import Tags from "../components/Tags";
import UserComments from "../components/UserComments";
import { db } from "../firebase";
import BlogDetailSkeleton from "../components/BlogDetailSkeleton";
import {
  collection,
  getDocs,
  limit,
  query,
  orderBy,
} from "firebase/firestore";
import { getBlog, getBlogBySlug, updateBlog } from "../services/blog.service";
import { formatDate } from "../utility";

const Detail = ({ setActive, user }) => {
  const userId = user?.uid;
  // Same localStorage 'USER' convention used elsewhere in this app
  // (ServiceCard.jsx, FaqItem.jsx, BlogSection.jsx) - useAdmin() in
  // Routers.jsx is the only place that actually subscribes to admin status;
  // every other component reads the snapshot it caches there.
  let isAdmin = false;
  try {
    const cachedUser = localStorage.getItem('USER');
    if (cachedUser) isAdmin = !!JSON.parse(cachedUser).isAdmin;
  } catch {
    isAdmin = false;
  }
  // /:slug (new canonical route) supplies `slug`; the legacy /detail/:id
  // route supplies `id`. Exactly one of the two is present depending on
  // which route matched.
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState({});
  const [docId, setDocId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  let [likes, setLikes] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    const getRecentBlogs = async () => {
      const blogRef = collection(db, "blogs");
      const recentBlogs = query(blogRef, orderBy("timestamp", "desc"), limit(5));
      const docSnapshot = await getDocs(recentBlogs);
      setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    getRecentBlogs();
  }, []);

  const getBlogDetail = async () => {
    let blogDetail = null;
    let resolvedId = null;

    if (slug) {
      const bySlug = await getBlogBySlug(slug);
      if (bySlug) {
        resolvedId = bySlug.id;
        blogDetail = bySlug;
      }
    } else if (id) {
      const byId = await getBlog(id);
      if (byId) {
        resolvedId = id;
        blogDetail = byId;
        // Legacy /detail/:id link: once this post has a slug, canonicalize
        // the URL bar to it. Client-side only - doesn't affect crawlers,
        // which never run this JS (ssrBlogMeta handles /detail/:id and
        // /:slug identically server-side for them).
        if (byId.slug) {
          navigate(`/${byId.slug}`, { replace: true });
        }
      }
    }

    if (!blogDetail) {
      setLoading(false);
      return;
    }

    blogDetail.timestamp = formatDate(blogDetail.timestamp);
    setBlog(blogDetail);
    setDocId(resolvedId);
    setLikes(blogDetail.likes || []);
    setComments(blogDetail.comments || []);
    setLoading(false);
  };

  useEffect(() => {
    (id || slug) && getBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, slug]);

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  const handleComment = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please log in to comment.");
      return;
    }
    // Defense in depth: CommentBox already hides the submit button until
    // the email is verified, but the submission path itself must not trust
    // that the UI gate was actually in front of whatever called this.
    if (!user?.emailVerified) {
      toast.error("Please verify your email before commenting.");
      return;
    }
    if (!userComment.trim()) {
      return;
    }
    const updatedComments = [
      ...comments,
      {
        createdAt: new Date(),
        userId,
        name: user?.displayName,
        body: userComment,
      },
    ];
    const success = await updateBlog(docId, { ...blog, comments: updatedComments });
    if (success) {
      // Previously mutated `comments` in place and never called
      // setComments() - it happened to repaint anyway because
      // setUserComment() below triggers an unrelated re-render that just
      // reads the mutated array. Doing this immutably instead so the UI
      // update isn't dependent on that coincidence.
      setComments(updatedComments);
      toast.success("Comment posted successfully");
      setUserComment("");
    } else {
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const handleDeleteComment = async (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    const success = await updateBlog(docId, { ...blog, comments: updatedComments });
    if (success) {
      setComments(updatedComments);
      toast.success("Comment deleted");
    } else {
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  const handleLike = async () => {
    if (userId) {
      if (blog?.likes) {
        const index = likes.findIndex((id) => id === userId);
        if (index === -1) {
          likes.push(userId);
          setLikes([...new Set(likes)]);
        } else {
          likes = likes.filter((id) => id !== userId);
          setLikes(likes);
        }
        await updateBlog(docId, { ...blog, likes });
      }
    }
  };

  const relatedBlogs = blogs.filter((b) => b.id !== docId).slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-[1rem] sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <img
          src={blog?.imgUrl}
          alt="Blog"
          className="w-full aspect-[16/9] object-contain bg-gray-50 rounded cursor-zoom-in"
          width="1200"
          height="675"
          loading="lazy"
          decoding="async"
          onClick={() => blog?.imgUrl && setLightboxSrc(blog.imgUrl)}
        />
      </div>
      <div className="mb-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{blog?.title}</h2>
          <p className="text-sm text-gray-500">
            {blog?.author ? `By ${blog.author} - ` : ""}
            {blog?.timestamp}
          </p>
        </div>
        {blog?.contentHtml ? (
          <div
            className="blog-content text-sm sm:text-base leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.contentHtml, {
                ALLOWED_TAGS: ["p", "strong", "em", "u", "h1", "h2", "h3", "ul", "ol", "li", "br"],
                ALLOWED_ATTR: [],
              }),
            }}
          />
        ) : (
          <p className="text-sm sm:text-base leading-relaxed text-gray-800 text-left">{blog?.description}</p>
        )}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 rounded-lg p-[1rem] sm:p-6 mt-4">
        <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
        {isEmpty(comments) ? (
          <UserComments msg="No comments yet. Be the first to comment." />
        ) : (
          <>
            {comments.map((comment, index) => (
              <UserComments
                key={index}
                {...comment}
                index={index}
                currentUserId={userId}
                isAdmin={isAdmin}
                onDelete={handleDeleteComment}
              />
            ))}
          </>
        )}
        <div className="mt-6">
          <CommentBox
            userId={userId}
            emailVerified={user?.emailVerified}
            userComment={userComment}
            setUserComment={setUserComment}
            handleComment={handleComment}
          />
        </div>
      </div>

      {relatedBlogs.length > 0 && (
        <div className="border-t border-gray-200 mt-8 pt-8">
          <FeatureBlogs title="You Might Also Like" blogs={relatedBlogs} />
        </div>
      )}

      <ImageLightbox
        src={lightboxSrc}
        alt={blog?.title}
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
};

export default Detail;
