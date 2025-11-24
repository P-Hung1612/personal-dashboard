// src/pages/Learning/Resources.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, BookOpen, Video, Link2, FileText, Edit2, Trash2,
    CheckCircle2, Circle, Tag, X, Sparkles
} from "lucide-react";

const TYPES = {
    COURSE: "course",
    BOOK: "book",
    VIDEO: "video",
    ARTICLE: "article",
    OTHER: "other"
};

const TYPE_CONFIG = {
    [TYPES.COURSE]: { icon: Video, color: "from-purple-500 to-pink-500", label: "Khóa học" },
    [TYPES.BOOK]: { icon: BookOpen, color: "from-amber-500 to-orange-500", label: "Sách" },
    [TYPES.VIDEO]: { icon: Video, color: "from-red-500 to-rose-500", label: "Video" },
    [TYPES.ARTICLE]: { icon: FileText, color: "from-blue-500 to-cyan-500", label: "Bài viết" },
    [TYPES.OTHER]: { icon: Link2, color: "from-gray-500 to-slate-500", label: "Khác" },
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

    // Load & Save
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-learning");
        if (saved) setResources(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("lifeos-learning", JSON.stringify(resources));
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
                notes: res.notes
            });
        } else {
            setForm({ title: "", type: TYPES.COURSE, url: "", tags: "", progress: 0, notes: "" });
        }
        setIsModalOpen(true);
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
        setIsModalOpen(false);
    };

    const deleteResource = (id) => setResources(resources.filter(r => r.id !== id));

    const updateProgress = (id, progress) => {
        setResources(resources.map(r => r.id === id ? { ...r, progress } : r));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
            <div className="max-w-7xl mx-auto p-6 lg:p-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-6">
                        <Sparkles className="w-16 h-16 text-yellow-500" />
                        Kho Tài Nguyên Học Tập
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">
                        {resources.length} tài liệu • Đang học {resources.filter(r => r.progress > 0 && r.progress < 100).length}
                    </p>
                </motion.div>

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài nguyên..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 text-xl rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur border-2 border-transparent focus:border-indigo-500 focus:outline-none shadow-lg"
                        />
                    </div>

                    <select
                        value={filterTag}
                        onChange={e => setFilterTag(e.target.value)}
                        className="px-8 py-5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg font-medium"
                    >
                        <option value="all">Tất cả tag</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>#{tag}</option>
                        ))}
                    </select>
                </div>

                {/* Resources Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map(resource => {
                            const config = TYPE_CONFIG[resource.type];
                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={resource.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -10 }}
                                    className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                                >
                                    <div className={`h-3 bg-gradient-to-r ${config.color}`} />

                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.color} text-white shadow-lg`}>
                                                <Icon className="w-10 h-10" />
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => openModal(resource)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => deleteResource(resource.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl">
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                            {resource.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {resource.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                                    #{tag}
                                                </span>))}
                                        </div>

                                        {resource.url && (
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-4 inline-block">
                                                <Link2 className="w-4 h-4 inline mr-1" />
                                                Mở link
                                            </a>
                                        )}

                                        {/* Progress */}
                                        <div className="mt-6">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Tiến độ</span>
                                                <span className="font-bold">{resource.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${resource.progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full bg-gradient-to-r ${config.color}`}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-3">
                                                {[0, 25, 50, 75, 100].map(val => (
                                                    <button
                                                        key={val}
                                                        onClick={() => updateProgress(resource.id, val)}
                                                        className={`text-xs px-3 py-1 rounded-full transition ${resource.progress === val
                                                                ? "bg-gray-800 text-white dark:bg-white dark:text-gray-800"
                                                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                                            }`}
                                                    >
                                                        {val === 100 ? "Hoàn thành" : `${val}%`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {resource.notes && (
                                            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm italic">
                                                “{resource.notes}”
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-48 h-48 mx-auto mb-8" />
                        <p className="text-3xl text-gray-600 dark:text-gray-400">
                            {resources.length === 0 ? "Chưa có tài nguyên nào" : "Không tìm thấy"}
                        </p>
                    </div>
                )}

                {/* Add Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-10"
                >
                    <Plus className="w-8 h-8" />
                </motion.button>

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
                            onClick={() => setIsModalOpen(false)}>
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
                                <h2 className="text-4xl font-bold mb-8 text-center">
                                    {editingRes ? "Sửa tài nguyên" : "Thêm tài nguyên mới"}
                                </h2>

                                <div className="space-y-6">
                                    <input type="text" placeholder="Tên khóa học / sách / video..." value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500 focus:outline-none" autoFocus />

                                    <div className="grid grid-cols-2 gap-6">
                                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                            className="px-6 py-5 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500">
                                            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                                                <option key={key} value={key}>{cfg.label}</option>
                                            ))}
                                        </select>
                                        <input type="range" min="0" max="100" value={form.progress}
                                            onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
                                            className="py-5" />
                                        <span className="text-center text-2xl font-bold">{form.progress}%</span>
                                    </div>

                                    <input type="url" placeholder="Link (nếu có)" value={form.url}
                                        onChange={e => setForm({ ...form, url: e.target.value })}
                                        className="w-full px-6 py-5 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500" />

                                    <input type="text" placeholder="Tag (cách nhau bằng dấu phẩy)" value={form.tags}
                                        onChange={e => setForm({ ...form, tags: e.target.value })}
                                        className="w-full px-6 py-5 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500" />

                                    <textarea rows={4} placeholder="Ghi chú, cảm nhận..." value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        className="w-full px-6 py-5 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 focus:border-indigo-500 resize-none" />

                                    <div className="flex gap-6 justify-center pt-6">
                                        <button onClick={() => setIsModalOpen(false)}
                                            className="px-10 py-5 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 font-medium text-lg">
                                            Hủy
                                        </button>
                                        <button onClick={saveResource}
                                            className="px-12 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl">
                                            {editingRes ? "Cập nhật" : "Thêm ngay"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}