import React, { useState } from "react";
import { registerUser } from "../Services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await registerUser(formData);
      toast.success(data.message);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const isFormValid = formData.email && formData.password && formData.name;

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <section className="py-8 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left Section */}
            <div className="md:w-7/12 flex justify-center">
              <div className="w-full max-w-lg text-center text-white">
                <img
                  src="https://i.pinimg.com/736x/2c/73/84/2c73840bb4555d78ac03abb2ab3dfd61.jpg"
                  alt="Logo"
                  className="mx-auto rounded mb-6"
                  width={245}
                  height={80}
                />
                <hr className="border-blue-300 mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                  We make digital products that drive you to stand out.
                </h2>
                <p className="text-lg">
                  We write words, take photos, make videos, and interact with artificial intelligence.
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-5/12 w-full">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <h3 className="text-2xl font-semibold mb-2">Sign Up</h3>
                <p className="mb-6 text-gray-600">
                  Already have an account? <a href="#!" className="text-blue-600 hover:underline">Log in</a>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                    <input type="text" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                    <input type="email" id="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <button type="submit" disabled={!isFormValid || loading} className={`w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}>
                    Register now
                    {loading && (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="mb-4 text-gray-600">Or continue with</p>
                  <div className="flex justify-center gap-4">
                    <button className="border border-red-500 text-red-500 rounded-full p-3 hover:bg-red-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.545 6.558a9.42 9.42 0 01.139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 118 0a7.689 7.689 0 015.352 2.082l-2.284 2.284A4.347 4.347 0 008 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 000 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 001.599-2.431H8v-3.08h7.545z" />
                      </svg>
                    </button>
                    <button className="border border-blue-500 text-blue-500 rounded-full p-3 hover:bg-blue-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                    </button>
                    <button className="border border-gray-800 text-gray-800 rounded-full p-3 hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Z" />
                        <path d="M14.496 11.741c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 00-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
