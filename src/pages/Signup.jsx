import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
  sendEmailVerification,
} from "../services/users.service";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(""); // Change 'setError' state variable

  const navigate = useNavigate();

  const validatePassword = () => {
    let isValid = true;
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        isValid = false;
        setError("Passwords do not match");
      }
    }
    return isValid;
  };

  const register = (e) => {
    e.preventDefault();
    setError(""); // Clear the error state before registration
    if (validatePassword()) {
      registerWithEmailAndPassword(name, email, password)
        .then(() => {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              navigate("/verify-email");
            })
            .catch((err) => alert(err.message));
        })
        .catch((err) => setError(err.message));
    }
  };

  return (
    <section>
      <div className="container">
      <div className="flex items-center justify-center">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8
       dark:bg-gray-800 dark:border-gray-700 mt-8 mb-8">
        
        <form className="space-y-6">
        <h5 className="card-heading">Sign up in  our platform</h5>
          <input
            type="text"

            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            type="text"

            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"

            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            required
            placeholder="Confirm Password"

            className="form-input"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            className="w-full btn-primary register__btn"
            onClick={register}
          >
            Register
          </button>
          <button
            className="w-full btn-secondary register__btn register__google"
            onClick={signInWithGoogle}
          >
            Register with Google
          </button>
          <div>
            Already have an account? <Link to="/login">Login</Link> now.
          </div>
        </form>
      </div>
    </div>
      </div>
    </section>
    
  );
}

export default Signup;
