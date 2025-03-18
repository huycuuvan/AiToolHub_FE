import { GoogleLogin } from "@react-oauth/google";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import gsap from "gsap";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const heroRef = useRef(null);
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      console.log("✅ Google Credential Response:", credentialResponse);
      const response = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!response.ok) throw new Error("Google authentication failed");

      const responseData = await response.json();
      login({ username: responseData.username });
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };
  useEffect(() => {
    const images = [
      "bg-hero-pattern",
      "bg-hero-pattern-1",
      "bg-hero-pattern-2",
    ];
    let currentIndex = 0;

    const changeBackground = () => {
      if (heroRef.current) {
        heroRef.current.classList.remove(images[currentIndex]);
        currentIndex = (currentIndex + 1) % images.length;
        heroRef.current.classList.add(images[currentIndex]);
      }
    };

    const transitionDuration = 1;
    const intervalDuration = 5;

    const interval = setInterval(() => {
      gsap.to(heroRef.current, {
        opacity: 0,
        duration: transitionDuration,
        onComplete: () => {
          changeBackground();
          gsap.to(heroRef.current, {
            opacity: 1,
            duration: transitionDuration,
          });
        },
      });
    }, intervalDuration * 1000);

    return () => clearInterval(interval);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "❌ Login failed");

      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen mix-blend-overlay">
      {/* Left Side - Slideshow or Background Image */}
      <div
        ref={heroRef}
        className="hidden md:flex w-1/2 bg-hero-pattern bg-cover bg-center box-shadow-lg "
      >
        {/* Optional: Overlay */}
        <div className="w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <h2 className="text-white text-3xl font-bold">
            Welcome to Our Platform
          </h2>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gradient-to-br from-black via-gray-700 to-black ">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white text-center">Login</h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          {/* Login Form */}
          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="mb-5">
              <input
                type="text"
                id="username"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 text-white font-bold rounded-lg transition duration-300 ease-in-out 
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 active:bg-indigo-800"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">Or login with</div>

          {/* Google Login */}
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              disabled={isGoogleLoading}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-white">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-indigo-400 hover:text-indigo-500 font-bold"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
