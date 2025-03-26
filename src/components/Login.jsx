import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define icons
const Icons = {
  spinner: (props) => (
    <div
      className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"
      {...props}
    />
  ),
  google: (props) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
  ),
};

// Form validation schema using zod
const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const heroRef = useRef(null);

  // Use react-hook-form for form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Background slideshow effect
  useEffect(() => {
    const images = [
      "bg-hero-pattern",
      "bg-hero-pattern-1",
      "bg-hero-pattern-2",
    ];

    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const backgrounds = [
    "bg-hero-pattern",
    "bg-hero-pattern-1",
    "bg-hero-pattern-2",
  ];

  // Handle Google login
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
      toast.success("Successfully logged in with Google!");
    } catch (error) {
      toast.error(error.message || "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      login(responseData);
      navigate("/");
      toast.success("Successfully logged in!");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Hero/Slideshow */}
      <motion.div
        ref={heroRef}
        className={`hidden md:flex w-1/2 bg-cover bg-center relative ${backgrounds[backgroundIndex]}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        key={backgroundIndex}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl max-w-md text-center text-white/80">
              Sign in to access your account and continue your journey with us.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                Login to your account
              </h2>
              <p className="text-gray-400 text-center mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-white"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    placeholder="Enter your username"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-white"
                    >
                      Password
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-indigo-400 hover:text-indigo-500 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500"
                    {...register("rememberMe")}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-300 font-normal"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 px-4 text-white font-bold rounded-lg transition duration-300 ease-in-out ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 active:bg-indigo-800"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin inline-block" />
                      Logging in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <hr className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-800 px-2 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  {/* Google Login Component */}
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    disabled={isGoogleLoading}
                    render={(renderProps) => (
                      <span
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                      >
                        {/* The button inside GoogleLogin will be rendered separately now */}
                      </span>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center border-t border-gray-700 pt-4 pb-6">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-indigo-400 hover:text-indigo-500 hover:underline font-medium"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
