import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import gsap from "gsap";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation(); // Get current path
  const [scrolling, setScrolling] = useState(false); // Track scroll position

  // GSAP Animation for the Logo
  useEffect(() => {
    gsap.to(".logo-title", 0.7, {
      x: "10",
      ease: "power2.inOut",
      yoyo: true,
      stagger: 0.08,
      repeat: -1,
      autoAlpha: true,
    });
  }, []);

  // Detect scroll and update state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full py-5 sm:px-10 px-5 flex justify-between items-center 
      transition-all duration-300 z-30 ${
        scrolling
          ? "bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="flex w-full max-w-screen-xl mx-auto">
        <Link to="/">
          <p className="logo-title text-2xl font-bold text-white">
            AI Tool Hub
          </p>
        </Link>
        <div className="flex flex-1 justify-center space-x-6 max-sm:hidden">
          <Link
            to="/text-assistance"
            className="px-5 text-xl cursor-pointer transition-all text-gray-200 hover:text-white"
          >
            Text Assistance
          </Link>
          <Link
            to="/text-to-image"
            className="px-5 text-xl cursor-pointer transition-all text-gray-200 hover:text-white"
          >
            Generate Image
          </Link>
          <Link
            to="/text-to-music"
            className="px-5 text-xl cursor-pointer transition-all text-gray-200 hover:text-white"
          >
            Text to Music
          </Link>
          <Link
            to="/image-to-text"
            className="px-5 text-xl cursor-pointer transition-all text-gray-200 hover:text-white"
          >
            Image to Text Converter
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-200">{user.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-xl text-gray-200 hover:text-white transition-all"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};
