// src/pages/Journal/Entries.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, Calendar, Smile, Frown, Meh, Cloud, Sun, CloudRain,
    Tag, Edit2, Trash2, X, Save
} from "lucide-react";

const MOODS = [
    { icon: Smile, label: "Tuyệt vời", color: "text-green-500" },
    { icon: Meh, label: "Bình thường", color: "text-yellow-500" },
    { icon: Frown, label: "Không tốt", color: "text-red-500" },
];

const WEATHERS = [
    { icon: Sun, label: "Nắng", emoji: "Sunny" },
    { icon: Cloud, label: "Mây", emoji: "Cloudy" },
    { icon: CloudRain, label: "Mưa", emoji: "Rainy" },
];

export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [search, setSearch] = useState("");
    const [filterMood, setFilterMood] = useState("all");
    const [isNewEntry, setIsNewEntry] = useState(false);

    // Load
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-journal");
        if (saved) setEntries(JSON.parse(saved));
    }, []);

    // Save
    useEffect(() => {
        localStorage.setItem("lifeos-journal", JSON.stringify(entries));
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
        .filter(e => e.content.toLowerCase().includes(search.toLowerCase()))
        .filter(e => filterMood === "all" || e.mood === filterMood)
        .sort((a, b) => b.date.localeCompare(a.date));

    const getHeatmapData = () => {
        const map = {};
        entries.forEach(e => { map[e.date] = (map[e.date] || 0) + 1; });
        return map;
    };

    const heatmap = getHeatmapData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:to-amber-900 flex">
            {/* Sidebar */}
            <div className="w-96 bg-white/70 dark:bg-gray-800/70 backdrop-blur border-r border-gray-200 dark:border-gray-700 p-8 overflow-y-auto">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-8">Journal</h1>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text" placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 focus:ring-4 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>

                    {/* Mood Filter */}
                    <div className="flex gap-4 mb-8">
                        <button onClick={() => setFilterMood("all")} className={`px-5 py-3 rounded-xl font-medium ${filterMood === "all" ? "bg-amber-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}>
                            Tất cả
                        </button>
                        {MOODS.map(m => (
                            <button key={m.label} onClick={() => setFilterMood(m.label)}
                                className={`p-4 rounded-xl ${filterMood === m.label ? "bg-amber-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-700"}`}>
                                <m.icon className={`w-8 h-8 ${m.color}`} />
                            </button>
                        ))}
                    </div>

                    {/* New Entry Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => openEntry()}
                        className="w-full mb-8 py-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3"
                    >
                        <Plus className="w-8 h-8" /> Viết nhật ký mới
                    </motion.button>

                    {/* Entry List */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filtered.map(entry => (
                                <motion.div
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    onClick={() => setSelectedEntry(entry)}
                                    className={`p-6 rounded-2xl cursor-pointer transition-all ${selectedEntry?.id === entry.id ? "bg-amber-100 dark:bg-amber-900/50 ring-4 ring-amber-500" : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                                {entry.title || new Date(entry.date).toLocaleDateString("vi-VN", { weekday: "long, ngày d tháng m" })}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {entry.content.slice(0, 80)}{entry.content.length > 80 ? "..." : ""}
                                            </p>
                                        </div>
                                        {entry.mood && (
                                            <div className="ml-4">
                                                {MOODS.find(m => m.label === entry.mood)?.icon({ className: `w-8 h-8 ${MOODS.find(m => m.label === entry.mood)?.color}` })}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mini Heatmap */}
                    <div className="mt-12">
                        <h3 className="text-xl font-bold mb-4">Heatmap 2025</h3>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 365 }, (_, i) => {
                                const date = new Date(2025, 0, i + 1).toISOString().split("T")[0];
                                const count = heatmap[date] || 0;
                                return (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-lg transition-all ${count === 0 ? "bg-gray-100 dark:bg-gray-800" :
                                                count === 1 ? "bg-amber-300 dark:bg-amber-700" :
                                                    count === 2 ? "bg-amber-500 dark:bg-amber-600" :
                                                        "bg-amber-700 dark:bg-amber-500"
                                            }`}
                                        title={`${date}: ${count} entries`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Editor */}
            <AnimatePresence mode="wait">
                {selectedEntry && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex-1 p-12 overflow-y-auto"
                    >
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-5xl font-bold text-gray-800 dark:text-white">
                                    {new Date(selectedEntry.date).toLocaleDateString("vi-VN", { weekday: "long, ngày d tháng m, năm yyyy" })}
                                </h2>
                                <div className="flex gap-4">
                                    {isNewEntry && (
                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={saveEntry}
                                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl">
                                            <Save className="w-6 h-6" /> Lưu
                                        </motion.button>
                                    )}
                                    <button onClick={() => deleteEntry(selectedEntry.id)}
                                        className="p-4 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </button>
                                    <button onClick={() => setSelectedEntry(null)}
                                        className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Mood & Weather */}
                            <div className="flex gap-8 mb-12">
                                <div>
                                    <p className="text-lg font-medium mb-4">Hôm nay bạn cảm thấy thế nào?</p>
                                    <div className="flex gap-6">
                                        {MOODS.map(m => (
                                            <button key={m.label} onClick={() => setSelectedEntry({ ...selectedEntry, mood: m.label })}
                                                className={`p-6 rounded-2xl transition-all ${selectedEntry.mood === m.label ? "bg-amber-100 dark:bg-amber-900/50 ring-4 ring-amber-500 scale-110" : "bg-gray-100 dark:bg-gray-700"}`}>
                                                <m.icon className={`w-16 h-16 ${m.color}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-lg font-medium mb-4">Thời tiết</p>
                                    <div className="flex gap-6">
                                        {WEATHERS.map(w => (
                                            <button key={w.label} onClick={() => setSelectedEntry({ ...selectedEntry, weather: w.label })}
                                                className={`p-6 rounded-2xl text-4xl transition-all ${selectedEntry.weather === w.label ? "bg-sky-100 dark:bg-sky-900/50 ring-4 ring-sky-500 scale-110" : "bg-gray-100 dark:bg-gray-700"}`}>
                                                {w.emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Rich Text Editor (giả lập bằng textarea + format hint) */}
                            <textarea
                                placeholder="Hôm nay bạn nghĩ gì? Viết tự do nhé... (dùng #tag, **đậm**, _nghiêng_, > quote, - list)"
                                value={selectedEntry.content}
                                onChange={e => setSelectedEntry({ ...selectedEntry, content: e.target.value })}
                                className="w-full min-h-96 p-8 text-xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-transparent focus:border-amber-500 focus:outline-none resize-none"
                                autoFocus
                            />

                            {/* Preview */}
                            {selectedEntry.content && (
                                <div className="mt-12 p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                                    <h3 className="text-2xl font-bold mb-6">Preview</h3>
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        {/* Ở đây bạn có thể dùng remark + react-markdown nếu muốn, nhưng để không cần cài gì thì mình để raw */}
                                        <div dangerouslySetInnerHTML={{
                                            __html: selectedEntry.content
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/_(.*?)_/g, '<em>$1</em>')
                                                .replace(/> (.*)/g, '<blockquote>$1</blockquote>')
                                                .replace(/- (.*)/g, '<li>$1</li>')
                                                .replace(/#(\w+)/g, '<span class="text-amber-600 font-bold">#$1</span>')
                                        }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {!selectedEntry && entries.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-64 h-64 mx-auto mb-12" />
                        <p className="text-4xl font-bold text-gray-600 dark:text-gray-400">Chưa có nhật ký nào</p>
                        <p className="text-2xl mt-6">Bấm "Viết nhật ký mới" để bắt đầu hành trình của bạn</p>
                    </div>
                </div>
            )}
        </div>
    );
}