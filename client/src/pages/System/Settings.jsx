// src/pages/Life/Settings.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI FINANCE • COLLECTION • PROFILE → ĐẸP KHÔNG THỂ CHỐNG CỰ!
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Palette, Moon, Sun, Bell, Volume2, Download, Upload,
    Trash2, Sparkles, Save, Zap, Gauge, Check
} from "lucide-react";

const THEMES = {
    purple: "from-purple-600 via-pink-600 to-rose-600",
    blue: "from-blue-600 via-cyan-600 to-teal-600",
    emerald: "from-emerald-600 via-green-600 to-teal-700",
    pink: "from-pink-600 via-rose-600 to-red-600",
    orange: "from-orange-600 via-amber-600 to-yellow-600",
    yellow: "from-yellow-500 via-amber-500 to-orange-600",
};

const THEME_LABELS = {
    purple: "Tím huyền bí",
    blue: "Xanh biển sâu",
    emerald: "Xanh rừng",
    pink: "Hồng phấn",
    orange: "Cam lửa",
    yellow: "Vàng nắng",
};

export default function Settings() {
    const [theme, setTheme] = useState("purple");
    const [isDark, setIsDark] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    // Load settings
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-settings");
        if (saved) {
            const s = JSON.parse(saved);
            setTheme(s.theme || "purple");
            setIsDark(s.isDark || false);
            setNotifications(s.notifications !== false);
            setSound(s.sound !== false);

            // Apply immediately
            if (s.isDark) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
        }
    }, []);

    const saveSettings = () => {
        const settings = { theme, isDark, notifications, sound };
        localStorage.setItem("lifeos-settings", JSON.stringify(settings));

        if (isDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");

        alert("Đã lưu cài đặt thành công!");
    };

    const exportAllData = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("lifeos-")) data[key] = localStorage.getItem(key);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `LifeOS-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
    };

    const importAllData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
                alert("Khôi phục thành công! Đang reload...");
                setTimeout(() => location.reload(), 1000);
            } catch {
                alert("File không hợp lệ");
            }
        };
        reader.readAsText(file);
    };

    const resetEverything = () => {
        if (confirm("XÓA TOÀN BỘ DỮ LIỆU LifeOS? Không thể khôi phục!")) {
            localStorage.clear();
            location.reload();
        }
    };

    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN LIFE OS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r ${THEMES[theme]} dark:from-purple-900 dark:via-pink-900 dark:to-rose-900 text-white p-8 lg:p-14`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-6">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Cài đặt</h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Tùy chỉnh LifeOS để nó thực sự là của bạn – màu sắc, cảm xúc, phong cách.
                    </p>
                </div>
            </motion.div>

            <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
                {/* THEME SELECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10"
                >
                    <h2 className="text-4xl font-extrabold mb-10 flex items-center gap-5">
                        <Palette className="w-14 h-14 text-purple-600" />
                        Màu chủ đạo
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {Object.entries(THEMES).map(([key, gradient]) => (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTheme(key)}
                                className={`relative h-32 rounded-3xl bg-gradient-to-br ${gradient} shadow-2xl transition-all ${theme === key ? "ring-8 ring-white/50 scale-110 shadow-purple-500/50" : ""
                                    }`}
                            >
                                <div className="absolute inset-0 rounded-3xl bg-black/20 backdrop-blur-sm flex items-center justify-center">
                                    <p className="text-2xl font-bold text-white drop-shadow-lg">
                                        {THEME_LABELS[key]}
                                    </p>
                                </div>
                                {theme === key && (
                                    <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                                        <Check className="w-8 h-8 text-purple-600" />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* DARK MODE + NOTIFICATIONS */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Dark Mode */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center"
                    >
                        <h3 className="text-3xl font-bold mb-8">Chế độ tối</h3>
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="relative w-72 h-36 bg-gray-200 dark:bg-gray-700 rounded-full shadow-2xl overflow-hidden mx-auto"
                        >
                            <motion.div
                                animate={{ x: isDark ? 130 : -130 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                {isDark ? <Moon className="w-24 h-24 text-yellow-400" /> : <Sun className="w-24 h-24 text-yellow-500" />}
                            </motion.div>
                            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-2xl font-bold">
                                {isDark ? "Dark Mode" : "Light Mode"}
                            </p>
                        </button>
                    </motion.div>

                    {/* Notifications & Sound */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 space-y-8"
                    >
                        <h3 className="text-3xl font-bold flex items-center gap-4">
                            <Bell className="w-12 h-12" /> Thông báo & Âm thanh
                        </h3>
                        <label className="flex items-center justify-between text-2xl">
                            <span>Thông báo nhắc nhở</span>
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={e => setNotifications(e.target.checked)}
                                className="w-14 h-14 rounded-xl accent-purple-600"
                            />
                        </label>
                        <label className="flex items-center justify-between text-2xl">
                            <span>Âm thanh hoàn thành</span>
                            <input
                                type="checkbox"
                                checked={sound}
                                onChange={e => setSound(e.target.checked)}
                                className="w-14 h-14 rounded-xl accent-purple-600"
                            />
                        </label>
                    </motion.div>
                </div>

                {/* DATA MANAGEMENT – giống Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-12"
                >
                    <h2 className="text-4xl font-extrabold mb-10 flex items-center gap-5">
                        <Gauge className="w-14 h-14 text-emerald-600" />
                        Quản lý dữ liệu
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <button
                            onClick={exportAllData}
                            className="p-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-2xl hover:shadow-emerald-500/50 flex flex-col items-center gap-4 hover:scale-105 transition"
                        >
                            <Download className="w-16 h-16" />
                            <span className="text-2xl font-bold">Backup toàn bộ</span>
                        </button>

                        <label className="p-10 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-3xl shadow-2xl hover:shadow-cyan-500/50 flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition">
                            <Upload className="w-16 h-16" />
                            <span className="text-2xl font-bold">Khôi phục</span>
                            <input type="file" accept=".json" onChange={importAllData} className="hidden" />
                        </label>

                        <button
                            onClick={resetEverything}
                            className="p-10 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-3xl shadow-2xl hover:shadow-red-500/50 flex flex-col items-center gap-4 hover:scale-105 transition"
                        >
                            <Trash2 className="w-16 h-16" />
                            <span className="text-2xl font-bold">Xóa tất cả</span>
                        </button>
                    </div>
                </motion.div>

                {/* SAVE BUTTON */}
                <div className="text-center py-12">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveSettings}
                        className="px-24 py-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl font-bold rounded-full shadow-2xl flex items-center gap-8 mx-auto hover:shadow-purple-500/50 transition"
                    >
                        <Save className="w-8 h-8" />
                        Lưu tất cả cài đặt
                    </motion.button>
                </div>

                {/* Easter Egg */}
                <div className="text-center text-gray-500 dark:text-gray-400 pb-20">
                    <p className="text-xl opacity-70">LifeOS v1.0 • Made with blood, sweat & love in Việt Nam</p>
                </div>
            </div>
        </>
    );
};
