// src/pages/Productivity/Goals.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI TOÀN BỘ APP (Overview, Tasks, Habits, DailyReview, Analytics)
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { format, isPast } from "date-fns";
import {
    Plus, Target, Calendar, Flag, Edit2, Trash2,
    CheckCircle2, Circle, Sparkles, X
} from "lucide-react";

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const [form, setForm] = useState({
        title: "", category: "Personal", deadline: "", priority: "medium",
        keyResults: ["", "", ""], milestones: [""]
    });

    // localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-goals");
            if (saved) setGoals(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-goals", JSON.stringify(goals));
        } catch (e) { console.error(e); }
    }, [goals]);

    const openModal = (goal = null) => {
        setEditingGoal(goal);
        if (goal) {
            setForm({
                title: goal.title,
                category: goal.category,
                deadline: goal.deadline || "",
                priority: goal.priority,
                keyResults: goal.keyResults.length ? goal.keyResults : ["", "", ""],
                milestones: goal.milestones || [""]
            });
        } else {
            setForm({
                title: "", category: "Personal", deadline: "", priority: "medium",
                keyResults: ["", "", ""], milestones: [""]
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGoal(null);
    };

    const saveGoal = () => {
        if (!form.title.trim()) return;
        const cleanedKR = form.keyResults.filter(k => k.trim());
        const cleanedMilestones = form.milestones.filter(m => m.trim());

        const newGoal = editingGoal
            ? { ...editingGoal, ...form, keyResults: cleanedKR, milestones: cleanedMilestones }
            : {
                id: Date.now(),
                title: form.title.trim(),
                category: form.category,
                deadline: form.deadline || null,
                priority: form.priority,
                keyResults: cleanedKR,
                milestones: cleanedMilestones,
                completedKR: 0,
                createdAt: new Date().toISOString(),
            };

        if (editingGoal) {
            setGoals(goals.map(g => g.id === editingGoal.id ? newGoal : g));
        } else {
            setGoals([...goals, newGoal]);
        }
        closeModal();
    };

    const toggleKR = (goalId, krIndex) => {
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const newCompleted = (g.completedKR || 0) === krIndex + 1 ? krIndex : krIndex + 1;
                if (newCompleted === g.keyResults.length) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 7000);
                }
                return { ...g, completedKR: newCompleted };
            }
            return g;
        }));
    };

    const deleteGoal = (id) => setGoals(goals.filter(g => g.id !== id));

    const progress = (goal) => {
        if (!goal.keyResults.length) return 0;
        return Math.round((goal.completedKR / goal.keyResults.length) * 100);
    };

    return (
        <>
            {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.08} />}

            {/* HEADER – ĐỒNG BỘ HOÀN TOÀN */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Goals
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {goals.length} mục tiêu • {goals.filter(g => progress(g) === 100).length} đã hoàn thành
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Đặt mục tiêu lớn – chia nhỏ thành từng bước – chinh phục từng ngày.
                    </p>
                </div>
            </motion.div>

            {/* NỘI DUNG CHÍNH – ĐỒNG BỘ HOÀN TOÀN */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

                {/* Goals Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {goals.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-2 text-center py-24"
                        >
                            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-4 border-dashed border-purple-400 dark:border-purple-700 rounded-3xl flex items-center justify-center">
                                <Target className="w-20 h-20 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                                Chưa có mục tiêu nào
                            </p>
                            <p className="text-gray-500 mt-4">
                                Bấm nút <Plus className="inline w-6 h-6" /> để bắt đầu chinh phục năm nay!
                            </p>
                        </motion.div>
                    ) : (
                        goals.map((goal) => {
                            const prog = progress(goal);
                            const isOverdue = goal.deadline && isPast(new Date(goal.deadline)) && prog < 100;

                            return (
                                <motion.div
                                    key={goal.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -6 }}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all p-6 ${prog === 100 ? "ring-4 ring-green-500/30" : isOverdue ? "ring-4 ring-red-500/30" : ""}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {goal.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 mt-3">
                                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${goal.category === "Personal" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50" :
                                                    goal.category === "Career" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50" :
                                                        "bg-pink-100 text-pink-700 dark:bg-pink-900/50"
                                                    }`}>
                                                    {goal.category}
                                                </span>
                                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${goal.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/50" :
                                                    goal.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50" :
                                                        "bg-gray-100 text-gray-700 dark:bg-gray-700"
                                                    }`}>
                                                    <Flag className="w-4 h-4 inline mr-1" />
                                                    {goal.priority === "high" ? "Cao" : goal.priority === "medium" ? "Trung bình" : "Thấp"}
                                                </span>
                                                {goal.deadline && (
                                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${isOverdue ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30"}`}>
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {format(new Date(goal.deadline), "dd/MM/yyyy")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 opacity-70 group-hover:opacity-100 transition">
                                            <button onClick={() => openModal(goal)} className="p-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl">
                                                <Edit2 className="w-5 h-5 text-indigo-600" />
                                            </button>
                                            <button onClick={() => deleteGoal(goal.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl">
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Circle */}
                                    <div className="flex justify-center my-8">
                                        <div className="relative">
                                            <svg className="w-36 h-36 transform -rotate-90">
                                                <circle cx="72" cy="72" r="62" stroke="#e5e7eb" strokeWidth="14" fill="none" className="dark:stroke-gray-700" />
                                                <motion.circle
                                                    cx="72" cy="72" r="62"
                                                    stroke={prog === 100 ? "#10b981" : "#8b5cf6"}
                                                    strokeWidth="14"
                                                    fill="none"
                                                    strokeDasharray={2 * Math.PI * 62}
                                                    initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
                                                    animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - prog / 100) }}
                                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-4xl font-bold text-gray-800 dark:text-white">{prog}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Results */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            <Target className="w-6 h-6 text-purple-600" />
                                            Key Results
                                        </h4>
                                        {goal.keyResults.map((kr, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleKR(goal.id, i)}
                                                className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                                            >
                                                {i < (goal.completedKR || 0) ? (
                                                    <CheckCircle2 className="w-7 h-7 text-green-600 flex-shrink-0" />
                                                ) : (
                                                    <Circle className="w-7 h-7 text-gray-400 flex-shrink-0" />
                                                )}
                                                <span className={`text-base ${i < (goal.completedKR || 0) ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}>
                                                    {kr}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Floating Button */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center text-white z-10"
                >
                    <Plus className="w-10 h-10" />
                </motion.button>

                {/* Modal – ĐỒNG BỘ HOÀN TOÀN */}
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
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full max-h-screen overflow-y-auto border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {editingGoal ? "Sửa mục tiêu" : "Tạo mục tiêu mới"}
                                    </h2>
                                    <button onClick={closeModal} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="Mục tiêu lớn của bạn là gì?"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500 focus:outline-none text-xl font-medium"
                                        autoFocus
                                    />

                                    <div className="grid grid-cols-3 gap-4">
                                        <select
                                            value={form.category}
                                            onChange={e => setForm({ ...form, category: e.target.value })}
                                            className="px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500"
                                        >
                                            <option>Personal</option>
                                            <option>Career</option>
                                            <option>Health</option>
                                        </select>
                                        <select
                                            value={form.priority}
                                            onChange={e => setForm({ ...form, priority: e.target.value })}
                                            className="px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500"
                                        >
                                            <option value="high">Cao</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="low">Thấp</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={form.deadline}
                                            onChange={e => setForm({ ...form, deadline: e.target.value })}
                                            className="px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Key Results</h4>
                                        {form.keyResults.map((kr, i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                placeholder={`Key Result ${i + 1}...`}
                                                value={kr}
                                                onChange={e => {
                                                    const newKR = [...form.keyResults];
                                                    newKR[i] = e.target.value;
                                                    setForm({ ...form, keyResults: newKR });
                                                }}
                                                className="w-full px-5 py-4 mb-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500 focus:outline-none"
                                            />
                                        ))}
                                    </div>

                                    <div className="flex gap-4 justify-end pt-6">
                                        <button onClick={closeModal} className="px-8 py-4 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold transition">
                                            Hủy
                                        </button>
                                        <button onClick={saveGoal} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl transition">
                                            {editingGoal ? "Cập nhật" : "Tạo mục tiêu"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}