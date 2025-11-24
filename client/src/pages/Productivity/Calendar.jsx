// src/pages/Productivity/Calendar.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI TOÀN BỘ APP (Overview, Tasks, Habits, Goals, DailyReview)
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
    const [form, setForm] = useState({ title: "", time: "", location: "", notes: "" });

    // localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-calendar-events");
            if (saved) setEvents(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-calendar-events", JSON.stringify(events));
        } catch (e) { console.error(e); }
    }, [events]);

    const daysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
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

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const saveEvent = () => {
        if (!form.title.trim()) return;
        const eventData = {
            id: editingEvent?.id || Date.now(),
            date: selectedDate.toISOString().split("T")[0],
            title: form.title.trim(),
            time: form.time,
            location: form.location,
            notes: form.notes
        };

        if (editingEvent) {
            setEvents(events.map(e => e.id === editingEvent.id ? eventData : e));
        } else {
            setEvents([...events, eventData]);
        }
        closeModal();
    };

    const deleteEvent = (id) => {
        setEvents(events.filter(e => e.id !== id));
        closeModal();
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
        <>
            {/* HEADER – ĐỒNG BỘ HOÀN TOÀN */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Calendar className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Lịch cá nhân
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {events.length} sự kiện trong tháng này
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Quản lý thời gian một cách thông minh – không bao giờ bỏ lỡ điều quan trọng.
                    </p>
                </div>
            </motion.div>

            {/* NỘI DUNG CHÍNH – ĐỒNG BỘ HOÀN TOÀN */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

                {/* Calendar Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
                >
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                            {monthName}
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                <ChevronLeft className="w-7 h-7" />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition"
                            >
                                Hôm nay
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                <ChevronRight className="w-7 h-7" />
                            </button>
                        </div>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-4 mb-4">
                        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(day => (
                            <div key={day} className="text-center text-lg font-bold text-gray-600 dark:text-gray-400 py-3">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {daysInMonth().map((date, idx) => {
                            const dayEvents = getEventsForDate(date);
                            const today = isToday(date);

                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={date ? { scale: 1.05, y: -4 } : {}}
                                    onClick={() => date && openModal(date)}
                                    className={`min-h-32 rounded-2xl p-2 transition-all cursor-pointer ${date
                                        ? today
                                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl ring-4 ring-indigo-500/30"
                                            : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-lg"
                                        : "bg-transparent"
                                        }`}
                                >
                                    {date && (
                                        <>
                                            <div className={`text-xl font-bold mb-2 ${today ? "text-white" : "text-gray-800 dark:text-white"}`}>
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-2">
                                                {dayEvents.slice(0, 3).map(event => (
                                                    <div
                                                        key={event.id}
                                                        onClick={(e) => { e.stopPropagation(); openModal(date, event); }}
                                                        className="text-xs p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur truncate font-medium shadow-sm"
                                                    >
                                                        {event.time && <Clock className="w-3 h-3 inline mr-1" />}
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        +{dayEvents.length - 3} nữa
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Floating Add Button */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal(new Date())}
                    className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center text-white z-10"
                >
                    <Plus className="w-10 h-10" />
                </motion.button>

                {/* Modal – ĐỒNG BỘ HOÀN TOÀN */}
                <AnimatePresence>
                    {isModalOpen && selectedDate && (
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
                                        {editingEvent ? "Sửa sự kiện" : "Thêm sự kiện mới"}
                                    </h2>
                                    <button onClick={closeModal} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="text-center mb-8">
                                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {selectedDate.toLocaleDateString("vi-VN", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="Tên sự kiện..."
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none text-lg font-medium"
                                        autoFocus
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Giờ (VD: 14:00 - 16:00)"
                                            value={form.time}
                                            onChange={e => setForm({ ...form, time: e.target.value })}
                                            className="px-6 py-5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Địa điểm"
                                            value={form.location}
                                            onChange={e => setForm({ ...form, location: e.target.value })}
                                            className="px-6 py-5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <textarea
                                        rows={4}
                                        placeholder="Ghi chú..."
                                        value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none resize-none"
                                    />

                                    <div className="flex gap-4 justify-end pt-6">
                                        {editingEvent && (
                                            <button
                                                onClick={() => deleteEvent(editingEvent.id)}
                                                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                        <button
                                            onClick={saveEvent}
                                            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl transition"
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
        </>
    );
}