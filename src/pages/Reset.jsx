import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../services/users.service";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/");
  }, [user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <input
          type="text"
          className="form-input mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button
          className="w-full btn-primary"
          onClick={() => sendPasswordReset(email)}
        >
          Send password reset email
        </button>
        <div className="mt-4">
          Don't have an account? <Link to="login" className="text-blue-600">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Reset;
