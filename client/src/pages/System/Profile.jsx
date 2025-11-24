// src/pages/Profile.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    User, Palette, Moon, Sun, Download, Upload, Trash2,
    Heart, DollarSign, Footprints, Sparkles, Calendar,
    Camera, X, Save, RefreshCw
} from "lucide-react";

export default function Profile() {
    const [name, setName] = useState("Bạn");
    const [bio, setBio] = useState("Đang xây dựng một cuộc đời đáng sống");
    const [themeColor, setThemeColor] = useState("purple");
    const [isDark, setIsDark] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const fileInputRef = useRef(null);

    // Load profile
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-profile");
        if (saved) {
            const data = JSON.parse(saved);
            setName(data.name || "Bạn");
            setBio(data.bio || "");
            setThemeColor(data.themeColor || "purple");
            setAvatar(data.avatar || null);
            setIsDark(data.isDark || false);
            if (data.isDark) document.documentElement.classList.add("dark");
        }
    }, []);

    // Save profile
    const saveProfile = () => {
        const data = { name, bio, themeColor, avatar, isDark };
        localStorage.setItem("lifeos-profile", JSON.stringify(data));
        document.documentElement.style.setProperty("--theme-color", themeColor);
        if (isDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        alert("Đã lưu hồ sơ thành công!");
    };

    // Avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Thống kê
    const stats = {
        moodDays: JSON.parse(localStorage.getItem("lifeos-mood") || "[]").length,
        totalSpent: JSON.parse(localStorage.getItem("lifeos-finance-tx") || "[]")
            .filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0),
        totalSteps: Object.values(JSON.parse(localStorage.getItem("lifeos-health-steps") || "{}"))
            .reduce((a, b) => a + b, 0),
        memories: JSON.parse(localStorage.getItem("lifeos-relationship") || "[]")
            .flatMap(p => p.memories || []).length,
        collection: JSON.parse(localStorage.getItem("lifeos-collection") || "[]").length,
    };

    // Export / Import
    const exportData = () => {
        const data = {
            profile: localStorage.getItem("lifeos-profile"),
            mood: localStorage.getItem("lifeos-mood"),
            finance: localStorage.getItem("lifeos-finance-tx"),
            health: {
                weight: localStorage.getItem("lifeos-health-weight"),
                sleep: localStorage.getItem("lifeos-health-sleep"),
                water: localStorage.getItem("lifeos-health-water"),
                steps: localStorage.getItem("lifeos-health-steps"),
            },
            relationship: localStorage.getItem("lifeos-relationship"),
            collection: localStorage.getItem("lifeos-collection"),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `LifeOS-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                Object.keys(data).forEach(key => {
                    if (key === "health") {
                        Object.keys(data.health).forEach(k => localStorage.setItem(`lifeos-health-${k}`, data.health[k]));
                    } else {
                        localStorage.setItem(`lifeos-${key}`, data[key]);
                    }
                });
                alert("Khôi phục dữ liệu thành công! Refresh lại trang nhé");
            } catch (err) {
                alert("File không hợp lệ");
            }
        };
        reader.readAsText(file);
    };

    const resetAll = () => {
        if (confirm("Bạn chắc chắn muốn XÓA TOÀN BỘ dữ liệu LifeOS? Không thể khôi phục!")) {
            localStorage.clear();
            location.reload();
        }
    };

    const THEMES = [
        { name: "purple", value: "purple" },
        { name: "blue", value: "blue" },
        { name: "green", value: "green" },
        { name: "pink", value: "pink" },
        { name: "orange", value: "orange" },
        { name: "rose", value: "rose" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:to-black">
            <div className="max-w-6xl mx-auto p-6 lg:p-12">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <h1 className="text-8xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-8">
                        <User className="w-20 h-20 text-purple-600" />
                        Hồ sơ cá nhân
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">Đây là bạn – trong vũ trụ LifeOS</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Avatar + Info */}
                    <div className="lg:col-span-1">
                        <motion.div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center">
                            <div className="relative inline-block">
                                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-purple-500 shadow-2xl">
                                    {avatar ? (
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-9xl font-bold">
                                            {name[0]?.toUpperCase() || "B"}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-4 right-4 p-4 bg-black/60 backdrop-blur rounded-full text-white hover:bg-black/80 transition"
                                >
                                    <Camera className="w-8 h-8" />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </div>

                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="text-5xl font-bold mt-8 bg-transparent text-center w-full border-b-4 border-purple-500 focus:outline-none"
                                placeholder="Tên của bạn"
                            />
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                rows={3}
                                className="text-xl text-gray-600 dark:text-gray-400 mt-6 w-full bg-transparent text-center resize-none focus:outline-none"
                                placeholder="Một câu nói về bạn..."
                            />
                        </motion.div>
                    </div>

                    {/* Settings + Stats */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Theme & Mode */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                            <h2 className="text-4xl font-bold mb-8 flex items-center gap-4">
                                <Palette className="w-12 h-12 text-purple-600" /> Giao diện
                            </h2>
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div>
                                    <p className="text-xl font-medium mb-4">Màu chủ đạo</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {THEMES.map(t => (
                                            <button
                                                key={t.value}
                                                onClick={() => setThemeColor(t.value)}
                                                className={`w-20 h-20 rounded-2xl bg-${t.value}-500 ${themeColor === t.value ? "ring-8 ring-white ring-offset-4 shadow-2xl scale-110" : ""} transition`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xl font-medium mb-4">Chế độ</p>
                                    <button
                                        onClick={() => setIsDark(!isDark)}
                                        className="relative w-48 h-28 bg-gray-200 dark:bg-gray-700 rounded-full shadow-xl overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            animate={{ x: isDark ? 100 : -100 }}
                                        >
                                            {isDark ? <Moon className="w-16 h-16 text-yellow-400" /> : <Sun className="w-16 h-16 text-yellow-500" />}
                                        </motion.div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                            <h2 className="text-4xl font-bold mb-8">Hành trình của bạn</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <Heart className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                                    <p className="text-5xl font-bold">{stats.moodDays}</p>
                                    <p className="text-xl text-gray-600">Ngày mood</p>
                                </div>
                                <div className="text-center">
                                    <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                    <p className="text-5xl font-bold">{stats.totalSpent.toLocaleString()}đ</p>
                                    <p className="text-xl text-gray-600">Đã chi</p>
                                </div>
                                <div className="text-center">
                                    <Footprints className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                                    <p className="text-5xl font-bold">{stats.totalSteps.toLocaleString()}</p>
                                    <p className="text-xl text-gray-600">Bước chân</p>
                                </div>
                                <div className="text-center">
                                    <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                                    <p className="text-5xl font-bold">{stats.memories + stats.collection}</p>
                                    <p className="text-xl text-gray-600">Ký ức đẹp</p>
                                </div>
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                            <h2 className="text-4xl font-bold mb-8">Dữ liệu</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <button onClick={exportData} className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl flex flex-col items-center gap-4 hover:scale-105 transition">
                                    <Download className="w-12 h-12" />
                                    <span className="text-2xl font-bold">Export dữ liệu</span>
                                </button>
                                <label className="p-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl shadow-xl flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition">
                                    <Upload className="w-12 h-12" />
                                    <span className="text-2xl font-bold">Import dữ liệu</span>
                                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                                </label>
                                <button onClick={resetAll} className="p-8 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl shadow-xl flex flex-col items-center gap-4 hover:scale-105 transition">
                                    <Trash2 className="w-12 h-12" />
                                    <span className="text-2xl font-bold">Reset tất cả</span>
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="text-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                onClick={saveProfile}
                                className="px-16 py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl font-bold rounded-full shadow-2xl flex items-center gap-6 mx-auto"
                            >
                                <Save className="w-12 h-12" />
                                Lưu hồ sơ
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}