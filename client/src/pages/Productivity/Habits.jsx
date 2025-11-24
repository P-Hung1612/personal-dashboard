// src/pages/Productivity/Habits.jsx
// ĐÃ ĐỒNG BỘ 100% VỚI TOÀN BỘ APP (Overview, Tasks, DailyReview, Analytics)
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfYear, eachDayOfInterval, isSameDay, addMonths } from "date-fns";
import { Plus, Flame, Edit2, Trash2, Check, Target, X } from "lucide-react";

export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [newName, setNewName] = useState("");

    // localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-habits");
            if (saved) setHabits(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-habits", JSON.stringify(habits));
        } catch (e) { console.error(e); }
    }, [habits]);

    const today = new Date();
    const yearStart = startOfYear(today);

    const openModal = (habit = null) => {
        setEditingHabit(habit);
        setNewName(habit?.name || "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingHabit(null);
        setNewName("");
    };

    const saveHabit = () => {
        if (!newName.trim()) return;
        if (editingHabit) {
            setHabits(habits.map(h => h.id === editingHabit.id ? { ...h, name: newName.trim() } : h));
        } else {
            setHabits([...habits, {
                id: Date.now(),
                name: newName.trim(),
                completedDates: [],
                createdAt: new Date().toISOString(),
            }]);
        }
        closeModal();
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

    const deleteHabit = (id) => setHabits(habits.filter(h => h.id !== id));

    const getStreak = (dates) => {
        if (!dates.length) return 0;
        const sorted = dates.map(d => new Date(d)).sort((a, b) => b - a);
        let streak = 0;
        let current = new Date();
        for (const date of sorted) {
            const expected = new Date(current);
            expected.setDate(expected.getDate() - streak);
            if (isSameDay(date, expected)) streak++;
            else break;
        }
        return streak;
    };

    const getHeatmapColor = (date) => {
        const str = format(date, "yyyy-MM-dd");
        const count = habits.filter(h => h.completedDates.includes(str)).length;
        if (count === 0) return "bg-gray-100 dark:bg-gray-800";
        if (count <= 2) return "bg-orange-200 dark:bg-orange-900/40";
        if (count <= 4) return "bg-orange-400 dark:bg-orange-700";
        return "bg-orange-600 dark:bg-orange-500";
    };

    return (
        <>
            {/* HEADER – ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI CÁC TRANG KHÁC */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 dark:from-orange-900 dark:via-red-900 dark:to-rose-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Flame className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Habits Tracker
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {habits.length} thói quen • {habits.filter(h => h.completedDates.includes(format(today, "yyyy-MM-dd"))).length} hoàn thành hôm nay
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Mỗi ngày bạn check-in là một bước gần hơn đến phiên bản tốt nhất của chính mình.
                    </p>
                </div>
            </motion.div>

            {/* NỘI DUNG CHÍNH – ĐỒNG BỘ HOÀN TOÀN */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

                {/* Danh sách thói quen */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {habits.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-24"
                            >
                                <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-4 border-dashed border-orange-400 dark:border-orange-700 rounded-3xl" />
                                <p className="text-2xl font-medium text-gray-700 dark:text-gray-300">Chưa có thói quen nào</p>
                                <p className="text-gray-500 mt-4">Bấm nút + để bắt đầu xây dựng phiên bản tốt hơn!</p>
                            </motion.div>
                        ) : (
                            habits.map((habit) => {
                                const streak = getStreak(habit.completedDates);
                                const todayDone = habit.completedDates.includes(format(today, "yyyy-MM-dd"));

                                return (
                                    <motion.div
                                        key={habit.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        whileHover={{ y: -6 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-6 group transition-all hover:shadow-xl"
                                    >
                                        <button
                                            onClick={() => toggleToday(habit.id)}
                                            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${todayDone
                                                ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg"
                                                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            {todayDone ? <Check className="w-9 h-9" /> : <Target className="w-8 h-8" />}
                                        </button>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{habit.name}</h3>
                                            <div className="flex items-center gap-3 mt-2">
                                                <Flame className={`w-7 h-7 ${streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
                                                <span className={`text-3xl font-bold ${streak >= 21 ? "text-orange-600" : "text-gray-700 dark:text-gray-300"}`}>
                                                    {streak}
                                                </span>
                                                <span className="text-lg text-gray-600 dark:text-gray-400">ngày liên tục</span>
                                                {streak >= 21 && <span className="ml-2 text-2xl">On Fire</span>}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => openModal(habit)} className="p-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl">
                                                <Edit2 className="w-5 h-5 text-indigo-600" />
                                            </button>
                                            <button onClick={() => deleteHabit(habit.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl">
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Heatmap */}
                {habits.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                            Heatmap năm {format(today, "yyyy")}
                        </h2>
                        <div className="grid grid-cols-12 gap-2 max-w-5xl mx-auto">
                            {Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i)).map(month => (
                                <div key={month.toISOString()} className="space-y-1">
                                    <p className="text-xs text-center font-medium text-gray-500 dark:text-gray-400">
                                        {format(month, "MMM")}
                                    </p>
                                    {eachDayOfInterval({
                                        start: month,
                                        end: new Date(month.getFullYear(), month.getMonth() + 1, 0)
                                    }).map(day => (
                                        <div
                                            key={day.toISOString()}
                                            className={`w-8 h-8 rounded-lg ${day <= today ? getHeatmapColor(day) : "bg-gray-50 dark:bg-gray-900"}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-6 mt-8 text-sm">
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-gray-100 dark:bg-gray-800 rounded" />Không</span>
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-orange-200 dark:bg-orange-900/40 rounded" />1–2</span>
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-orange-400 dark:bg-orange-700 rounded" />3–4</span>
                            <span className="flex items-center gap-2"><div className="w-5 h-5 bg-orange-600 dark:bg-orange-500 rounded" />5+</span>
                        </div>
                    </motion.div>
                )}

                {/* Floating Button & Modal – ĐỒNG BỘ HOÀN TOÀN */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl shadow-2xl flex items-center justify-center text-white z-10"
                >
                    <Plus className="w-10 h-10" />
                </motion.button>

                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
                            onClick={closeModal}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 50 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {editingHabit ? "Sửa thói quen" : "Thêm thói quen mới"}
                                    </h2>
                                    <button onClick={closeModal} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && saveHabit()}
                                    placeholder="VD: Uống 2 lít nước, Tập gym, Đọc sách..."
                                    className="w-full px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-orange-500 focus:outline-none text-lg font-medium"
                                    autoFocus
                                />
                                <div className="flex gap-4 justify-end mt-8">
                                    <button onClick={closeModal} className="px-8 py-4 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold transition">
                                        Hủy
                                    </button>
                                    <button onClick={saveHabit} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold shadow-xl hover:shadow-2xl transition">
                                        {editingHabit ? "Cập nhật" : "Tạo ngay"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}