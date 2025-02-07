import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Trạng thái lưu thông tin người dùng

  const login = (userData) => {
    setUser(userData); // Cập nhật thông tin người dùng khi đăng nhập
  };

  const logout = () => {
    setUser(null); // Xóa thông tin người dùng khi đăng xuất
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
