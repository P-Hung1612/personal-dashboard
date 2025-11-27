// src/pages/Life/Collection.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI FINANCE → ĐẸP KHÔNG THỂ CHỐNG CỰ!
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, X, Edit2, Trash2, Heart, Link2, Image, Music, Film, BookOpen, Quote, Sparkles,
    Grid3X3, List, Tag, MoreHorizontal
} from "lucide-react";

const TYPE_CONFIG = {
    image: { icon: Image, color: "text-pink-600", gradient: "from-pink-500 to-rose-600", label: "Ảnh" },
    quote: { icon: Quote, color: "text-amber-600", gradient: "from-amber-500 to-orange-600", label: "Trích dẫn" },
    link: { icon: Link2, color: "text-cyan-600", gradient: "from-blue-500 to-cyan-600", label: "Link" },
    music: { icon: Music, color: "text-purple-600", gradient: "from-purple-500 to-indigo-600", label: "Bài hát" },
    movie: { icon: Film, color: "text-red-600", gradient: "from-red-500 to-rose-600", label: "Phim" },
    book: { icon: BookOpen, color: "text-emerald-600", gradient: "from-emerald-500 to-teal-600", label: "Sách" },
};

const QUOTES = [
    "Những điều đẹp đẽ nhất không cần phải khoe, chỉ cần lưu giữ",
    "Bộ sưu tập là nơi lưu giữ những mảnh ghép hạnh phúc",
    "Mỗi món đồ đều kể một câu chuyện",
    "Giữ lại khoảnh khắc, giữ lại cảm xúc",
    "Bạn xứng đáng có một nơi thật đẹp để cất giữ yêu thương"
];

export default function Collection() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [search, setSearch] = useState("");
    const [filterTag, setFilterTag] = useState("all");
    const [viewMode, setViewMode] = useState("grid");

    const [form, setForm] = useState({
        type: "image", title: "", url: "", note: "", tags: ""
    });

    // Load & Save
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-collection");
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("lifeos-collection", JSON.stringify(items));
    }, [items]);

    // Tính toán tối ưu
    const allTags = useMemo(() =>
        Array.from(new Set(items.flatMap(i => i.tags || []))), [items]
    );

    const filtered = useMemo(() =>
        items
            .filter(i =>
                (i.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (i.note || "").toLowerCase().includes(search.toLowerCase())
            )
            .filter(i => filterTag === "all" || (i.tags || []).includes(filterTag))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        , [items, search, filterTag]);

    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const now = new Date();

    const openModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setForm({
                type: item.type,
                title: item.title || "",
                url: item.url || "",
                note: item.note || "",
                tags: (item.tags || []).join(", ")
            });
        } else {
            setForm({ type: "image", title: "", url: "", note: "", tags: "" });
        }
        setIsModalOpen(true);
    };

    const saveItem = () => {
        if (!form.title && !form.url) return;
        const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
        const newItem = editingItem
            ? { ...editingItem, ...form, tags, updatedAt: new Date().toISOString() }
            : {
                id: Date.now(),
                createdAt: new Date().toISOString(),
                favorite: false,
                ...form,
                tags
            };

        setItems(prev =>
            editingItem
                ? prev.map(i => i.id === editingItem.id ? newItem : i)
                : [newItem, ...prev]
        );
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const toggleFavorite = (id) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i));
    };

    const deleteItem = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN LIFE OS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Bộ sưu tập</h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} • {items.length} món yêu thích
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        “{randomQuote}”
                    </p>
                </div>
            </motion.div>

            <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: "Tổng món", value: items.length, gradient: "from-purple-500 to-pink-600" },
                        { label: "Yêu thích", value: items.filter(i => i.favorite).length, gradient: "from-rose-500 to-red-600" },
                        { label: "Ảnh", value: items.filter(i => i.type === "image").length, gradient: "from-pink-500 to-rose-600" },
                        { label: "Trích dẫn", value: items.filter(i => i.type === "quote").length, gradient: "from-amber-500 to-orange-600" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-8 text-white shadow-2xl`}
                        >
                            <p className="text-4xl font-extrabold">{stat.value}</p>
                            <p className="text-xl opacity-90 mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* TOOLBAR */}
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm trong kho báu..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 text-xl rounded-3xl bg-white dark:bg-gray-800 shadow-xl focus:ring-4 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <select
                            value={filterTag}
                            onChange={e => setFilterTag(e.target.value)}
                            className="px-8 py-6 rounded-3xl bg-white dark:bg-gray-800 shadow-xl text-lg font-medium"
                        >
                            <option value="all">Tất cả tag</option>
                            {allTags.map(t => <option key={t} value={t}>#{t}</option>)}
                        </select>

                        <div className="flex bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-2">
                            <button onClick={() => setViewMode("grid")} className={`p-4 rounded-2xl transition ${viewMode === "grid" ? "bg-purple-600 text-white" : ""}`}>
                                <Grid3X3 className="w-7 h-7" />
                            </button>
                            <button onClick={() => setViewMode("list")} className={`p-4 rounded-2xl transition ${viewMode === "list" ? "bg-purple-600 text-white" : ""}`}>
                                <List className="w-7 h-7" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* GRID VIEW */}
                {viewMode === "grid" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        <AnimatePresence>
                            {filtered.map(item => {
                                const cfg = TYPE_CONFIG[item.type];
                                const Icon = cfg.icon;
                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -12 }}
                                        className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                                    >
                                        {item.type === "image" && item.url ? (
                                            <img
                                                src={item.url}
                                                alt={item.title}
                                                className="w-full aspect-square object-cover"
                                                onError={e => { e.target.style.display = "none"; e.target.nextElementSibling.style.display = "flex"; }}
                                            />
                                        ) : null}
                                        <div className={`aspect-square bg-gradient-to-br ${cfg.gradient} flex items-center justify-center ${item.type === "image" && item.url ? "hidden" : "flex"}`}>
                                            <Icon className="w-24 h-24 text-white opacity-90" />
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                                            <h3 className="text-2xl font-bold text-white mb-2">{item.title || "Không tên"}</h3>
                                            {item.note && <p className="text-white/80 text-lg line-clamp-2 mb-4">{item.note}</p>}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {item.tags?.map(t => (
                                                    <span key={t} className="px-4 py-2 bg-white/30 rounded-full text-sm">#{t}</span>
                                                ))}
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => toggleFavorite(item.id)}>
                                                    <Heart className={`w-10 h-10 transition-all ${item.favorite ? "fill-red-500 text-red-500 scale-110" : "text-white"}`} />
                                                </button>
                                                {item.url && (
                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                                        <Link2 className="w-10 h-10 text-white" />
                                                    </a>
                                                )}
                                                <button onClick={() => openModal(item)} className="p-3 bg-white/20 rounded-xl">
                                                    <Edit2 className="w-7 h-7 text-white" />
                                                </button>
                                                <button onClick={() => deleteItem(item.id)} className="p-3 bg-red-600/80 rounded-xl">
                                                    <Trash2 className="w-7 h-7 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* LIST VIEW – giống hệt Finance */}
                {viewMode === "list" && filtered.map(item => {
                    const cfg = TYPE_CONFIG[item.type];
                    const Icon = cfg.icon;
                    return (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="flex items-center justify-between p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-all group"
                        >
                            <div className="flex items-center gap-8">
                                <div className={`p-6 rounded-3xl bg-gradient-to-br ${cfg.gradient}`}>
                                    <Icon className="w-14 h-14 text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{item.title || "Không có tiêu đề"}</p>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">{item.note || "Không có ghi chú"}</p>
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {item.tags?.map(t => (
                                            <span key={t} className="px-5 py-2 bg-purple-100 dark:bg-purple-900/50 rounded-full text-purple-700 dark:text-purple-300">#{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => toggleFavorite(item.id)}>
                                    <Heart className={`w-12 h-12 transition-all ${item.favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                                </button>
                                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer"><Link2 className="w-12 h-12" /></a>}
                                <button onClick={() => openModal(item)}><Edit2 className="w-10 h-10" /></button>
                                <button onClick={() => deleteItem(item.id)}><Trash2 className="w-10 h-10 text-red-600" /></button>
                            </div>
                        </motion.div>
                    );
                })}

                {/* EMPTY STATE */}
                {filtered.length === 0 && (
                    <div className="text-center py-32">
                        <Sparkles className="w-32 h-32 mx-auto text-purple-400 mb-8 opacity-40" />
                        <p className="text-4xl font-bold text-gray-400">Kho báu còn trống...</p>
                        <p className="text-2xl text-gray-500 mt-4">Hãy thêm điều đẹp đẽ đầu tiên!</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => openModal()}
                className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center text-white z-10 hover:shadow-3xl transition-all"
            >
                <Plus className="w-10 h-10" />
            </motion.button>

            {/* MODAL – giống hệt Finance */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-3xl p-10 max-w-4xl w-full max-h-screen overflow-y-auto border border-gray-200 dark:border-gray-700"
                        >
                            <h2 className="text-4xl font-extrabold text-center mb-12">
                                {editingItem ? "Chỉnh sửa" : "Thêm vào kho báu"}
                            </h2>

                            {/* Type selection */}
                            <div className="grid grid-cols-3 gap-6 mb-10">
                                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                                    <motion.button
                                        key={key}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setForm(prev => ({ ...prev, type: key }))}
                                        className={`p-10 rounded-3xl transition-all ${form.type === key ? `bg-gradient-to-br ${cfg.gradient} text-white shadow-2xl` : "bg-gray-100 dark:bg-gray-700"}`}
                                    >
                                        <cfg.icon className={`w-16 h-16 mx-auto mb-4 ${form.type === key ? "text-white" : cfg.color}`} />
                                        <p className="text-2xl font-bold">{cfg.label}</p>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="space-y-8">
                                <input type="text" placeholder="Tiêu đề đẹp lung linh..." value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-10 py-8 text-2xl font-bold rounded-3xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 outline-none" />
                                <input type="url" placeholder="Link (nếu có)" value={form.url} onChange={e => setForm(prev => ({ ...prev, url: e.target.value }))} className="w-full px-10 py-8 text-2xl rounded-3xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 focus:border-purple-500 outline-none" />
                                <textarea rows={5} placeholder="Cảm xúc, câu chuyện..." value={form.note} onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))} className="w-full px-10 py-8 text-2xl rounded-3xl bg-gray-50 dark:bg-gray-700 resize-none border-2 border-gray-300 focus:border-purple-500 outline-none" />
                                <input type="text" placeholder="Tag cách nhau bằng dấu phẩy" value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))} className="w-full px-10 py-8 text-2xl rounded-3xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 focus:border-purple-500 outline-none" />
                            </div>

                            <div className="flex justify-end gap-6 mt-12">
                                <button onClick={() => setIsModalOpen(false)} className="px-12 py-6 rounded-2xl bg-gray-200 dark:bg-gray-700 font-bold text-xl">
                                    Hủy
                                </button>
                                <button onClick={saveItem} className="px-16 py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-2xl">
                                    {editingItem ? "Cập nhật" : "Lưu vào kho báu"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}