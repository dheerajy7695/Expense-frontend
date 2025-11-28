import React, { useState } from "react";
import { registerUser } from "../Services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await registerUser(form);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-purple-700 via-blue-600 to-blue-700 dark:from-black dark:via-gray-900 dark:to-gray-800 bg-floating-shapes overflow-hidden px-4 py-10">

      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:flex flex-col justify-center items-center p-10 text-white dark:text-gray-200 bg-white/5 dark:bg-gray-800/30 backdrop-blur-xl">
          <img
            src="https://img.freepik.com/free-vector/account-creation-concept-illustration_114360-7875.jpg"
            alt="Register"
            className="max-w-xs mb-5 drop-shadow-xl"
          />
          <h2 className="text-3xl font-bold text-center">
            Create Your Account
          </h2>
          <p className="text-gray-200 dark:text-gray-300 text-center mt-3">
            Start tracking your expenses, managing budgets, and improving your financial life effortlessly.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white dark:bg-gray-900 p-8 md:p-12">
          <h3 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-3">
            Sign Up
          </h3>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Create your free Expense Tracker account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
