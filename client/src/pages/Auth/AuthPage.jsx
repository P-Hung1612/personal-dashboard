// src/pages/Auth/AuthPage.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// Import API
import { loginWithBackend, registerWithBackend } from '../../lib/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm loading để UX tốt hơn

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userData;

      if (isLogin) {
        // ĐĂNG NHẬP QUA BACKEND
        const result = await loginWithBackend(email.trim(), password);
        userData = result.user;

      } else {
        // ĐĂNG KÝ QUA BACKEND
        if (!name.trim()) {
          setError("Vui lòng nhập họ tên");
          setLoading(false);
          return;
        }
        const result = await registerWithBackend(email.trim(), password, name.trim());
        userData = result.user;
      }

      // Đăng nhập thành công → lưu vào AuthContext
      login(userData);
      setConfetti(true);
      setTimeout(() => navigate("/"), 1800);

    } catch (err) {
      // Lỗi từ backend hoặc mạng
      setError(err.message || "Đã có lỗi xảy ra. Thử lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} gravity={0.15} />}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-black px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">

          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Life OS
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              {isLogin ? "Chào mừng trở lại" : "Bắt đầu hành trình của bạn"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30">
            <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-lg font-medium transition ${isLogin ? "bg-white dark:bg-gray-900 shadow-md" : "text-gray-500"}`}>
                Đăng nhập
              </button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-lg font-medium transition ${!isLogin ? "bg-white dark:bg-gray-900 shadow-md" : "text-gray-500"}`}>
                Đăng ký
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-400"
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-400"
                required
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-12 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center font-medium">
                  {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition disabled:opacity-70"
              >
                {loading ? "Đang xử lý..." : (isLogin ? "Đăng nhập ngay" : "Tạo tài khoản miễn phí")}
              </motion.button>
            </form>

            {isLogin && (
              <div className="mt-8 text-center text-sm text-gray-500 space-y-1">
                <p>Tài khoản test nhanh:</p>
                <p className="font-mono text-indigo-600 dark:text-indigo-400">phuoc@lifeos.app · 123456</p>
                <p className="font-mono text-indigo-600 dark:text-indigo-400">demo@lifeos.app · demo</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}