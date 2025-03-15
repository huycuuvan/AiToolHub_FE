import { GoogleLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await fetch("http://localhost:8080/api/auth/google", {
        method: "GET", // Đúng với route trong backend
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Google authentication failed");

      const data = await response.text(); // Backend trả về token text
      login({ token: data }); // Lưu token vào context hoặc localStorage
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      setError("Google login failed");
    }
  };

  const handleGoogleFailure = (error) => {
    console.log("Google Login Failed:", error);
    setError("Google login failed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const token = await response.text();
      login({ token });
      navigate("/");
    } catch (err) {
      setError(err.message);
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded text-black"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">Or login with</div>
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-white">
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-400">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
