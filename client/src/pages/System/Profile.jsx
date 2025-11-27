// src/pages/Life/Profile.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI FINANCE & COLLECTION → ĐẸP KHÔNG THỂ CHỐNG CỰ!
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Palette, Moon, Sun, Download, Upload, Trash2,
    Heart, DollarSign, Footprints, Sparkles, Camera, Save
} from "lucide-react";

const THEMES = {
    purple: "from-purple-600 via-pink-600 to-rose-600",
    blue: "from-blue-600 via-cyan-600 to-teal-600",
    green: "from-emerald-600 via-green-600 to-teal-600",
    pink: "from-pink-600 via-rose-600 to-red-600",
    orange: "from-orange-600 via-amber-600 to-yellow-600",
    rose: "from-rose-600 via-pink-600 to-purple-600",
};

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
            setIsDark(data.isDark ?? false);
            if (data.isDark) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
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

    // Thống kê toàn hệ thống
    const stats = {
        moodDays: JSON.parse(localStorage.getItem("lifeos-mood") || "[]").length,
        totalSpent: JSON.parse(localStorage.getItem("lifeos-finance-tx") || "[]")
            .filter(t => t.type === "expense")
            .reduce((a, t) => a + t.amount, 0),
        totalSteps: Object.values(JSON.parse(localStorage.getItem("lifeos-health-steps") || "{}"))
            .reduce((a, b) => a + b, 0),
        memories: JSON.parse(localStorage.getItem("lifeos-relationship") || "[]")
            .flatMap(p => p.memories || []).length,
        collection: JSON.parse(localStorage.getItem("lifeos-collection") || "[]").length,
    };

    // Export / Import / Reset
    const exportData = () => {
        const data = {
            profile: localStorage.getItem("lifeos-profile"),
            mood: localStorage.getItem("lifeos-mood"),
            finance: localStorage.getItem("lifeos-finance-tx"),
            financeWallets: localStorage.getItem("lifeos-finance-wallets"),
            financeBudget: localStorage.getItem("lifeos-finance-budget"),
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
                Object.entries(data).forEach(([key, value]) => {
                    if (key === "health") {
                        Object.entries(value).forEach(([k, v]) => localStorage.setItem(`lifeos-health-${k}`, v));
                    } else {
                        if (value !== null) localStorage.setItem(`lifeos-${key}`, value);
                    }
                });
                alert("Khôi phục dữ liệu thành công! Đang reload...");
                setTimeout(() => location.reload(), 1000);
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

    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN LIFE OS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r ${THEMES[themeColor]} dark:from-purple-900 dark:via-pink-900 dark:to-rose-900 text-white p-8 lg:p-14`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-6">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Đây là bạn – trung tâm của vũ trụ LifeOS. Tùy chỉnh để mọi thứ thật sự là của bạn.
                    </p>
                </div>
            </motion.div>

            <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
                {/* AVATAR + INFO CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10 text-center"
                >
                    <div className="relative inline-block mb-8">
                        <div className="w-64 h-64 rounded-full overflow-hidden ring-8 ring-white dark:ring-gray-800 shadow-2xl">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${THEMES[themeColor]} flex items-center justify-center text-white text-9xl font-bold`}>
                                    {name[0]?.toUpperCase() || "B"}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-4 right-4 p-4 bg-black/60 backdrop-blur-xl rounded-full text-white hover:bg-black/80 transition"
                        >
                            <Camera className="w-10 h-10" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </div>

                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Tên của bạn"
                        className="text-5xl lg:text-6xl font-extrabold bg-transparent text-center w-full focus:outline-none mb-6"
                    />
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={3}
                        placeholder="Một câu nói về bạn..."
                        className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 bg-transparent text-center w-full resize-none focus:outline-none"
                    />
                </motion.div>

                {/* STATS GRID – giống Finance */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                    {[
                        { icon: Heart, label: "Ngày mood", value: stats.moodDays, gradient: "from-pink-500 to-rose-600" },
                        { icon: DollarSign, label: "Đã chi tiêu", value: `${(stats.totalSpent / 1000000).toFixed(1)}tr`, gradient: "from-red-500 to-rose-600" },
                        { icon: Footprints, label: "Bước chân", value: stats.totalSteps.toLocaleString(), gradient: "from-emerald-500 to-teal-600" },
                        { icon: Sparkles, label: "Ký ức", value: stats.memories + stats.collection, gradient: "from-purple-500 to-pink-600" },
                        { icon: User, label: "Hành trình", value: "Đang tỏa sáng", gradient: "from-yellow-500 to-orange-600" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-8 text-white shadow-2xl text-center`}
                        >
                            <stat.icon className="w-14 h-14 mx-auto mb-4 opacity-90" />
                            <p className="text-4xl font-extrabold">{stat.value}</p>
                            <p className="text-xl opacity-90 mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* THEME & DARK MODE */}
                {/* <div className="grid lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10"
                    >
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                            <Palette className="w-10 h-10" /> Màu chủ đạo
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            {Object.keys(THEMES).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setThemeColor(key)}
                                    className={`h-24 rounded-2xl bg-gradient-to-br ${THEMES[key]} ${themeColor === key ? "ring-8 ring-white shadow-2xl scale-110" : ""} transition-all`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 flex items-center justify-center"
                    >
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="relative w-64 h-32 bg-gray-200 dark:bg-gray-700 rounded-full shadow-2xl overflow-hidden"
                        >
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{ x: isDark ? 120 : -120 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {isDark ? <Moon className="w-20 h-20 text-yellow-400" /> : <Sun className="w-20 h-20 text-yellow-500" />}
                            </motion.div>
                            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                                {isDark ? "Dark Mode" : "Light Mode"}
                            </span>
                        </button>
                    </motion.div>
                </div> */}

                {/* DATA MANAGEMENT */}
                {/* <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                    <h2 className="text-3xl font-bold mb-10">Quản lý dữ liệu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <button
                            onClick={exportData}
                            className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl shadow-2xl hover:shadow-emerald-500/50 flex flex-col items-center gap-4 hover:scale-105 transition"
                        >
                            <Download className="w-14 h-14" />
                            <span className="text-2xl font-bold">Export dữ liệu</span>
                        </button>

                        <label className="p-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-3xl shadow-2xl hover:shadow-cyan-500/50 flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition">
                            <Upload className="w-14 h-14" />
                            <span className="text-2xl font-bold">Import dữ liệu</span>
                            <input type="file" accept=".json" onChange={importData} className="hidden" />
                        </label>

                        <button
                            onClick={resetAll}
                            className="p-8 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-3xl shadow-2xl hover:shadow-red-500/50 flex flex-col items-center gap-4 hover:scale-105 transition"
                        >
                            <Trash2 className="w-14 h-14" />
                            <span className="text-2xl font-bold">Reset tất cả</span>
                        </button>
                    </div>
                </div> */}

                {/* SAVE BUTTON */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveProfile}
                        className="px-20 py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl font-bold rounded-full shadow-2xl flex items-center gap-6 mx-auto hover:shadow-purple-500/50 transition"
                    >
                        <Save className="w-12 h-12" />
                        Lưu hồ sơ
                    </motion.button>
                </div>
            </div>
        </>
    );
}