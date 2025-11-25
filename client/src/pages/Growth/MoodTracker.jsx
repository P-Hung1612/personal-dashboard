// src/pages/Mood/Tracker.jsx
// ĐÃ ĐỒNG BỘ 100% VỚI CHUẨN OVERVIEW → ĐẸP KHÔNG CẦN CHỈNH!
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smile, Frown, Meh, Heart, Zap, Flame, Calendar, TrendingUp, Sparkles, X
} from "lucide-react";

const MOODS = [
    { value: 5, emoji: "Super Happy", label: "Siêu vui", color: "from-yellow-400 to-orange-500", icon: Smile },
    { value: 4, emoji: "Happy", label: "Vui vẻ", color: "from-green-400 to-emerald-500", icon: Smile },
    { value: 3, emoji: "Neutral", label: "Bình thường", color: "from-gray-400 to-slate-500", icon: Meh },
    { value: 2, emoji: "Sad", label: "Buồn", color: "from-blue-500 to-indigo-600", icon: Frown },
    { value: 1, emoji: "Very Sad", label: "Rất buồn", color: "from-purple-600 to-pink-700", icon: Frown },
];

const EMOTION_TAGS = [
    "Bình yên", "Năng lượng", "Biết ơn", "Lo lắng", "Mệt mỏi", "Căng thẳng",
    "Hào hứng", "Cô đơn", "Được yêu", "Năng suất", "Chán nản", "Tập trung"
];

const getMoodTextColor = (moodValue) => {
    switch (moodValue) {
        case 5: return "text-orange-600 dark:text-orange-400";
        case 4: return "text-green-600 dark:text-green-400";
        case 3: return "text-gray-600 dark:text-gray-400";
        case 2: return "text-blue-600 dark:text-blue-400";
        case 1: return "text-purple-600 dark:text-purple-400";
        default: return "text-gray-600 dark:text-gray-400";
    }
};

export default function MoodTracker() {
    const [entries, setEntries] = useState([]);
    const [todayEntry, setTodayEntry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    // Load & Save
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-mood");
            if (saved) {
                const parsed = JSON.parse(saved);
                setEntries(parsed);
                updateTodayEntry(parsed);
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-mood", JSON.stringify(entries));
        } catch (e) { console.error(e); }
    }, [entries]);

    const todayStr = new Date().toISOString().split("T")[0];

    const updateTodayEntry = (data) => {
        const today = data.find(e => e.date === todayStr);
        setTodayEntry(today || null);
    };

    const openModal = (date = todayStr) => {
        setSelectedDate(date);
        const existing = entries.find(e => e.date === date);
        setTodayEntry(existing || { date, mood: 3, note: "", tags: [] });
        setIsModalOpen(true);
    };

    const saveMood = () => {
        if (!todayEntry) return;
        setEntries(prev => {
            const filtered = prev.filter(e => e.date !== todayEntry.date);
            return [...filtered, { ...todayEntry, updatedAt: new Date().toISOString() }];
        });
        setIsModalOpen(false);
    };

    const getMoodForDate = (dateStr) => entries.find(e => e.date === dateStr);

    const getHeatmapColor = (mood) => {
        if (!mood) return "bg-gray-200 dark:bg-gray-800";
        if (mood >= 5) return "bg-gradient-to-br from-yellow-400 to-orange-500";
        if (mood >= 4) return "bg-gradient-to-br from-green-400 to-emerald-500";
        if (mood === 3) return "bg-gradient-to-br from-gray-400 to-slate-500";
        if (mood === 2) return "bg-gradient-to-br from-blue-500 to-indigo-600";
        return "bg-gradient-to-br from-purple-600 to-pink-700";
    };

    // Stats 30 ngày
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split("T")[0];
    });

    const moodValues = last30Days.map(d => getMoodForDate(d)?.mood || 0);
    const validMoods = moodValues.filter(m => m > 0);
    const avgMood = validMoods.length > 0 ? (validMoods.reduce((a, b) => a + b, 0) / validMoods.length).toFixed(1) : 0;

    const goodStreak = last30Days.reduceRight((streak, date) => {
        const mood = getMoodForDate(date)?.mood || 0;
        return mood >= 4 ? streak + 1 : 0;
    }, 0);

    const tagCount = entries.flatMap(e => e.tags).reduce((acc, tag) => ({ ...acc, [tag]: (acc[tag] || 0) + 1 }), {});
    const topTag = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Chưa có";

    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
                                Theo dõi tâm trạng
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {entries.length} ngày • Chuỗi vui {goodStreak} ngày
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Hiểu cảm xúc của bạn mỗi ngày – để sống trọn vẹn hơn.
                    </p>
                </div>
            </motion.div>

            <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">

                {/* TODAY MOOD CARD */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openModal()}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-10 cursor-pointer hover:shadow-2xl transition-all"
                >
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Hôm nay bạn cảm thấy thế nào?
                    </h2>
                    {todayEntry ? (
                        <div className="text-center pt-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`text-6xl font-bold bg-gradient-to-r ${todayEntry.mood === 5 ? "from-orange-500 to-red-500" :
                                    todayEntry.mood === 4 ? "from-green-500 to-emerald-500" :
                                        todayEntry.mood === 3 ? "from-gray-500 to-slate-500" :
                                            todayEntry.mood === 2 ? "from-blue-500 to-indigo-500" :
                                                "from-purple-600 to-pink-600"
                                    } bg-clip-text text-transparent drop-shadow-lg`}
                            >
                                {MOODS.find(m => m.value === todayEntry.mood)?.emoji}
                            </motion.div>
                            <p className="text-2xl font-bold mt-4">
                                {MOODS.find(m => m.value === todayEntry.mood)?.label}
                            </p>
                            {todayEntry.note && (
                                <p className="mt-6 text-xl italic text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    “{todayEntry.note}”
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="text-8xl mb-4 opacity-30">Question Mark</div>
                            <p className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                                Chưa ghi lại cảm xúc hôm nay
                            </p>
                            <p className="text-xl text-gray-400 mt-4">Bấm vào đây để chọn mood</p>
                        </div>
                    )}
                </motion.div>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <motion.div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl">
                        <TrendingUp className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-5xl font-extrabold">{avgMood}/5</p>
                        <p className="text-xl opacity-90 mt-2">Mood trung bình</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-xl">
                        <Flame className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-5xl font-extrabold">{goodStreak}</p>
                        <p className="text-xl opacity-90 mt-2">Chuỗi ngày vui</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
                        <Heart className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-4xl font-extrabold truncate">{topTag}</p>
                        <p className="text-xl opacity-90 mt-2">Cảm xúc nổi bật</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
                        <Calendar className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-5xl font-extrabold">{entries.length}</p>
                        <p className="text-xl opacity-90 mt-2">Ngày đã ghi</p>
                    </motion.div>
                </div>

                {/* MOOD CALENDAR HEATMAP */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-10"
                >
                    <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white">
                        Lịch tâm trạng 365 ngày
                    </h2>
                    <div className="grid grid-cols-7 gap-3">
                        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(day => (
                            <div key={day} className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 py-2">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: 365 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - i);
                            const dateStr = date.toISOString().split("T")[0];
                            const entry = getMoodForDate(dateStr);
                            const mood = entry?.mood;
                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.3, zIndex: 10 }}
                                    onClick={() => openModal(dateStr)}
                                    className={`aspect-square rounded-2xl ${getHeatmapColor(mood)} flex items-center justify-center text-2xl cursor-pointer shadow-md hover:shadow-xl transition-all`}
                                    title={`${dateStr}${entry ? ` → ${MOODS.find(m => m.value === mood)?.label}` : " → Chưa ghi"}`}
                                >
                                    {entry && MOODS.find(m => m.value === mood)?.emoji}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && todayEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-3xl w-full border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
                                    {selectedDate === todayStr
                                        ? "Hôm nay bạn thế nào?"
                                        : new Date(selectedDate).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="grid grid-cols-5 gap-6 mb-10">
                                {MOODS.map(mood => (
                                    <motion.button
                                        key={mood.value}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setTodayEntry(prev => ({ ...prev, mood: mood.value }))}
                                        className={`p-8 rounded-3xl bg-gradient-to-br ${mood.color} text-white shadow-xl text-xl transition-all ${todayEntry.mood === mood.value ? "ring-8 ring-white ring-offset-4 ring-offset-transparent scale-110" : ""}`}
                                    >
                                        {mood.emoji}
                                    </motion.button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Hôm nay có gì đặc biệt không? Viết ra nhé..."
                                value={todayEntry.note || ""}
                                onChange={e => setTodayEntry(prev => ({ ...prev, note: e.target.value }))}
                                className="w-full p-6 text-xl rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500 focus:outline-none resize-none"
                                rows={4}
                            />

                            <div className="mt-8">
                                <p className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Cảm xúc hôm nay</p>
                                <div className="flex flex-wrap gap-3">
                                    {EMOTION_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setTodayEntry(prev => ({
                                                ...prev,
                                                tags: prev.tags.includes(tag)
                                                    ? prev.tags.filter(t => t !== tag)
                                                    : [...prev.tags, tag]
                                            }))}
                                            className={`px-6 py-3 rounded-full font-medium transition ${todayEntry.tags.includes(tag)
                                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-6 mt-10">
                                <button onClick={() => setIsModalOpen(false)} className="px-10 py-5 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 font-bold text-lg transition">
                                    Hủy
                                </button>
                                <button onClick={saveMood} className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition">
                                    Lưu tâm trạng
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}