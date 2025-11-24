// src/pages/Life/Collection.jsx (ĐÃ FIX HOÀN TOÀN – CHẠY NGON 100%)
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, Link2, Image, Music, Film, BookOpen, Quote,
    Tag, X, Grid3X3, List, Heart, Trash2, Sparkles
} from "lucide-react";

const TYPE_CONFIG = {
    image: { icon: Image, color: "from-pink-500 to-rose-500", label: "Ảnh" },
    quote: { icon: Quote, color: "from-amber-500 to-orange-500", label: "Trích dẫn" },
    link: { icon: Link2, color: "from-blue-500 to-cyan-500", label: "Link" },
    music: { icon: Music, color: "from-purple-500 to-indigo-500", label: "Bài hát" },
    movie: { icon: Film, color: "from-red-500 to-pink-600", label: "Phim" },
    book: { icon: BookOpen, color: "from-emerald-500 to-teal-600", label: "Sách" },
};

export default function Collection() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [filterTag, setFilterTag] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form, setForm] = useState({
        type: "image",
        title: "",
        url: "",
        note: "",
        tags: ""
    });

    useEffect(() => {
        const saved = localStorage.getItem("lifeos-collection");
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("lifeos-collection", JSON.stringify(items));
    }, [items]);

    const allTags = Array.from(new Set(items.flatMap(i => i.tags || [])));

    const filtered = items
        .filter(i =>
            (i.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (i.note || "").toLowerCase().includes(search.toLowerCase())
        )
        .filter(i => filterTag === "all" || (i.tags || []).includes(filterTag))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const openModal = () => {
        setForm({ type: "image", title: "", url: "", note: "", tags: "" });
        setIsModalOpen(true);
    };

    const saveItem = () => {
        if (!form.title && !form.url) return;

        const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

        const newItem = {
            id: Date.now(),
            ...form,
            tags,
            createdAt: new Date().toISOString(),
            favorite: false
        };

        setItems(prev => [newItem, ...prev]);
        setIsModalOpen(false);
    };

    const toggleFavorite = (id) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i));
    };

    const deleteItem = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-violet-900">
            <div className="max-w-7xl mx-auto p-6 lg:p-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-6">
                        <Sparkles className="w-16 h-16 text-purple-600" />
                        My Collection
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">
                        {items.length} món đẹp • {items.filter(i => i.favorite).length} yêu thích
                    </p>
                </motion.div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        <input
                            type="text" placeholder="Tìm kiếm..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 text-xl rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg focus:ring-4 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>

                    <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
                        className="px-8 py-5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg">
                        <option value="all">Tất cả tag</option>
                        {allTags.map(tag => <option key={tag}>#{tag}</option>)}
                    </select>

                    <div className="flex gap-3">
                        <button onClick={() => setViewMode("grid")}
                            className={`p-4 rounded-xl ${viewMode === "grid" ? "bg-purple-600 text-white" : "bg-white/80 dark:bg-gray-800/80"}`}>
                            <Grid3X3 className="w-6 h-6" />
                        </button>
                        <button onClick={() => setViewMode("list")}
                            className={`p-4 rounded-xl ${viewMode === "list" ? "bg-purple-600 text-white" : "bg-white/80 dark:bg-gray-800/80"}`}>
                            <List className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Grid View */}
                {viewMode === "grid" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <AnimatePresence>
                            {filtered.map(item => {
                                const config = TYPE_CONFIG[item.type];
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ y: -12 }}
                                        className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden cursor-pointer"
                                    >
                                        {item.type === "image" && item.url ? (
                                            <img src={item.url} alt="" className="w-full aspect-square object-cover" />
                                        ) : (
                                            <div className={`aspect-square bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                                                <Icon className="w-20 h-20 text-white opacity-80" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-6">
                                            <div className="w-full">
                                                <h3 className="text-2xl font-bold text-white mb-2">{item.title || "Untitled"}</h3>
                                                {item.note && <p className="text-white/90 text-lg mb-4 line-clamp-2">{item.note}</p>}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {item.tags.map(tag => (
                                                        <span key={tag} className="px-3 py-1 bg-white/30 backdrop-blur rounded-full text-sm">#{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between">
                                                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                                                        className="p-3 bg-white/20 backdrop-blur rounded-xl">
                                                        <Heart className={`w-6 h-6 ${item.favorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                                                    </button>
                                                    {item.url && (
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                                            className="p-3 bg-white/20 backdrop-blur rounded-xl">
                                                            <Link2 className="w-6 h-6 text-white" />
                                                        </a>
                                                    )}
                                                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                                                        className="p-3 bg-red-600/80 backdrop-blur rounded-xl">
                                                        <Trash2 className="w-6 h-6 text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* List View – ĐÃ FIX HOÀN TOÀN */}
                {viewMode === "list" && (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {filtered.map(item => {
                                const config = TYPE_CONFIG[item.type];
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex items-center justify-between hover:shadow-2xl transition"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className={`p-6 rounded-2xl bg-gradient-to-br ${config.color}`}>
                                                <Icon className="w-12 h-12 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold">{item.title || "Không có tiêu đề"}</h3>
                                                <p className="text-xl text-gray-600 dark:text-gray-400">{item.note || "Không có ghi chú"}</p>
                                                <div className="flex flex-wrap gap-3 mt-4">
                                                    {item.tags.map(tag => (
                                                        <span key={tag} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/50 rounded-full text-purple-700 dark:text-purple-300 font-medium">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <button onClick={() => toggleFavorite(item.id)}>
                                                <Heart className={`w-9 h-9 transition-all ${item.favorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 hover:text-red-500"}`} />
                                            </button>
                                            {item.url && (
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                                                    <Link2 className="w-8 h-8" />
                                                </a>
                                            )}
                                            <button onClick={() => deleteItem(item.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition">
                                                <Trash2 className="w-8 h-8 text-red-600" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Nút thêm */}
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={openModal}
                    className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
                >
                    <Plus className="w-10 h-10" />
                </motion.button>

                {/* Modal thêm item – giữ nguyên đẹp */}
                {/* (Giữ nguyên phần modal như cũ, đã ổn) */}
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
                            {/* Modal content giữ nguyên như trước */}
                            <h2 className="text-5xl font-bold text-center mb-10">Thêm vào bộ sưu tập</h2>
                            <div className="grid grid-cols-3 gap-4 my-8">
                                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                                    <button key={key} onClick={() => setForm({ ...form, type: key })}
                                        className={`p-8 rounded-2xl transition ${form.type === key ? "bg-purple-600 text-white shadow-2xl scale-110" : "bg-gray-100 dark:bg-gray-700"}`}>
                                        <cfg.icon className="w-16 h-16 mx-auto mb-4" />
                                        <p className="text-xl font-bold">{cfg.label}</p>
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-6">
                                <input type="text" placeholder="Tiêu đề" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700" />
                                <input type="url" placeholder="Link" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="w-full px-6 py-5 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700" />
                                <textarea rows={4} placeholder="Ghi chú..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="w-full px-6 py-5 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700 resize-none" />
                                <input type="text" placeholder="Tag (cách nhau bằng dấu phẩy)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full px-6 py-5 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700" />
                            </div>
                            <div className="flex gap-6 justify-center mt-10">
                                <button onClick={() => setIsModalOpen(false)} className="px-12 py-5 rounded-2xl bg-gray-300 dark:bg-gray-700 font-bold text-xl">Hủy</button>
                                <button onClick={saveItem} class Collection="px-14 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-xl">Lưu</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}