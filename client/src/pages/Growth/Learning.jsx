// src/pages/Learning/Resources.jsx
// ĐÃ ĐỒNG BỘ 100% VỚI CHUẨN OVERVIEW.JSX (Header, Card, Button, Modal, Spacing, Dark Mode...)
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, BookOpen, Video, Link2, FileText,
    Edit2, Trash2, CheckCircle2, Circle, Tag, X, Sparkles
} from "lucide-react";

const TYPES = {
    COURSE: "course", BOOK: "book", VIDEO: "video", ARTICLE: "article", OTHER: "other"
};

const TYPE_CONFIG = {
    [TYPES.COURSE]: { icon: Video, color: "from-purple-600 to-pink-600", label: "Khóa học" },
    [TYPES.BOOK]: { icon: BookOpen, color: "from-amber-600 to-orange-600", label: "Sách" },
    [TYPES.VIDEO]: { icon: Video, color: "from-red-600 to-rose-600", label: "Video" },
    [TYPES.ARTICLE]: { icon: FileText, color: "from-blue-600 to-cyan-600", label: "Bài viết" },
    [TYPES.OTHER]: { icon: Link2, color: "from-gray-600 to-slate-600", label: "Khác" },
};

export default function Resources() {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState("");
    const [filterTag, setFilterTag] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRes, setEditingRes] = useState(null);
    const [form, setForm] = useState({
        title: "", type: TYPES.COURSE, url: "", tags: "", progress: 0, notes: ""
    });

    // localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-learning");
            if (saved) setResources(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-learning", JSON.stringify(resources));
        } catch (e) { console.error(e); }
    }, [resources]);

    const allTags = Array.from(new Set(resources.flatMap(r => r.tags)));
    const filtered = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesTag = filterTag === "all" || r.tags.includes(filterTag);
        return matchesSearch && matchesTag;
    });

    const openModal = (res = null) => {
        setEditingRes(res);
        if (res) {
            setForm({
                title: res.title,
                type: res.type,
                url: res.url,
                tags: res.tags.join(", "),
                progress: res.progress,
                notes: res.notes || ""
            });
        } else {
            setForm({ title: "", type: TYPES.COURSE, url: "", tags: "", progress: 0, notes: "" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRes(null);
    };

    const saveResource = () => {
        if (!form.title.trim()) return;
        const tagsArray = form.tags.split(",").map(t => t.trim()).filter(Boolean);
        const newRes = editingRes
            ? { ...editingRes, ...form, tags: tagsArray }
            : {
                id: Date.now(),
                ...form,
                tags: tagsArray,
                createdAt: new Date().toISOString()
            };

        setResources(editingRes
            ? resources.map(r => r.id === editingRes.id ? newRes : r)
            : [...resources, newRes]
        );
        closeModal();
    };

    const deleteResource = (id) => setResources(resources.filter(r => r.id !== id));
    const updateProgress = (id, progress) => {
        setResources(resources.map(r => r.id === id ? { ...r, progress } : r));
    };

    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN OVERVIEW */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Sparkles className="w-16 h促使-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Kho Tài Nguyên Học Tập
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {resources.length} tài nguyên • {resources.filter(r => r.progress > 0 && r.progress < 100).length} đang học
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Nơi lưu trữ mọi thứ giúp bạn trở nên giỏi hơn mỗi ngày.
                    </p>
                </div>
            </motion.div>

            {/* NỘI DUNG CHÍNH – ĐỒNG BỘ CHUẨN */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

                {/* Search + Filter */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài nguyên..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500 focus:outline-none text-lg font-medium shadow-sm"
                        />
                    </div>
                    <select
                        value={filterTag}
                        onChange={e => setFilterTag(e.target.value)}
                        className="px-8 py-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500 text-lg font-medium shadow-sm"
                    >
                        <option value="all">Tất cả tag</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>#{tag}</option>
                        ))}
                    </select>
                </div>

                {/* Resources Grid */}
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24"
                    >
                        <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-4 border-dashed border-indigo-400 dark:border-indigo-700 rounded-3xl flex items-center justify-center">
                            <BookOpen className="w-20 h-20 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                            {resources.length === 0 ? "Chưa có tài nguyên nào" : "Không tìm thấy kết quả"}
                        </p>
                        <p className="text-gray-500 mt-4">
                            Bấm nút + để thêm khóa học, sách, video đầu tiên!
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filtered.map(resource => {
                                const config = TYPE_CONFIG[resource.type];
                                const Icon = config.icon;
                                return (
                                    <motion.div
                                        key={resource.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        whileHover={{ y: -6 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
                                    >
                                        <div className={`h-2 bg-gradient-to-r ${config.color}`} />
                                        <div className="p-7">
                                            <div className="flex items-start justify-between mb-5">
                                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.color} text-white shadow-lg`}>
                                                    <Icon className="w-10 h-10" />
                                                </div>
                                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => openModal(resource)} className="p-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl">
                                                        <Edit2 className="w-5 h-5 text-indigo-600" />
                                                    </button>
                                                    <button onClick={() => deleteResource(resource.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl">
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                                {resource.title}
                                            </h3>

                                            {resource.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {resource.tags.map(tag => (
                                                        <span key={tag} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {resource.url && (
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium inline-flex items-center gap-1 mb-4">
                                                    <Link2 className="w-4 h-4" /> Mở link
                                                </a>
                                            )}

                                            {/* Progress */}
                                            <div className="mt-6">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-600 dark:text-gray-400">Tiến độ</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{resource.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${resource.progress}%` }}
                                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                                        className={`h-full bg-gradient-to-r ${config.color}`}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-4">
                                                    {[0, 25, 50, 75, 100].map(val => (
                                                        <button
                                                            key={val}
                                                            onClick={() => updateProgress(resource.id, val)}
                                                            className={`text-xs px-3 py-2 rounded-xl transition font-medium ${resource.progress === val
                                                                ? "bg-gray-800 text-white dark:bg-white dark:text-gray-800"
                                                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                }`}
                                                        >
                                                            {val === 100 ? "Hoàn thành" : `${val}%`}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {resource.notes && (
                                                <p className="mt-5 text-gray-600 dark:text-gray-400 italic text-sm leading-relaxed">
                                                    “{resource.notes}”
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Floating Button */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center text-white z-10"
                >
                    <Plus className="w-10 h-10" />
                </motion.button>

                {/* Modal – ĐỒNG BỘ CHUẨN */}
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
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {editingRes ? "Sửa tài nguyên" : "Thêm tài nguyên mới"}
                                    </h2>
                                    <button onClick={closeModal} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="Tên khóa học, sách, video..."
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none text-xl font-medium"
                                        autoFocus
                                    />

                                    <div className="grid grid-cols-2 gap-6">
                                        <select
                                            value={form.type}
                                            onChange={e => setForm({ ...form, type: e.target.value })}
                                            className="px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 text-lg font-medium"
                                        >
                                            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                                                <option key={key} value={key}>{cfg.label}</option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="0" max="100" step="25"
                                                value={form.progress}
                                                onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
                                                className="flex-1 h-3 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
                                            />
                                            <span className="text-3xl font-bold text-indigo-600 w-20 text-right">{form.progress}%</span>
                                        </div>
                                    </div>

                                    <input
                                        type="url"
                                        placeholder="Link (nếu có)"
                                        value={form.url}
                                        onChange={e => setForm({ ...form, url: e.target.value })}
                                        className="w-full px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Tag (cách nhau bằng dấu phẩy)"
                                        value={form.tags}
                                        onChange={e => setForm({ ...form, tags: e.target.value })}
                                        className="w-full px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500"
                                    />

                                    <textarea
                                        rows={4}
                                        placeholder="Ghi chú, cảm nhận..."
                                        value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        className="w-full px-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 resize-none"
                                    />

                                    <div className="flex gap-4 justify-end pt-6">
                                        <button onClick={closeModal} className="px-8 py-4 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold transition">
                                            Hủy
                                        </button>
                                        <button onClick={saveResource} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl transition">
                                            {editingRes ? "Cập nhật" : "Thêm ngay"}
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