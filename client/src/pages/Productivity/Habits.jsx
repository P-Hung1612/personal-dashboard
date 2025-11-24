// src/pages/Productivity/Habits.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfYear, eachDayOfInterval, isSameDay, addMonths } from "date-fns";
import { Plus, Flame, Target, Edit2, Trash2, Check, X } from "lucide-react";

export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [newName, setNewName] = useState("");

    // Load từ localStorage
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-habits");
        if (saved) setHabits(JSON.parse(saved));
    }, []);

    // Save vào localStorage
    useEffect(() => {
        localStorage.setItem("lifeos-habits", JSON.stringify(habits));
    }, [habits]);

    const today = new Date();
    const yearStart = startOfYear(today);
    const daysInYear = eachDayOfInterval({ start: yearStart, end: today });

    const openModal = (habit = null) => {
        setEditingHabit(habit);
        setNewName(habit?.name || "");
        setIsModalOpen(true);
    };

    const saveHabit = () => {
        if (!newName.trim()) return;
        if (editingHabit) {
            setHabits(habits.map(h => h.id === editingHabit.id ? { ...h, name: newName } : h));
        } else {
            setHabits([...habits, {
                id: Date.now(),
                name: newName,
                completedDates: [],
                createdAt: new Date().toISOString(),
            }]);
        }
        setIsModalOpen(false);
        setNewName("");
    };

    const toggleToday = (habitId) => {
        const todayStr = format(today, "yyyy-MM-dd");
        setHabits(habits.map(h => {
            if (h.id === habitId) {
                const hasToday = h.completedDates.includes(todayStr);
                return {
                    ...h,
                    completedDates: hasToday
                        ? h.completedDates.filter(d => d !== todayStr)
                        : [...h.completedDates, todayStr],
                };
            }
            return h;
        }));
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const getStreak = (dates) => {
        if (dates.length === 0) return 0;
        const sorted = dates.map(d => new Date(d)).sort((a, b) => b - a);
        let streak = 0;
        let current = new Date();
        for (const date of sorted) {
            const expected = new Date(current);
            expected.setDate(expected.getDate() - streak);
            if (isSameDay(date, expected)) {
                streak++;
            } else if (date > expected) {
                break;
            } else {
                break;
            }
        }
        return streak;
    };

    const getHeatmapColor = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        let maxCount = 0;
        habits.forEach(h => {
            if (h.completedDates.includes(dateStr)) maxCount++;
        });
        if (maxCount === 0) return "bg-gray-100 dark:bg-gray-800";
        if (maxCount <= 2) return "bg-green-200 dark:bg-green-900";
        if (maxCount <= 4) return "bg-green-400 dark:bg-green-700";
        return "bg-green-600 dark:bg-green-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900">
            <div className="max-w-7xl mx-auto p-6 lg:p-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">Habits Tracker</h1>
                    <p className="text-2xl text-gray-600 dark:text-gray-400">Xây dựng thói quen – Thay đổi cuộc đời</p>
                </motion.div>

                {/* Add Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center z-10"
                >
                    <Plus className="w-8 h-8" />
                </motion.button>

                {/* Habits List */}
                <div className="space-y-8 mb-16">
                    {habits.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-40 h-40 mx-auto mb-8" />
                            <p className="text-2xl text-gray-600 dark:text-gray-400">Chưa có thói quen nào</p>
                            <p className="text-lg mt-4">Bấm nút + để bắt đầu hành trình của bạn!</p>
                        </div>
                    ) : (
                        habits.map((habit) => {
                            const streak = getStreak(habit.completedDates);
                            const isTodayDone = habit.completedDates.includes(format(today, "yyyy-MM-dd"));

                            return (
                                <motion.div
                                    key={habit.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleToday(habit.id)}
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110 ${isTodayDone
                                                        ? "bg-emerald-500 text-white shadow-lg"
                                                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    }`}
                                            >
                                                {isTodayDone ? <Check className="w-10 h-10" /> : <Target className="w-9 h-9" />}
                                            </button>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{habit.name}</h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Flame className={`w-7 h-7 ${streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
                                                    <span className={`text-3xl font-bold ${streak > 10 ? "text-orange-500" : "text-gray-700 dark:text-gray-300"}`}>
                                                        {streak}
                                                    </span>
                                                    <span className="text-lg text-gray-600 dark:text-gray-400">ngày liên tục</span>
                                                    {streak > 20 && (
                                                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                                            <span className="text-3xl ml-2">On Fire</span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => openModal(habit)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                                                <Edit2 className="w-5 h-5 text-gray-600" />
                                            </button>
                                            <button onClick={() => deleteHabit(habit.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition">
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Heatmap */}
                {habits.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Heatmap 2025</h2>
                        <div className="grid grid-cols-12 gap-2 max-w-5xl mx-auto">
                            {Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i)).map((month) => (
                                <div key={month.toISOString()} className="space-y-1">
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium">
                                        {format(month, "MMM")}
                                    </p>
                                    {eachDayOfInterval({
                                        start: month,
                                        end: new Date(month.getFullYear(), month.getMonth() + 1, 0)
                                    }).map((day) => (
                                        <div
                                            key={day.toISOString()}
                                            className={`w-8 h-8 rounded-lg transition-all ${day <= today ? getHeatmapColor(day) : "bg-gray-50 dark:bg-gray-900"}`}
                                            title={day <= today ? format(day, "dd/MM/yyyy") : ""}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-8 text-sm">
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded" />Không</span>
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-green-200 dark:bg-green-900 rounded" />1-2</span>
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-green-400 dark:bg-green-700 rounded" />3-4</span>
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-green-600 dark:bg-green-500 rounded" />5+</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-center">
                                {editingHabit ? "Sửa thói quen" : "Thêm thói quen mới"}
                            </h2>
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && saveHabit()}
                                placeholder="VD: Uống 2 lít nước, Đọc sách 30 phút..."
                                className="w-full px-6 py-5 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:outline-none transition"
                                autoFocus
                            />
                            <div className="flex gap-4 mt-8 justify-center">
                                <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition">
                                    Hủy
                                </button>
                                <button onClick={saveHabit} className="px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg transition">
                                    {editingHabit ? "Cập nhật" : "Tạo ngay"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}