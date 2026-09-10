import React from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase";

const CommentBox = ({ userId, emailVerified, userComment, setUserComment, handleComment }) => {
  const navigate = useNavigate();

  const resendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent - check your inbox.");
      }
    } catch (err) {
      toast.error(err.message || "Could not send the verification email.");
    }
  };

  return (
    <div>
      <form className="mb-6">
        <div className="mb-3">
          <textarea
            rows="4"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="form-input"
            placeholder="Write a comment..."
            disabled={!userId || !emailVerified}
          />
        </div>
      </form>
      {!userId ? (
        <div>
          <h5>Please login or create an account to post a comment.</h5>
          <button
            className="btn-primary"
            // was `navigate("/auth")` - "/auth" isn't a route (see Routers.jsx,
            // the real path is "login"), so this button previously did nothing.
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      ) : !emailVerified ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="text-yellow-800 font-medium">Please verify your email to comment.</h5>
          <p className="text-sm text-yellow-700 mt-1">
            Check your inbox for a confirmation link, then refresh this page.
          </p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={resendVerification}
          >
            Resend verification email
          </button>
        </div>
      ) : (
        <button
          className="btn-primary"
          onClick={handleComment}
        >
          Post Comment
        </button>
      )}
    </div>
  );
};

export default CommentBox;
