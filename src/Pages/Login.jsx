import React, { useState } from "react";
import { loginUser } from "../Services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(formData);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-floating-shapes bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4 py-10 flex items-center justify-center">
      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center items-center text-white dark:text-gray-200 p-10 bg-white/5 dark:bg-gray-800/30 backdrop-blur-xl">
          <img
            src="https://img.freepik.com/free-vector/expense-tracker-concept-illustration_114360-15842.jpg"
            alt="Finance"
            className="max-w-xs drop-shadow-xl mb-6"
          />

          <h2 className="text-3xl font-extrabold text-center mb-4">
            Smart Expense Management
          </h2>

          <p className="text-center text-gray-200 dark:text-gray-300 text-lg leading-relaxed">
            Track spending, visualize budgets, and stay in control of your financial goals—powered by simplicity and automation.
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white dark:bg-gray-900 p-8 md:p-12">
          <h3 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-3">
            Welcome Back 👋
          </h3>

          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Login to your Expense Tracker Dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold flex justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
