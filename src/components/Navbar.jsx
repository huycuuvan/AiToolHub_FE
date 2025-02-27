import gsap from "gsap";
import { Link } from "react-router";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Truy cập thông tin người dùng và phương thức logout

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
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center bg-tr">
      <nav className="flex w-full screen-max-width">
        <Link to="/">
          <p className="logo-title">AI Tool Hub</p>
        </Link>
        <div className="flex flex-1 justify-center max-sm:hidden">
          <Link
            to="/text-assistance"
            className="px-5 text-3xl cursor-pointer text-white hover:text-white transition-all"
          >
            Text Assistance
          </Link>
          <Link
            to="/text-to-image"
            className="px-5 text-3xl cursor-pointer text-white hover:text-white transition-all"
          >
            Generate Image
          </Link>
          <Link
            to="/text-to-speech"
            className="px-5 text-3xl cursor-pointer text-white hover:text-white transition-all"
          >
            Text to speech
          </Link>
          <Link
            to="/image-to-text"
            className="px-5 text-3xl cursor-pointer text-white hover:text-white transition-all"
          >
            Image to Text Converter
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-2xl text-white">{user.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-3xl">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};
