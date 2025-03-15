import { GoogleLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState(""); // Đổi từ email -> username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; // JWT từ Google

    try {
      const response = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }), // Gửi token Google đến backend
      });

      if (!response.ok) throw new Error("Google authentication failed");

      const { token: jwtToken, username } = await response.json();
      login({ token: jwtToken, username }); // Lưu token vào context/localStorage
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      setError("Google login failed");
    }
  };

  const handleGoogleFailure = (error) => {
    console.log("Google Login Failed:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("Sending login request...");
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let message = "Login failed";
        try {
          const data = await response.json();
          message = data.message || message;
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
        throw new Error(message);
      }

      const { token, username } = await response.json();
      console.log("Login successful:", token);
      login({ token, username });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error(err.message, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="flex">
      <div className="w-full h-screen bg-gradient-to-br from-black via-gray-600 to-black flex justify-center items-center">
        <div className="w-1/2 bg-transparent p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white text-center">Login</h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">Or login with</div>

          {/* Google Login Button */}
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
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
