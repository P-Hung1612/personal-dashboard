// src/pages/Dashboard/DailyReview.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import {
    Star,
    Target,
    Heart,
    Zap,
    Coffee,
    Sun,
    Moon,
    Cloud,
    TrendingUp,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Smile,
    Frown,
    Meh,
} from "lucide-react";

export default function DailyReview() {
    const [date] = useState(new Date());
    const [rating, setRating] = useState(0);
    const [mood, setMood] = useState("");
    const [wins, setWins] = useState("");
    const [grateful, setGrateful] = useState("");
    const [improve, setImprove] = useState("");
    const [energy, setEnergy] = useState(70);

    const moodOptions = [
        { icon: Smile, label: "Tuyệt vời", color: "text-green-500" },
        { icon: Meh, label: "Bình thường", color: "text-yellow-500" },
        { icon: Frown, label: "Không tốt", color: "text-red-500" },
    ];

    const formatDate = (date) => {
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
            <div className="max-w-4xl mx-auto p-6 lg:p-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                        Daily Review
                    </h1>
                    <p className="text-2xl text-gray-600 dark:text-gray-300">
                        {formatDate(date)}
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                        <button className="p-3 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur hover:bg-white dark:hover:bg-gray-700 transition shadow-md">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg">
                            <Calendar className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur hover:bg-white dark:hover:bg-gray-700 transition shadow-md">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Rating + Mood */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-500" />
                        Hôm nay bạn thấy thế nào?
                    </h2>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-4 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="transition transform hover:scale-125"
                            >
                                <Star
                                    className={`w-14 h-14 ${star <= rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Mood Picker */}
                    <div className="flex justify-center gap-8">
                        {moodOptions.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => setMood(option.label)}
                                className={`p-6 rounded-2xl transition-all transform hover:scale-110 ${mood === option.label
                                    ? "bg-indigo-100 dark:bg-indigo-900/50 ring-4 ring-indigo-500"
                                    : "bg-gray-100 dark:bg-gray-700"
                                    }`}
                            >
                                <option.icon className={`w-16 h-16 ${option.color}`} />
                                <p className="mt-3 text-sm font-medium">{option.label}</p>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Wins & Grateful */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <ReviewCard
                        icon={<Target className="w-10 h-10 text-green-500" />}
                        title="3 điều hôm nay bạn làm tốt"
                        placeholder="Ví dụ: Hoàn thành sớm deadline, tập gym đều đặn..."
                        value={wins}
                        onChange={setWins}
                        color="from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30"
                    />
                    <ReviewCard
                        icon={<Heart className="w-10 h-10 text-pink-500" />}
                        title="3 điều bạn biết ơn hôm nay"
                        placeholder="Ví dụ: Có sức khỏe, được ăn ngon, có người yêu thương..."
                        value={grateful}
                        onChange={setGrateful}
                        color="from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30"
                    />
                </div>

                {/* Improve + Energy */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <ReviewCard
                        icon={<Zap className="w-10 h-10 text-yellow-500" />}
                        title="Ngày mai bạn muốn cải thiện điều gì?"
                        placeholder="Ví dụ: Ngủ sớm hơn, tập trung sâu hơn, ít dùng điện thoại..."
                        value={improve}
                        onChange={setImprove}
                        color="from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                            Mức năng lượng hôm nay
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Mệt mỏi</span>
                                <span className="text-gray-600 dark:text-gray-400">Tràn đầy</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={energy}
                                onChange={(e) => setEnergy(e.target.value)}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                style={{
                                    background: `linear-gradient(to right, #f87171 0%, #facc15 ${energy}%, #86efac ${energy}%, #86efac 100%)`,
                                }}
                            />
                            <div className="text-center">
                                <span className="text-5xl font-bold text-purple-600">{energy}</span>
                                <span className="text-xl text-gray-600 dark:text-gray-400"> / 100</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <button className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition shadow-xl">
                        Lưu Daily Review
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

// Component con để code sạch
function ReviewCard({ icon, title, placeholder, value, onChange, color }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-gradient-to-br ${color} rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700`}
        >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                {icon}
                {title}
            </h3>
            <textarea
                rows={5}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none resize-none text-gray-800 dark:text-gray-200"
            />
        </motion.div>
    );
}