import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    console.log("User searched for:", searchQuery);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
    toast.info("You have logged out.");
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#1C2331] text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 py-4">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold">Digital Voyager</Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-gray-300">
            <Link to="/" className="hover:text-blue-400">Home</Link>
            <Link to="/about" className="hover:text-blue-400">About Us</Link>
            <Link to="/products" className="hover:text-blue-400">Products/Services</Link>
            <Link to="/contact" className="hover:text-blue-400">Contact Us</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-3 py-1 rounded-l-lg bg-white text-black text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-500 px-3 py-1 rounded-r-lg hover:bg-blue-600 text-sm"
              >
                Search
              </button>
            </form>

            {user ? (
              <div className="relative">
                <motion.button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}`}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium hidden md:block">{user.name}</span>
                  <motion.svg
                    className="w-4 h-4 md:block hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    variants={{
                      open: { rotate: 180 },
                      closed: { rotate: 0 }
                    }}
                    animate={dropdownOpen ? "open" : "closed"}
                    transition={{ duration: 0.2 }}
                  ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></motion.svg>
                </motion.button>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="border border-cyan-500 text-cyan-400 px-6 py-2 rounded-lg font-medium bg-transparent will-change-transform transform-gpu text-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(6,182,212,0.9)", color: "#ffffff", boxShadow: "0px 0px 18px rgba(6, 182, 212, 0.5)" }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-lg font-medium text-white will-change-transform transform-gpu text-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 18px rgba(56, 189, 248, 0.6)" }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
