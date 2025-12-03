// src/pages/Dashboard/DailyReview.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Star, Target, Heart, Zap, TrendingUp,
    Smile, Frown, Meh
} from "lucide-react";
import { useData } from "../../context/DataContext.jsx"; // ← QUAN TRỌNG NHẤT

export default function DailyReview() {
    const { userData, setUserData } = useData();
    const today = new Date().toISOString().split('T')[0]; // "2025-04-05"

    // Tìm review hôm nay (nếu có)
    const todayReview = userData?.dailyReviews?.find(r => r.date === today) || {
        date: today,
        rating: 0,
        mood: "",
        wins: "",
        grateful: "",
        improve: "",
        energy: 70
    };

    // Local state để edit mượt
    const [rating, setRating] = useState(todayReview.rating);
    const [mood, setMood] = useState(todayReview.mood);
    const [wins, setWins] = useState(todayReview.wins);
    const [grateful, setGrateful] = useState(todayReview.grateful);
    const [improve, setImprove] = useState(todayReview.improve);
    const [energy, setEnergy] = useState(todayReview.energy);

    // Auto-save khi có thay đổi (debounce tự động nhờ DataContext)
    useEffect(() => {
        if (!userData) return;

        const newReview = { date: today, rating, mood, wins, grateful, improve, energy };

        const updatedReviews = userData.dailyReviews
            ? userData.dailyReviews.filter(r => r.date !== today)
            : [];

        updatedReviews.push(newReview);

        setUserData({
            ...userData,
            dailyReviews: updatedReviews
        });
    }, [rating, mood, wins, grateful, improve, energy]);

    const moodOptions = [
        { icon: Smile, label: "Tuyệt vời", color: "green" },
        { icon: Meh, label: "Bình thường", color: "yellow" },
        { icon: Frown, label: "Không tốt", color: "red" },
    ];

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <>
            {/* HEADER ĐẸP */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white p-8 lg:p-12"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-5 mb-4">
                        <Target className="w-14 h-14 lg:w-16 lg:h-16 drop-shadow-lg" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Daily Review</h1>
                            <p className="text-xl lg:text-2xl opacity-90 mt-2">{formatDate(today)}</p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-3xl ml-20">
                        Dành vài phút nhìn lại hôm nay – bạn đã làm được gì, biết ơn điều gì, và sẽ tốt hơn ra sao?
                    </p>
                </div>
            </motion.div>

            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
                {/* Rating + Mood */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-500" /> Hôm nay bạn thấy thế nào?
                    </h2>

                    <div className="flex justify-center gap-6 mb-10">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-125">
                                <Star className={`w-14 h-14 transition-all ${star <= rating ? "fill-yellow-400 text-yellow-400 drop-shadow-md" : "text-gray-300 dark:text-gray-600"}`} />
                            </button>
                        ))}
                    </div>

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
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Wins & Grateful */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <ReviewCard icon={<Target className="w-10 h-10 text-green-600" />} title="3 điều hôm nay bạn làm tốt" placeholder="Ví dụ: Hoàn thành sớm deadline..." value={wins} onChange={setWins} gradient="from-green-50 to-emerald-50 dark:from-green-900/20" />
                    <ReviewCard icon={<Heart className="w-10 h-10 text-pink-600" />} title="3 điều bạn biết ơn hôm nay" placeholder="Ví dụ: Có sức khỏe, được ăn ngon..." value={grateful} onChange={setGrateful} gradient="from-pink-50 to-rose-50 dark:from-pink-900/20" />
                </div>

                {/* Improve + Energy */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <ReviewCard icon={<Zap className="w-10 h-10 text-yellow-600" />} title="Ngày mai bạn muốn cải thiện điều gì?" placeholder="Ví dụ: Ngủ sớm hơn..." value={improve} onChange={setImprove} gradient="from-yellow-50 to-amber-50 dark:from-yellow-900/20" />
                    <EnergyCard energy={energy} setEnergy={setEnergy} />
                </div>

                {/* Thông báo đã lưu tự động */}
                <div className="text-center text-green-600 dark:text-green-400 font-medium">
                    Đã lưu tự động
                </div>
            </div>
        </>
    );
}

function ReviewCard({ icon, title, placeholder, value, onChange, gradient }) {
    return (
        <motion.div whileHover={{ y: -4 }} className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 bg-gradient-to-br ${gradient}`}>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">{icon}{title}</h3>
            <textarea rows={5} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
        </motion.div>
    );
}

function EnergyCard({ energy, setEnergy }) {
    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
        >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" /> Mức năng lượng hôm nay
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
                    onChange={(e) => setEnergy(Number(e.target.value))}
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
    );
}