import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import gsap from "gsap";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); // <-- cần để redirect khi logout
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // GSAP logo animation
  useEffect(() => {
    gsap.to(".logo-title", {
      duration: 0.7,
      x: 10,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      autoAlpha: true,
    });
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".dropdown-menu") &&
        !e.target.closest(".user-icon")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown animation
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        ".dropdown-menu",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login"); // <-- redirect to login
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full py-5 sm:px-10 px-5 flex justify-between items-center 
      transition-all duration-300 z-30 ${
        scrolling
          ? "bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="flex w-full max-w-screen-xl mx-auto items-center">
        {/* Logo */}
        <Link to="/">
          <p className="logo-title text-2xl font-bold text-white">
            AI Tool Hub
          </p>
        </Link>

        {/* Center Navigation */}
        <div className="flex flex-1 justify-center space-x-6 max-sm:hidden">
          <Link
            to="/text-assistance"
            className="text-xl text-gray-200 hover:text-white"
          >
            Text Assistance
          </Link>
          <Link
            to="/text-to-image"
            className="text-xl text-gray-200 hover:text-white"
          >
            Generate Image
          </Link>
          <Link
            to="/text-to-music"
            className="text-xl text-gray-200 hover:text-white"
          >
            Text to Music
          </Link>
          <Link
            to="/image-to-text"
            className="text-xl text-gray-200 hover:text-white"
          >
            Image to Text Converter
          </Link>
          <Link
            to="/text-to-speech"
            className={`text-xl transition-all ${
              location.pathname === "/text-to-speech"
                ? "text-white font-bold"
                : "text-gray-200 hover:text-white"
            }`}
          >
            Text to Speech
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
