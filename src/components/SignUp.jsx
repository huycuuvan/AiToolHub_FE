import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import gsap from "gsap";
import "react-toastify/dist/ReactToastify.css";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const heroRef = useRef(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Sign-up failed");
      }

      toast.success("Sign-up successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.message, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Animated Background */}
      <div
        ref={heroRef}
        className="hidden md:flex w-1/2 bg-hero-pattern bg-cover bg-center"
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <h2 className="text-white text-3xl font-bold">Join Us Today!</h2>
        </div>
      </div>

      {/* Right Side - Sign-Up Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gradient-to-br from-black via-gray-700 to-black">
        <ToastContainer />
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white text-center">Sign Up</h1>

          <form onSubmit={handleSubmit} className="mt-5">
            <div className="mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-lg shadow-md transition duration-300 ease-in-out 
             hover:bg-green-700 hover:shadow-lg 
             focus:outline-none focus:ring-4 focus:ring-green-300 
             active:bg-green-800"
            >
              Register
            </button>
          </form>

          <p className="text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-400 hover:text-indigo-500 font-bold transition duration-300 ease-in-out 
                 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
