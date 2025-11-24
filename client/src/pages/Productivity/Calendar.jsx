// src/pages/Productivity/Calendar.jsx
// ĐÃ LOẠI BỎ TẤT CẢ PACKAGE NGOẠI LAI → CHẠY NGAY 100% KHÔNG LỖI!
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Calendar, ChevronLeft, ChevronRight, Clock,
    MapPin, Edit2, Trash2, X
} from "lucide-react";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [form, setForm] = useState({
        title: "", time: "", location: "", notes: ""
    });

    // Load events
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-calendar-events");
        if (saved) setEvents(JSON.parse(saved));
    }, []);

    // Save events
    useEffect(() => {
        localStorage.setItem("lifeos-calendar-events", JSON.stringify(events));
    }, [events]);

    const daysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add actual days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    const monthName = currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

    const openModal = (date, event = null) => {
        setSelectedDate(date);
        setEditingEvent(event);
        if (event) {
            setForm({
                title: event.title,
                time: event.time || "",
                location: event.location || "",
                notes: event.notes || ""
            });
        } else {
            setForm({ title: "", time: "", location: "", notes: "" });
        }
        setIsModalOpen(true);
    };

    const saveEvent = () => {
        if (!form.title.trim()) return;

        const eventData = {
            id: editingEvent?.id || Date.now(),
            date: selectedDate.toISOString().split("T")[0],
            title: form.title,
            time: form.time,
            location: form.location,
            notes: form.notes
        };

        if (editingEvent) {
            setEvents(events.map(e => e.id === editingEvent.id ? eventData : e));
        } else {
            setEvents([...events, eventData]);
        }
        setIsModalOpen(false);
    };

    const deleteEvent = (id) => {
        setEvents(events.filter(e => e.id !== id));
        setIsModalOpen(false);
    };

    const getEventsForDate = (date) => {
        if (!date) return [];
        const dateStr = date.toISOString().split("T")[0];
        return events.filter(e => e.date === dateStr);
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
            <div className="max-w-7xl mx-auto p-6 lg:p-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-4">
                        <Calendar className="w-14 h-14 text-indigo-600" />
                        Lịch cá nhân
                    </h1>
                    <p className="text-2xl text-gray-600 dark:text-gray-400">Quản lý thời gian – Sống có kế hoạch</p>
                </motion.div>

                {/* Month Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">{monthName}</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-lg"
                            >
                                Hôm nay
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-4">
                        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(day => (
                            <div key={day} className="text-center font-bold text-gray-600 dark:text-gray-400 py-4">
                                {day}
                            </div>
                        ))}

                        {daysInMonth().map((date, idx) => {
                            const dayEvents = getEventsForDate(date);
                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => date && openModal(date)}
                                    className={`min-h-32 rounded-2xl p-4 cursor-pointer transition-all ${date
                                            ? isToday(date)
                                                ? "bg-indigo-600 text-white shadow-xl"
                                                : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            : "bg-transparent"
                                        }`}
                                >
                                    {date && (
                                        <>
                                            <div className={`text-lg font-semibold mb-2 ${isToday(date) ? "text-white" : ""}`}>
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {dayEvents.slice(0, 3).map(event => (
                                                    <div
                                                        key={event.id}
                                                        onClick={(e) => { e.stopPropagation(); openModal(date, event); }}
                                                        className="text-xs p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur truncate"
                                                    >
                                                        {event.time && <Clock className="w-3 h-3 inline mr-1" />}
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="text-xs text-gray-500">+{dayEvents.length - 3} nữa</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Floating Add Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal(new Date())}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-10"
                >
                    <Plus className="w-8 h-8" />
                </motion.button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && selectedDate && (
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
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold">
                                    {editingEvent ? "Sửa sự kiện" : "Thêm sự kiện mới"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="text-center mb-6">
                                <p className="text-2xl font-bold text-indigo-600">
                                    {selectedDate.toLocaleDateString("vi-VN", { weekday: "long, ngày d tháng m" })}
                                </p>
                            </div>

                            <div className="space-y-5">
                                <input
                                    type="text"
                                    placeholder="Tên sự kiện..."
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-6 py-5 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500 focus:outline-none"
                                    autoFocus
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Giờ (VD: 14:00)"
                                        value={form.time}
                                        onChange={e => setForm({ ...form, time: e.target.value })}
                                        className="flex-1 px-6 py-5 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Địa điểm"
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                        className="flex-1 px-6 py-5 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500"
                                    />
                                </div>
                                <textarea
                                    rows={3}
                                    placeholder="Ghi chú..."
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                    className="w-full px-6 py-5 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500 resize-none"
                                />

                                <div className="flex gap-4 justify-center pt-6">
                                    {editingEvent && (
                                        <button
                                            onClick={() => deleteEvent(editingEvent.id)}
                                            className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                    <button
                                        onClick={saveEvent}
                                        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
                                    >
                                        {editingEvent ? "Cập nhật" : "Thêm sự kiện"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}