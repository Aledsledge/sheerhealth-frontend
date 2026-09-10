import React from "react";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";

const Like = ({ handleLike, likes, userId }) => {
  const LikeStatus = () => {
    if (likes?.length > 0) {
      return likes.find((id) => id === userId) ? (
        <>
          <BsHandThumbsUpFill className="inline" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      ) : (
        <>
          <BsHandThumbsUp className="inline" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }
    return (
      <>
        <BsHandThumbsUp className="inline" />
        &nbsp;Like
      </>
    );
  };
  return (
    <span className="float-right cursor-pointer mt-1">
      {!userId ? (
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          title="Please Login to like post"
          disabled
        >
          <LikeStatus />
        </button>
      ) : (
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleLike}
        >
          <LikeStatus />
        </button>
      )}
    </span>
  );
};

export default Like;
