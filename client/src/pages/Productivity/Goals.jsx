// src/pages/Productivity/Goals.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { format, isPast } from "date-fns";
import {
    Plus, Target, Calendar, Flag, Edit2, Trash2, CheckCircle2,
    Circle, ChevronDown, ChevronUp, Sparkles
} from "lucide-react";

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [form, setForm] = useState({
        title: "", category: "Personal", deadline: "", priority: "medium",
        keyResults: ["", "", ""],
        milestones: [""]
    });

    // Load & Save localStorage
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-goals");
        if (saved) setGoals(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("lifeos-goals", JSON.stringify(goals));
    }, [goals]);

    const openModal = (goal = null) => {
        setEditingGoal(goal);
        if (goal) {
            setForm({
                title: goal.title,
                category: goal.category,
                deadline: goal.deadline,
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

    const saveGoal = () => {
        if (!form.title.trim()) return;

        const cleanedKR = form.keyResults.filter(k => k.trim());
        const cleanedMilestones = form.milestones.filter(m => m.trim());

        const newGoal = editingGoal
            ? { ...editingGoal, ...form, keyResults: cleanedKR, milestones: cleanedMilestones }
            : {
                id: Date.now(),
                title: form.title,
                category: form.category,
                deadline: form.deadline,
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
        setIsModalOpen(false);
    };

    const toggleKR = (goalId, krIndex) => {
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                const completed = g.completedKR || 0;
                const newCompleted = completed === krIndex + 1 ? krIndex : krIndex + 1;
                if (newCompleted === g.keyResults.length) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 6000);
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
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:to-purple-900">
                <div className="max-w-6xl mx-auto p-6 lg:p-12">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-4">
                            <Sparkles className="w-14 h-14 text-yellow-500" />
                            Goals 2025
                        </h1>
                        <p className="text-2xl text-gray-600 dark:text-gray-400">
                            Đặt mục tiêu lớn – Theo dõi từng bước nhỏ
                        </p>
                    </motion.div>

                    {/* Add Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => openModal()}
                        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center z-10"
                    >
                        <Plus className="w-8 h-8" />
                    </motion.button>

                    {/* Goals Grid */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {goals.length === 0 ? (
                            <div className="col-span-2 text-center py-20">
                                <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-48 h-48 mx-auto mb-8" />
                                <p className="text-3xl text-gray-600 dark:text-gray-400">Chưa có mục tiêu nào</p>
                                <p className="text-xl mt-4">Bấm nút + để bắt đầu chinh phục năm 2025!</p>
                            </div>
                        ) : (
                            goals.map((goal) => {
                                const prog = progress(goal);
                                const isOverdue = goal.deadline && isPast(new Date(goal.deadline));

                                return (
                                    <motion.div
                                        key={goal.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border-4 ${prog === 100 ? "border-green-500" : isOverdue ? "border-red-400" : "border-transparent"
                                            }`}
                                    >
                                        <div className={`p-8 ${prog === 100 ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30" : ""}`}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{goal.title}</h3>
                                                    <div className="flex gap-3 mt-3">
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
                                                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${isOverdue ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                                {format(new Date(goal.deadline), "dd/MM/yyyy")}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openModal(goal)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => deleteGoal(goal.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl">
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Progress Circle */}
                                            <div className="flex justify-center my-8">
                                                <div className="relative">
                                                    <svg className="w-40 h-40 transform -rotate-90">
                                                        <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                                                        <motion.circle
                                                            cx="80" cy="80" r="70"
                                                            stroke={prog === 100 ? "#10b981" : "#8b5cf6"}
                                                            strokeWidth="12"
                                                            fill="none"
                                                            strokeDasharray={`${2 * Math.PI * 70}`}
                                                            initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                                                            animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - prog / 100) }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-5xl font-bold text-gray-800 dark:text-white">{prog}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Key Results */}
                                            <div className="space-y-4">
                                                <h4 className="text-xl font-bold flex items-center gap-2">
                                                    <Target className="w-6 h-6 text-purple-600" />
                                                    Key Results
                                                </h4>
                                                {goal.keyResults.map((kr, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => toggleKR(goal.id, i)}
                                                        className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                                    >
                                                        {i < goal.completedKR ? (
                                                            <CheckCircle2 className="w-7 h-7 text-green-500" />
                                                        ) : (
                                                            <Circle className="w-7 h-7 text-gray-400" />
                                                        )}
                                                        <span className={`text-lg ${i < goal.completedKR ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}>
                                                            {kr}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Modal – giữ nguyên đẹp như trước */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
                            onClick={() => setIsModalOpen(false)}>
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                                <h2 className="text-4xl font-bold mb-8 text-center">
                                    {editingGoal ? "Sửa mục tiêu" : "Tạo mục tiêu mới"}
                                </h2>
                                <div className="space-y-6">
                                    <input type="text" placeholder="Mục tiêu lớn của bạn là gì?" value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-purple-500 focus:outline-none" />

                                    <div className="grid grid-cols-3 gap-4">
                                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                            className="px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-700 border focus:ring-4 focus:ring-purple-500">
                                            <option>Personal</option>
                                            <option>Career</option>
                                            <option>Health</option>
                                        </select>
                                        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                                            className="px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-700 border focus:ring-4 focus:ring-purple-500">
                                            <option value="high">Cao</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="low">Thấp</option>
                                        </select>
                                        <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                                            className="px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-700 border focus:ring-4 focus:ring-purple-500" />
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold mb-4">Key Results (nhấp để hoàn thành)</h4>
                                        {form.keyResults.map((kr, i) => (
                                            <input key={i} type="text" placeholder={`Key Result ${i + 1}...`} value={kr}
                                                onChange={e => {
                                                    const newKR = [...form.keyResults];
                                                    newKR[i] = e.target.value;
                                                    setForm({ ...form, keyResults: newKR });
                                                }}
                                                className="w-full px-5 py-4 mb-3 rounded-xl bg-gray-50 dark:bg-gray-700 border focus:ring-4 focus:ring-purple-500" />
                                        ))}
                                    </div>

                                    <div className="flex gap-4 justify-center pt-6">
                                        <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 font-medium">
                                            Hủy
                                        </button>
                                        <button onClick={saveGoal} className="px-12 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition">
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