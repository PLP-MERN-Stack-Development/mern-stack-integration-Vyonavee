import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthContext from "../context/AuthContext";
import API from "../services/api";
import { motion } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await API.post("/auth/register", { username, email, password });
      console.log("Register response:", res.data);

      // If backend sends token & user, auto-login
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        login(res.data.user);
        navigate("/");
      } 
      // If backend sends only a message, redirect to login
      else if (res.data.message) {
        alert(res.data.message);
        navigate("/login");
      } 
      // Unexpected response
      else {
        console.warn("Unexpected response:", res.data);
        setError("Registration successful, but unexpected response. Please log in.");
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        console.error("Backend error:", err.response.data);
        setError(err.response.data.error || err.response.data.message || "Server error");
      } else if (err.request) {
        console.error("No response from server:", err.request);
        setError("No response from server. Is the backend running?");
      } else {
        console.error("Error:", err.message);
        setError(err.message);
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6 font-serif">
          Create an Account ✨
        </h1>
        <form onSubmit={submit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 rounded-full bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-full bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full p-3 rounded-full bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 pr-10"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500 dark:text-gray-300 hover:text-rose-500 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-700 transition duration-300"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-rose-500 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
