import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");
    if (token && userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/home" className="text-2xl font-bold text-gray-800 hover:text-yellow-500"        >
          <span className="text-yellow-500">Expense</span>Tracker
        </Link>

        <div className={`${isMenuOpen ? "block" : "hidden"} sm:flex sm:items-center sm:space-x-6`}        >
          <div className="flex justify-center w-full space-x-6">
            {["dashboard", "transactions", "users"].map((item) => (
              <NavLink key={item} to={`/${item}`} className={({ isActive }) => `block py-2 sm:py-0 capitalize ${isActive ? "text-blue-600 font-semibold" : "text-gray-700"} hover:text-blue-600`}>{item}</NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="sm:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)} >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {!user ? (
            <NavLink to="/login" className="text-blue-600 font-semibold hover:underline">Login</NavLink>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold hover:bg-blue-700 focus:outline-none">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-3 z-50">
                  <div className="px-4 pb-2 border-b">
                    <p className="text-blue-600 font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
