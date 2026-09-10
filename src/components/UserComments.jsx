import React from "react";
import { BiTrash } from "react-icons/bi";
import userAvatar from '../assets/images/avatar.png';

// `userId` here is the comment author's uid (spread in from the stored
// comment object). `currentUserId`/`isAdmin`/`index`/`onDelete` are supplied
// by Detail.jsx per-render and are not part of the stored comment data.
const UserComments = ({ name, body, createdAt, msg, userId, index, currentUserId, isAdmin, onDelete }) => {
  // Ensure createdAt is a valid Date object or convert it to Date
  const commentDate = createdAt instanceof Date ? createdAt : (createdAt ? createdAt.toDate() : null);
  const formattedDate = commentDate ? commentDate.toDateString() : "";
  const canDelete = !!currentUserId && (currentUserId === userId || isAdmin);

  const handleDeleteClick = () => {
    if (window.confirm("Delete this comment? This cannot be undone.")) {
      onDelete(index);
    }
  };

  return (
    <div className="relative flex items-start justify-start p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
      {msg ? (
        <h4 className="text-lg font-semibold text-gray-600">{msg}</h4>
      ) : (
        <>
          {canDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              aria-label="Delete comment"
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition"
            >
              <BiTrash className="w-4 h-4" />
            </button>
          )}
          <div className="flex-shrink-0">
            <img
              src={userAvatar}
              alt="user profile"
              className="rounded-full h-12 w-12"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="ml-3 pr-6">
            <h3 className="text-base font-semibold text-gray-800">
              {name}
              <small className="text-xs text-gray-500 ml-1">{formattedDate}</small>
            </h3>
            <p className="text-sm text-gray-600 mt-1">{body}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserComments;
