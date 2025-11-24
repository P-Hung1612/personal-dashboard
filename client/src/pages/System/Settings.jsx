// src/pages/Settings.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Palette, Moon, Sun, Bell, Volume2, Download, Upload,
    Trash2, Keyboard, Sparkles, Gauge, Type, RefreshCw,
    Save, X, Check, Zap
} from "lucide-react";

const THEMES = [
    { name: "Tím huyền bí", value: "purple", from: "from-purple-500", to: "to-pink-500" },
    { name: "Xanh biển sâu", value: "blue", from: "from-blue-500", to: "to-cyan-500" },
    { name: "Xanh rừng", value: "emerald", from: "from-emerald-500", to: "to-teal-600" },
    { name: "Hồng phấn", value: "pink", from: "from-pink-500", to: "to-rose-500" },
    { name: "Cam lửa", value: "orange", from: "from-orange-500", to: "to-red-500" },
    { name: "Vàng nắng", value: "yellow", from: "from-yellow-400", to: "to-amber-600" },
];

export default function Settings() {
    const [theme, setTheme] = useState("purple");
    const [isDark, setIsDark] = useState(false);
    const [fontSize, setFontSize] = useState("medium");
    const [animationSpeed, setAnimationSpeed] = useState("normal");
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("lifeos-settings");
        if (saved) {
            const s = JSON.parse(saved);
            setTheme(s.theme || "purple");
            setIsDark(s.isDark || false);
            setFontSize(s.fontSize || "medium");
            setAnimationSpeed(s.animationSpeed || "normal");
            setNotifications(s.notifications !== false);
            setSound(s.sound !== false);

            // Apply
            document.documentElement.classList.toggle("dark", s.isDark);
            document.documentElement.style.setProperty("--theme-primary", s.theme || "purple");
            document.documentElement.style.setProperty("--font-size", s.fontSize || "medium");
            document.documentElement.style.setProperty("--animation-speed", s.animationSpeed || "normal");
        }
    }, []);

    const saveSettings = () => {
        const settings = { theme, isDark, fontSize, animationSpeed, notifications, sound };
        localStorage.setItem("lifeos-settings", JSON.stringify(settings));
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.style.setProperty("--theme-primary", theme);
        alert("Đã lưu cài đặt thành công!");
    };

    const exportAllData = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("lifeos-")) {
                data[key] = localStorage.getItem(key);
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `LifeOS-full-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
    };

    const importAllData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
                alert("Khôi phục thành công! Đang tải lại...");
                setTimeout(() => location.reload(), 1000);
            } catch { alert("File không hợp lệ"); }
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-black">
            <div className="max-w-6xl mx-auto p-6 lg:p-12">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <h1 className="text-8xl font-bold text-gray-800 dark:text-white mb-6 flex items-center justify-center gap-8">
                        <Zap className="w-20 h-20 text-purple-600" />
                        Cài đặt LifeOS
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">Tùy chỉnh mọi thứ theo cách của bạn</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Appearance */}
                    <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
                        <h2 className="text-5xl font-bold mb-10 flex items-center gap-4">
                            <Palette className="w-14 h-14 text-purple-600" /> Giao diện
                        </h2>

                        {/* Theme Color */}
                        <div className="mb-10">
                            <p className="text-2xl font-medium mb-6">Màu chủ đạo</p>
                            <div className="grid grid-cols-3 gap-6">
                                {THEMES.map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTheme(t.value)}
                                        className={`relative p-8 rounded-3xl bg-gradient-to-br ${t.from} ${t.to} text-white font-bold text-xl shadow-xl transition-all ${theme === t.value ? "scale-110 ring-8 ring-white/50" : "opacity-80 hover:opacity-100"}`}
                                    >
                                        {theme === t.value && <Check className="w-10 h-10 absolute top-4 right-4" />}
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dark Mode */}
                        <div className="mb-10">
                            <p className="text-2xl font-medium mb-6">Chế độ tối</p>
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="relative w-80 h-40 bg-gray-200 dark:bg-gray-700 rounded-full shadow-2xl overflow-hidden"
                            >
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ x: isDark ? 140 : -140 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {isDark ? <Moon className="w-24 h-24 text-yellow-300" /> : <Sun className="w-24 h-24 text-yellow-500" />}
                                </motion.div>
                                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-700 dark:text-gray-300">
                                    {isDark ? "Dark Mode" : "Light Mode"}
                                </span>
                            </button>
                        </div>

                        {/* Font & Animation */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-2xl font-medium mb-4">Kích thước chữ</p>
                                <select value={fontSize} onChange={e => setFontSize(e.target.value)}
                                    className="w-full px-8 py-6 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700">
                                    <option value="small">Nhỏ</option>
                                    <option value="medium">Vừa</option>
                                    <option value="large">Lớn</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-2xl font-medium mb-4">Tốc độ hiệu ứng</p>
                                <select value={animationSpeed} onChange={e => setAnimationSpeed(e.target.value)}
                                    className="w-full px-8 py-6 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700">
                                    <option value="fast">Nhanh</option>
                                    <option value="normal">Bình thường</option>
                                    <option value="slow">Chậm</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Notifications & Data */}
                    <div className="space-y-10">

                        {/* Notifications */}
                        <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
                            <h2 className="text-5xl font-bold mb-8 flex items-center gap-4">
                                <Bell className="w-14 h-14 text-purple-600" /> Thông báo & Âm thanh
                            </h2>
                            <div className="space-y-8">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-3xl">Thông báo nhắc nhở</span>
                                    <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)}
                                        className="w-16 h-16 accent-purple-600" />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-3xl">Âm thanh khi hoàn thành</span>
                                    <input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)}
                                        className="w-16 h-16 accent-purple-600" />
                                </label>
                            </div>
                        </motion.div>

                        {/* Data Management */}
                        <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
                            <h2 className="text-5xl font-bold mb-8">Dữ liệu</h2>
                            <div className="grid grid-cols-3 gap-6">
                                <button onClick={exportAllData}
                                    className="p-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-2xl hover:scale-105 transition flex flex-col items-center gap-4">
                                    <Download className="w-16 h-16" />
                                    <span className="text-2xl font-bold">Backup</span>
                                </button>

                                <label className="p-10 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-3xl shadow-2xl hover:scale-105 transition flex flex-col items-center gap-4 cursor-pointer">
                                    <Upload className="w-16 h-16" />
                                    <span className="text-2xl font-bold">Restore</span>
                                    <input type="file" accept=".json" onChange={importAllData} className="hidden" />
                                </label>

                                <button onClick={resetEverything}
                                    className="p-10 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-3xl shadow-2xl hover:scale-105 transition flex flex-col items-center gap-4">
                                    <Trash2 className="w-16 h-16" />
                                    <span className="text-2xl font-bold">Reset</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Shortcuts */}
                        <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
                            <h2 className="text-5xl font-bold mb-8 flex items-center gap-4">
                                <Keyboard className="w-14 h-14 text-purple-600" /> Phím tắt
                            </h2>
                            <div className="space-y-4 text-2xl">
                                <div className="flex justify-between"><span>Trang chủ</span><kbd className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">H</kbd></div>
                                <div className="flex justify-between"><span>Mood</span><kbd className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">M</kbd></div>
                                <div className="flex justify-between"><span>Finance</span><kbd className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">F</kbd></div>
                                <div className="flex justify-between"><span>Health</span><kbd className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">L</kbd></div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="text-center mt-20">
                    <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        onClick={saveSettings}
                        className="px-24 py-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl font-bold rounded-full shadow-2xl flex items-center gap-8 mx-auto"
                    >
                        <Save className="w-16 h-16" />
                        LƯU TẤT CẢ CÀI ĐẶT
                    </motion.button>
                </div>

                {/* Easter Egg */}
                <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
                    <p className="text-xl">LifeOS v1.0 • Built with love in Việt Nam</p>
                </div>
            </div>
        </div>
    );
}