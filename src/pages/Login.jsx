import React, { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars
import { Link,useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../services/users.service";
import { useAuthState } from "react-firebase-hooks/auth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();


  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/");
  }, [user, loading]);

  return (
    <section>
     <div className="container">
     <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 my-8">
        <form className="space-y-6">
          <h5 className="card-heading">Sign in to our platform</h5>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input
              type="email"
              name="email"
              id="email"

              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input
              type="password"
              name="password"
              id="password"

              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            className="w-full btn-primary"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </button>
          <button
            type="button"
            className="w-full btn-secondary login__google"
            onClick={signInWithGoogle}
          >
            Login with Google
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            <Link to="/reset" className="text-blue-700 hover:underline dark:text-blue-500">Forgot Password</Link>
          </div>
          <div>
            Create an account? <Link to="/register" className="text-blue-700 hover:underline dark:text-blue-500">Register</Link> now.
          </div>
        </form>
      </div>
    </div>
     </div>
    </section>
    
  );
}

export default Login;
