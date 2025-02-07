import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential; // Lấy JWT từ response
    const decodedToken = jwtDecode(token); // Giải mã JWT

    console.log("Decoded Token:", decodedToken); // Xem thông tin người dùng trong console

    const userData = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture, // Ảnh đại diện của người dùng
    };

    login(userData); // Cập nhật trạng thái người dùng
    navigate("/"); // Chuyển hướng về trang chủ
  };
  const handleGoogleFailure = (error) => {
    console.log("Google Login Failed:", error);
  };

  return (
    <div className="flex">
      <div className="w-full h-screen bg-gradient-to-br from-black via-gray-600 to-black flex justify-center items-center">
        <div className="w-1/2 bg-transparent p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white text-center">Login</h1>
          <form className="mt-5">
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
