// src/components/Navbar.jsx  (hoặc đâu đó bạn đang để)
import { useAuth } from "../context/AuthContext.jsx";  // nếu bạn dùng AuthContext như mình gửi ở trên
// Nếu bạn đang dùng AuthContext inline trong App.jsx thì đổi thành:
// import { useAuth } from "../App";

import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            {/* Logo / Tên app */}
            <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Life OS
                </h1>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {user ? (
                    // ĐÃ ĐĂNG NHẬP
                    <div className="flex items-center gap-4">
                        {/* Avatar + tên */}
                        {/* <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                {user.name?.charAt(0).toUpperCase() || <User size={20} />}
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                                {user.name || user.email}
                            </span>
                        </div> */}

                        {/* Nút đăng xuất */}
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Đăng xuất</span>
                        </button>
                    </div>
                ) : (
                    // CHƯA ĐĂNG NHẬP
                    <div className="flex gap-3 items-center">
                        <Link
                            to="/register"
                            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
                        >
                            Đăng ký
                        </Link>
                        <Link
                            to="/login"
                            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-md transition transform hover:scale-105"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}