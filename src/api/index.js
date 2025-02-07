// src/api/index.js
import axios from "axios";

// Tạo instance của Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/tools/model2", // URL cơ sở của API

  headers: {
    "Content-Type": "application/json", // Loại nội dung mặc định
  },
});

export default axiosInstance;
