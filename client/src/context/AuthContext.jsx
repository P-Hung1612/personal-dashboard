// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loadData, saveData } from "../lib/api.js"; // Import API

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // Thông tin user (email, name)
  const [userData, setUserData] = useState(null); // Toàn bộ dữ liệu: tasks, notes, goals...
  const [loading, setLoading] = useState(true);   // Loading toàn app

  // Khi app khởi động → kiểm tra xem có user đang đăng nhập không
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("lifeos_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Load dữ liệu thật từ backend (hoặc LocalStorage nếu backend tắt)
        const data = await loadData(parsedUser.email);
        if (data) {
          setUserData(data);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Hàm login – được gọi từ AuthPage
  const login = async (userInfo) => {
    localStorage.setItem("lifeos_user", JSON.stringify(userInfo));
    setUser(userInfo);

    // Load dữ liệu ngay sau khi login
    const data = await loadData(userInfo.email);
    if (data) {
      setUserData(data);
    }
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("lifeos_user");
    setUser(null);
    setUserData(null);
  };

  // Auto-save mỗi khi userData thay đổi (rất quan trọng!)
  useEffect(() => {
    if (user && userData) {
      const timeoutId = setTimeout(() => {
        saveData({ ...userData, email: user.email });
        console.log("Auto-save dữ liệu thành công!");
      }, 1000); // debounce 1 giây để không lưu quá nhiều

      return () => clearTimeout(timeoutId);
    }
  }, [userData, user]);

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      setUserData,    // Rất quan trọng: để các page khác cập nhật dữ liệu
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};