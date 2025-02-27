import { useState } from "react";
import { useNavigate } from "react-router";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-white text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            name="username"
            placeholder="Name"
            className="w-full p-2 mb-3 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-3 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-3 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
