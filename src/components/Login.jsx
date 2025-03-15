import { GoogleLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Xử lý đăng nhập bằng Google
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
      console.log("✅ Response from server:", responseData);

      if (!responseData.username) {
        throw new Error("❌ 'username' field is missing in API response");
      }

      login({ username: responseData.username });
      navigate("/");
    } catch (error) {
      console.error("❌ Google Login Error:", error);
      toast.error(error.message || "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // 🔹 Xử lý đăng nhập truyền thống
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("🔄 Sending login request...");

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text(); // Get response as text
      console.log("📡 Raw API Response:", text); // Debugging step

      let data;
      try {
        data = JSON.parse(text); // Try parsing JSON
      } catch (error) {
        data = { message: text }; // If not JSON, assume text message
      }

      if (!response.ok) {
        throw new Error(data.message || "❌ Login failed");
      }

      // ✅ Log the entire response to debug
      console.log("✅ Parsed Response Data:", data);

      // ✅ Check if token is in the response
      if (!data.token) {
        throw new Error("❌ No token received from the API!");
      }

      console.log("🔑 Received Token:", data.token); // This should log the token

      login(data);
      navigate("/");
    } catch (err) {
      console.error("❌ Login Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex">
      <div className="w-full h-screen bg-gradient-to-br from-black via-gray-600 to-black flex justify-center items-center">
        <div className="w-1/2 bg-transparent p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white text-center">Login</h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          {/* 📝 FORM ĐĂNG NHẬP */}
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
                required
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
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">Or login with</div>

          {/* 📝 Đăng nhập bằng Google */}
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
