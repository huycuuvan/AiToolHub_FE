import gsap from "gsap";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation(); // Get current path

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

  return (
    <header className=" top-0 left-0 w-full py-5 sm:px-10 px-5 flex justify-between items-center bg-transparent z-30 ">
      <nav className="flex w-full max-w-screen-xl mx-auto">
        <Link to="/">
          <p className="logo-title text-2xl font-bold text-white">
            AI Tool Hub
          </p>
        </Link>
        <div className="flex flex-1 justify-center space-x-6 max-sm:hidden">
          <Link
            to="/text-assistance"
            className={`px-5 text-xl cursor-pointer transition-all ${
              location.pathname === "/text-assistance"
                ? "text-white font-bold"
                : "text-gray-200 hover:text-white"
            }`}
          >
            Text Assistance
          </Link>
          <Link
            to="/text-to-image"
            className={`px-5 text-xl cursor-pointer transition-all ${
              location.pathname === "/text-to-image"
                ? "text-white font-bold"
                : "text-gray-200 hover:text-white"
            }`}
          >
            Generate Image
          </Link>
          <Link
            to="/text-to-speech"
            className={`px-5 text-xl cursor-pointer transition-all ${
              location.pathname === "/text-to-speech"
                ? "text-white font-bold"
                : "text-gray-200 hover:text-white"
            }`}
          >
            Text to Music
          </Link>
          <Link
            to="/image-to-text"
            className={`px-5 text-xl cursor-pointer transition-all ${
              location.pathname === "/image-to-text"
                ? "text-white font-bold"
                : "text-gray-200 hover:text-white"
            }`}
          >
            Image to Text Converter
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-200">{user.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
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
