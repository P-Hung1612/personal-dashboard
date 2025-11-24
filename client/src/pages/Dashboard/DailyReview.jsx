// src/pages/Dashboard/DailyReview.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import {
    Star, Target, Heart, Zap, TrendingUp,
    Smile, Frown, Meh
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
        { icon: Smile, label: "Tuyệt vời", color: "green" },
        { icon: Meh, label: "Bình thường", color: "yellow" },
        { icon: Frown, label: "Không tốt", color: "red" },
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
        <>
            {/* HEADER CODE TAY – ĐẸP NHƯ ANALYTICS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white p-8 lg:p-12"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-5 mb-4">
                        <Target className="w-14 h-14 lg:w-16 lg:h-16 drop-shadow-lg" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                                Daily Review
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-90 mt-2">
                                {formatDate(date)}
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-3xl ml-20">
                        Dành vài phút nhìn lại hôm nay – bạn đã làm được gì, biết ơn điều gì, và sẽ tốt hơn ra sao?
                    </p>
                </div>
            </motion.div>

            {/* Nội dung chính */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

                {/* Rating + Mood Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-500" />
                        Hôm nay bạn thấy thế nào?
                    </h2>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-6 mb-10">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-125"
                            >
                                <Star
                                    className={`w-14 h-14 transition-all ${star <= rating
                                            ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                                            : "text-gray-300 dark:text-gray-600"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Mood Picker */}
                    <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                        {moodOptions.map((option) => (
                            <motion.button
                                key={option.label}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMood(option.label)}
                                className={`flex flex-col items-center justify-center p-8 rounded-2xl transition-all ${mood === option.label
                                        ? `bg-gradient-to-br from-${option.color}-50 to-${option.color}-100 ring-4 ring-${option.color}-500/30 shadow-lg`
                                        : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <option.icon className={`w-16 h-16 text-${option.color}-600 mb-3`} />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {option.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Wins & Grateful */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <ReviewCard
                        icon={<Target className="w-10 h-10 text-green-600" />}
                        title="3 điều hôm nay bạn làm tốt"
                        placeholder="Ví dụ: Hoàn thành sớm deadline, tập gym đều đặn..."
                        value={wins}
                        onChange={setWins}
                        gradient="from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                    />
                    <ReviewCard
                        icon={<Heart className="w-10 h-10 text-pink-600" />}
                        title="3 điều bạn biết ơn hôm nay"
                        placeholder="Ví dụ: Có sức khỏe, được ăn ngon, có người yêu thương..."
                        value={grateful}
                        onChange={setGrateful}
                        gradient="from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
                    />
                </div>

                {/* Improve + Energy */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <ReviewCard
                        icon={<Zap className="w-10 h-10 text-yellow-600" />}
                        title="Ngày mai bạn muốn cải thiện điều gì?"
                        placeholder="Ví dụ: Ngủ sớm hơn, tập trung sâu hơn, ít dùng điện thoại..."
                        value={improve}
                        onChange={setImprove}
                        gradient="from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                            Mức năng lượng hôm nay
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>Mệt mỏi</span>
                                <span>Tràn đầy</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={energy}
                                onChange={(e) => setEnergy(e.target.value)}
                                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-600"
                                style={{
                                    background: `linear-gradient(to right, #fca5a5 0%, #fde047 ${energy}%, #86efac ${energy}%, #86efac 100%)`,
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
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <button className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl">
                        Lưu Daily Review
                    </button>
                </motion.div>
            </div>
        </>
    );
}

// ReviewCard giữ nguyên
function ReviewCard({ icon, title, placeholder, value, onChange, gradient }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 bg-gradient-to-br ${gradient}`}
        >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                {icon}
                {title}
            </h3>
            <textarea
                rows={5}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
        </motion.div>
    );
}