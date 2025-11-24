// src/pages/Journal/Entries.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI CHUẨN OVERVIEW.JSX → ĐẸP NHƯ NOTION PRO
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, Calendar, Smile, Frown, Meh, Cloud, Sun, CloudRain,
    Tag, Edit2, Trash2, X, Save, Sparkles
} from "lucide-react";

const MOODS = [
    { icon: Smile, label: "Tuyệt vời", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { icon: Meh, label: "Bình thường", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
    { icon: Frown, label: "Không tốt", color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
];

const WEATHERS = [
    { icon: Sun, label: "Nắng", emoji: "Sunny", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
    { icon: Cloud, label: "Mây", emoji: "Cloudy", bg: "bg-gray-200 dark:bg-gray-700" },
    { icon: CloudRain, label: "Mưa", emoji: "Rainy", bg: "bg-blue-100 dark:bg-blue-900/30" },
];

export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [search, setSearch] = useState("");
    const [filterMood, setFilterMood] = useState("all");
    const [isNewEntry, setIsNewEntry] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-journal");
            if (saved) setEntries(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-journal", JSON.stringify(entries));
        } catch (e) { console.error(e); }
    }, [entries]);

    const today = new Date().toISOString().split("T")[0];

    const openEntry = (entry = null) => {
        setSelectedEntry(entry || {
            id: Date.now(),
            date: today,
            title: "",
            content: "",
            mood: "",
            weather: "",
            tags: []
        });
        setIsNewEntry(!entry);
    };

    const saveEntry = () => {
        if (!selectedEntry?.content.trim()) return;
        const tags = selectedEntry.content.split(" ").filter(w => w.startsWith("#")).map(t => t.slice(1));
        const updated = { ...selectedEntry, tags: [...new Set(tags)] };
        setEntries(prev => {
            const exists = prev.some(e => e.id === updated.id);
            return exists ? prev.map(e => e.id === updated.id ? updated : e) : [...prev, updated];
        });
        setSelectedEntry(null);
        setIsNewEntry(false);
    };

    const deleteEntry = (id) => {
        setEntries(entries.filter(e => e.id !== id));
        if (selectedEntry?.id === id) setSelectedEntry(null);
    };

    const filtered = entries
        .filter(e => e.content.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase()))
        .filter(e => filterMood === "all" || e.mood === filterMood)
        .sort((a, b) => b.date.localeCompare(a.date));

    const getHeatmapData = () => {
        const map = {};
        entries.forEach(e => { map[e.date] = (map[e.date] || 0) + 1; });
        return map;
    };
    const heatmap = getHeatmapData();

    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 dark:from-amber-900 dark:via-orange-900 dark:to-pink-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
                                Nhật ký cá nhân
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {entries.length} ngày • {filtered.length} kết quả
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Nơi bạn ghi lại cảm xúc, suy nghĩ và hành trình trưởng thành mỗi ngày.
                    </p>
                </div>
            </motion.div>

            <div className="flex h-screen bg-gradient-to-br from-amber-50/50 to-pink-50/50 dark:from-gray-900 dark:to-amber-900/20">
                {/* SIDEBAR */}
                <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-8 overflow-y-auto shadow-xl">
                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhật ký..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-amber-500 focus:outline-none text-lg font-medium"
                        />
                    </div>

                    {/* Mood Filter */}
                    <div className="flex gap-4 mb-8 flex-wrap">
                        <button onClick={() => setFilterMood("all")} className={`px-6 py-4 rounded-2xl font-bold transition ${filterMood === "all" ? "bg-amber-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-700"}`}>
                            Tất cả
                        </button>
                        {MOODS.map(m => (
                            <button key={m.label} onClick={() => setFilterMood(m.label)}
                                className={`p-5 rounded-2xl transition-all ${filterMood === m.label ? "ring-4 ring-amber-500 scale-110 shadow-xl" : ""} ${m.bg}`}>
                                <m.icon className={`w-10 h-10 ${m.color}`} />
                            </button>
                        ))}
                    </div>

                    {/* New Entry Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEntry()}
                        className="w-full mb-10 py-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4 hover:shadow-amber-500/50 transition-all"
                    >
                        <Plus className="w-8 h-8" /> Viết nhật ký mới
                    </motion.button>

                    {/* Entry List */}
                    <div className="space-y-5">
                        <AnimatePresence>
                            {filtered.map(entry => (
                                <motion.div
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    onClick={() => setSelectedEntry(entry)}
                                    className={`p-6 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${selectedEntry?.id === entry.id ? "bg-amber-100 dark:bg-amber-900/50 ring-4 ring-amber-500 shadow-xl" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                        {new Date(entry.date).toLocaleDateString("vi-VN", { weekday: "long, ngày d tháng m" })}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                        {entry.content || "Chưa có nội dung..."}
                                    </p>
                                    <div className="flex items-center gap-3 mt-4">
                                        {entry.mood && MOODS.find(m => m.label === entry.mood) && (
                                            <div className={`p-2 rounded-lg ${MOODS.find(m => m.label === entry.mood).bg}`}>
                                                {React.createElement(MOODS.find(m => m.label === entry.mood).icon, { className: "w-5 h-5" + MOODS.find(m => m.label === entry.mood).color })}
                                            </div>
                                        )}
                                        {entry.tags.slice(0, 3).map(t => (
                                            <span key={t} className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full">#{t}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mini Heatmap */}
                    <div className="mt-12">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Heatmap viết nhật ký</h3>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 365 }, (_, i) => {
                                const date = new Date(2025, 0, i + 1).toISOString().split("T")[0];
                                const count = heatmap[date] || 0;
                                return (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-lg transition-all ${count === 0 ? "bg-gray-200 dark:bg-gray-800" :
                                            count === 1 ? "bg-amber-300 dark:bg-amber-700" :
                                                count === 2 ? "bg-amber-500 dark:bg-amber-600" :
                                                    "bg-amber-700 dark:bg-amber-500"
                                            }`}
                                        title={`${date}: ${count} entry`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* EDITOR */}
                <AnimatePresence mode="wait">
                    {selectedEntry ? (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="flex-1 p-10 lg:p-16 overflow-y-auto"
                        >
                            <div className="max-w-4xl mx-auto space-y-10">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-5xl font-extrabold text-gray-800 dark:text-white">
                                            {new Date(selectedEntry.date).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                        </h2>
                                    </div>
                                    <div className="flex gap-4">
                                        {isNewEntry && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={saveEntry}
                                                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl flex items-center gap-3"
                                            >
                                                <Save className="w-6 h-6" /> Lưu nhật ký
                                            </motion.button>
                                        )}
                                        <button onClick={() => deleteEntry(selectedEntry.id)} className="p-4 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl">
                                            <Trash2 className="w-6 h-6 text-red-600" />
                                        </button>
                                        <button onClick={() => setSelectedEntry(null)} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Mood & Weather */}
                                <div className="grid grid-cols-2 gap-12">
                                    <div>
                                        <p className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-300">Hôm nay bạn cảm thấy thế nào?</p>
                                        <div className="flex gap-6">
                                            {MOODS.map(m => (
                                                <button
                                                    key={m.label}
                                                    onClick={() => setSelectedEntry({ ...selectedEntry, mood: m.label })}
                                                    className={`p-8 rounded-3xl transition-all ${selectedEntry.mood === m.label ? "ring-4 ring-amber-500 scale-110 shadow-2xl" : "hover:scale-105"} ${m.bg}`}
                                                >
                                                    <m.icon className={`w-20 h-20 ${m.color}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-300">Thời tiết hôm nay</p>
                                        <div className="flex gap-6">
                                            {WEATHERS.map(w => (
                                                <button
                                                    key={w.label}
                                                    onClick={() => setSelectedEntry({ ...selectedEntry, weather: w.label })}
                                                    className={`p-8 rounded-3xl text-6xl transition-all ${selectedEntry.weather === w.label ? "ring-4 ring-sky-500 scale-110 shadow-2xl" : "hover:scale-105"} ${w.bg}`}
                                                >
                                                    {w.emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Editor */}
                                <textarea
                                    placeholder="Hôm nay bạn nghĩ gì? Viết tự do nhé... (dùng #tag để tạo hashtag)"
                                    value={selectedEntry.content}
                                    onChange={e => setSelectedEntry({ ...selectedEntry, content: e.target.value })}
                                    className="w-full min-h-96 p-10 text-xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-transparent focus:border-amber-500 focus:outline-none resize-none font-medium leading-relaxed"
                                    autoFocus
                                />

                                {/* Preview */}
                                {selectedEntry.content && (
                                    <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-inner">
                                        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Xem trước</h3>
                                        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
                                            <div dangerouslySetInnerHTML={{
                                                __html: selectedEntry.content
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-amber-600">$1</strong>')
                                                    .replace(/#(\w+)/g, '<span class="text-amber-600 font-bold">#$1</span>')
                                                    .replace(/^> (.*)$/gm, '<blockquote class="border-l-4 border-amber-500 pl-4 italic">$1</blockquote>')
                                                    .replace(/^- (.*)$/gm, '<li class="ml-6">• $1</li>')
                                            }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex items-center justify-center">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                <div className="w-64 h-64 mx-auto mb-12 bg-gradient-to-br from-amber-100 to-pink-100 dark:from-amber-900/30 dark:to-pink-900/30 rounded-3xl border-4 border-dashed border-amber-400 dark:border-amber-700 flex items-center justify-center">
                                    <Sparkles className="w-32 h-32 text-amber-600 dark:text-amber-400" />
                                </div>
                                <p className="text-5xl font-extrabold text-gray-700 dark:text-gray-300">Chưa có nhật ký nào</p>
                                <p className="text-2xl text-gray-500 dark:text-gray-400 mt-6">Bấm "Viết nhật ký mới" để bắt đầu hành trình của bạn</p>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}