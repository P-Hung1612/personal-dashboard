// src/pages/Mood/Tracker.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smile, Frown, Meh, Heart, Zap, CloudRain, Sun,
    Calendar, TrendingUp, Flame, Tag, X
} from "lucide-react";

const MOOD_DATA = [
    { emoji: "Super Happy", value: 5, color: "from-yellow-400 to-orange-500", icon: Smile },
    { emoji: "Happy", value: 4, color: "from-green-400 to-emerald-500", icon: Smile },
    { emoji: "Neutral", value: 3, color: "from-gray-400 to-gray-500", icon: Meh },
    { emoji: "Sad", value: 2, color: "from-blue-400 to-blue-600", icon: Frown },
    { emoji: "Very Sad", value: 1, color: "from-purple-600 to-indigo-700", icon: Frown },
];

const EMOTION_TAGS = [
    "Happy", "Calm", "Energized", "Grateful", "Anxious", "Tired", "Stressed", "Excited", "Lonely", "Loved", "Productive", "Bored"
];

export default function MoodTracker() {
    const [entries, setEntries] = useState([]);
    const [todayEntry, setTodayEntry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Load
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-mood");
        if (saved) {
            const parsed = JSON.parse(saved);
            setEntries(parsed);
            const today = new Date().toISOString().split("T")[0];
            setTodayEntry(parsed.find(e => e.date === today) || null);
        }
    }, []);

    // Save
    useEffect(() => {
        localStorage.setItem("lifeos-mood", JSON.stringify(entries));
    }, [entries]);

    const todayStr = new Date().toISOString().split("T")[0];

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
            return [...filtered, todayEntry];
        });

        setIsModalOpen(false);
    };

    const getMoodForDate = (dateStr) => entries.find(e => e.date === dateStr);

    const getHeatmapColor = (mood) => {
        if (!mood) return "bg-gray-100 dark:bg-gray-800";
        if (mood >= 5) return "bg-orange-500";
        if (mood >= 4) return "bg-green-500";
        if (mood === 3) return "bg-gray-500";
        if (mood === 2) return "bg-blue-500";
        return "bg-purple-700";
    };

    // Stats
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
    }).reverse();

    const moodsLast30 = last30Days.map(d => getMoodForDate(d)?.mood || 0);
    const avgMood = moodsLast30.filter(Boolean).length > 0
        ? (moodsLast30.reduce((a, b) => a + b, 0) / moodsLast30.filter(Boolean).length).toFixed(1)
        : 0;

    const goodStreak = last30Days.reduce((streak, date) => {
        const mood = getMoodForDate(date)?.mood || 0;
        return mood >= 4 ? streak + 1 : 0;
    }, 0);

    const topEmotion = entries.flatMap(e => e.tags)
        .reduce((acc, tag) => ({ ...acc, [tag]: (acc[tag] || 0) + 1 }), {});
    const mostFrequent = Object.entries(topEmotion).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900">
            <div className="max-w-7xl mx-auto p-8 lg:p-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-6">
                        <Heart className="w-16 h-16 text-red-500" />
                        Mood Tracker
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">
                        Hiểu cảm xúc – Yêu thương bản thân
                    </p>
                </motion.div>

                {/* Today Mood */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => openModal()}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 cursor-pointer"
                    >
                        <h2 className="text-2xl font-bold mb-6">Hôm nay bạn thế nào?</h2>
                        {todayEntry ? (
                            <div className="text-center">
                                <div className={`text-9xl mb-6`}>{MOOD_DATA.find(m => m.value === todayEntry.mood)?.emoji}</div>
                                <p className="text-3xl font-bold">{MOOD_DATA.find(m => m.value === todayEntry.mood)?.emoji}</p>
                                {todayEntry.note && <p className="mt-4 text-lg italic text-gray-600 dark:text-gray-400">"{todayEntry.note}"</p>}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-9xl mb-6">Question Mark</div>
                                <p className="text-2xl text-gray-500">Chưa ghi lại cảm xúc hôm nay</p>
                                <p className="mt-4 text-lg">Bấm để chọn mood</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6 lg:col-span-2">
                        <motion.div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl">
                            <TrendingUp className="w-12 h-12 mb-4" />
                            <p className="text-5xl font-bold">{avgMood}/5</p>
                            <p className="text-xl opacity-90">Mood trung bình 30 ngày</p>
                        </motion.div>

                        <motion.div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-xl">
                            <Flame className="w-12 h-12 mb-4" />
                            <p className="text-5xl font-bold">{goodStreak}</p>
                            <p className="text-xl opacity-90">Ngày vui liên tiếp</p>
                        </motion.div>

                        <motion.div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
                            <Tag className="w-12 h-12 mb-4" />
                            <p className="text-4xl font-bold truncate">{mostFrequent}</p>
                            <p className="text-xl opacity-90">Cảm xúc nổi bật</p>
                        </motion.div>

                        <motion.div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
                            <Calendar className="w-12 h-12 mb-4" />
                            <p className="text-5xl font-bold">{entries.length}</p>
                            <p className="text-xl opacity-90">Ngày đã theo dõi</p>
                        </motion.div>
                    </div>
                </div>

                {/* Calendar Heatmap */}
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                    <h2 className="text-4xl font-bold text-center mb-8">Mood Calendar</h2>
                    <div className="grid grid-cols-7 gap-3">
                        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
                            <div key={d} className="text-center font-bold text-gray-500 py-2">{d}</div>
                        ))}
                        {Array.from({ length: 365 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (364 - i));
                            const dateStr = date.toISOString().split("T")[0];
                            const mood = getMoodForDate(dateStr);
                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    onClick={() => openModal(dateStr)}
                                    className={`aspect-square rounded-xl ${getHeatmapColor(mood?.mood)} flex items-center justify-center text-2xl cursor-pointer transition-all shadow-lg`}
                                    title={dateStr + (mood ? ` → ${MOOD_DATA.find(m => m.value === mood.mood)?.emoji}` : "")}
                                >
                                    {mood && MOOD_DATA.find(m => m.value === mood.mood)?.emoji}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
                            <h2 className="text-4xl font-bold text-center mb-8">
                                {selectedDate === todayStr ? "Hôm nay" : new Date(selectedDate).toLocaleDateString("vi-VN", { weekday: "long, ngày d tháng m" })}
                            </h2>

                            <div className="grid grid-cols-5 gap-6 mb-10">
                                {MOOD_DATA.map(m => (
                                    <motion.button
                                        key={m.value}
                                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => setTodayEntry({ ...todayEntry, date: selectedDate, mood: m.value })}
                                        className={`p-8 rounded-3xl bg-gradient-to-br ${m.color} text-white shadow-xl text-6xl ${todayEntry?.mood === m.value ? "ring-8 ring-white ring-offset-4 ring-offset-transparent" : ""}`}
                                    >
                                        {m.emoji}
                                    </motion.button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Hôm nay có gì đặc biệt? (tùy chọn)"
                                value={todayEntry?.note || ""}
                                onChange={e => setTodayEntry({ ...todayEntry, note: e.target.value })}
                                className="w-full p-6 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-purple-500 focus:outline-none resize-none"
                                rows={4}
                            />

                            <div className="mt-6">
                                <p className="text-lg font-medium mb-4">Cảm xúc hôm nay</p>
                                <div className="flex flex-wrap gap-3">
                                    {EMOTION_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setTodayEntry(prev => ({
                                                ...prev,
                                                tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
                                            }))}
                                            className={`px-5 py-3 rounded-full transition ${todayEntry?.tags.includes(tag) ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center gap-6 mt-10">
                                <button onClick={() => setIsModalOpen(false)} className="px-10 py-5 rounded-2xl bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 font-medium text-lg">
                                    Hủy
                                </button>
                                <button onClick={saveMood} className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl">
                                    Lưu Mood
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}