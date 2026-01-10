import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#10192d] text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <h2 className="text-white font-bold text-xl mb-3">
            CyberScope Forensics
          </h2>
          <p>
            Leading digital forensics and cybersecurity solutions. Protecting
            your digital assets with cutting-edge investigation techniques.
          </p>
          <div className="flex gap-4 mt-4 text-white">
            <a href="#" className="hover:text-blue-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
            <li><Link to="/products" className="hover:text-blue-400">Products/Services</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Services</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/products/60d5ec49f85e4d2d4c88e7d1"
                className="hover:text-blue-400"
              >
                Digital Evidence Recovery
              </Link>
            </li>
            <li>
              <Link
                to="/products/60d5ec49f85e4d2d4c88e7d2"
                className="hover:text-blue-400"
              >
                Cybersecurity Investigations
              </Link>
            </li>
            <li>
              <Link
                to="/products/60d5ec49f85e4d2d4c88e7d3"
                className="hover:text-blue-400"
              >
                Data Analysis and Reporting
              </Link>
            </li>
            <li>
              <Link
                to="/products/60d5ec49f85e4d2d4c88e7d4"
                className="hover:text-blue-400"
              >
                Expert Testimony
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FiPhone className="text-blue-400" /> 9871493454
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-blue-400" /> info@dgvoyager.com
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="text-blue-400" /> 
              M13, 3rd floor Punj house, M Block, Connaught Place - 110001
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        © 2024 CyberScope Forensics. All rights reserved. | 
        <a href="#" className="hover:text-blue-400 ml-1">Privacy Policy</a> | 
        <a href="#" className="hover:text-blue-400 ml-1">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
