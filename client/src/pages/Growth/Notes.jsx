// src/pages/Notes/Editor.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI CHUẨN OVERVIEW.JSX → ĐẸP NHƯ NOTION PRO
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, FileText, Trash2, GripVertical,
    Bold, Italic, List, ListOrdered, Code, Quote, Sparkles
} from "lucide-react";

const BLOCK_TYPES = {
    text: { icon: FileText, label: "Text", placeholder: "Nhập nội dung..." },
    h1: { icon: Bold, label: "Tiêu đề 1", prefix: "# " },
    h2: { icon: Bold, label: "Tiêu đề 2", prefix: "## " },
    h3: { icon: Bold, label: "Tiêu đề 3", prefix: "### " },
    todo: { icon: List, label: "To-do", prefix: "- [ ] " },
    bullet: { icon: List, label: "Danh sách", prefix: "- " },
    numbered: { icon: ListOrdered, label: "Số thứ tự", prefix: "1. " },
    quote: { icon: Quote, label: "Trích dẫn", prefix: "> " },
    code: { icon: Code, label: "Code", prefix: "```" },
};

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState({});

    // Load & Auto-save
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-notes");
            if (saved) {
                const parsed = JSON.parse(saved);
                setNotes(parsed);
                if (parsed.length > 0 && !currentNoteId) setCurrentNoteId(parsed[0].id);
            } else {
                createNewNote();
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        if (notes.length > 0) {
            try {
                localStorage.setItem("lifeos-notes", JSON.stringify(notes));
            } catch (e) { console.error(e); }
        }
    }, [notes]);

    const currentNote = notes.find(n => n.id === currentNoteId);

    const createNewNote = () => {
        const newNote = {
            id: Date.now(),
            title: "Ghi chú mới",
            blocks: [{ id: Date.now(), type: "text", content: "" }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes(prev => [...prev, newNote]);
        setCurrentNoteId(newNote.id);
    };

    const updateNoteTitle = (id, title) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, title: title || "Ghi chú mới", updatedAt: new Date().toISOString() } : n));
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (currentNoteId === id) {
            const remaining = notes.filter(n => n.id !== id);
            setCurrentNoteId(remaining.length > 0 ? remaining[0].id : null);
        }
    };

    const addBlock = (noteId, afterId = null) => {
        const newBlock = { id: Date.now(), type: "text", content: "" };
        setNotes(prev => prev.map(n => {
            if (n.id === noteId) {
                const blocks = afterId === null
                    ? [...n.blocks, newBlock]
                    : n.blocks.flatMap(b => b.id === afterId ? [b, newBlock] : [b]);
                return { ...n, blocks, updatedAt: new Date().toISOString() };
            }
            return n;
        }));
    };

    const updateBlock = (noteId, blockId, content) => {
        setNotes(prev => prev.map(n => {
            if (n.id === noteId) {
                const blocks = n.blocks.map(b => b.id === blockId ? { ...b, content } : b);
                return { ...n, blocks, updatedAt: new Date().toISOString() };
            }
            return n;
        }));
    };

    const deleteBlock = (noteId, blockId) => {
        setNotes(prev => prev.map(n => {
            if (n.id === noteId) {
                const blocks = n.blocks.filter(b => b.id !== blockId);
                return {
                    ...n,
                    blocks: blocks.length === 0 ? [{ id: Date.now(), type: "text", content: "" }] : blocks
                };
            }
            return n;
        }));
    };

    const changeBlockType = (noteId, blockId, type) => {
        const prefix = BLOCK_TYPES[type]?.prefix || "";
        setNotes(prev => prev.map(n => {
            if (n.id === noteId) {
                const blocks = n.blocks.map(b => {
                    if (b.id === blockId) {
                        const clean = b.content.replace(/^[#>-]\s*|\[.\]\s*|\d+\.\s*|```/g, "");
                        return { ...b, type, content: prefix + clean };
                    }
                    return b;
                });
                return { ...n, blocks };
            }
            return n;
        }));
        setIsMenuOpen({});
    };

    const onDragEnd = (e, noteId) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        setNotes(prev => prev.map(n => {
            if (n.id === noteId) {
                const oldIndex = n.blocks.findIndex(b => b.id === active.id);
                const newIndex = n.blocks.findIndex(b => b.id === over.id);
                const blocks = [...n.blocks];
                const [moved] = blocks.splice(oldIndex, 1);
                blocks.splice(newIndex, 0, moved);
                return { ...n, blocks, updatedAt: new Date().toISOString() };
            }
            return n;
        }));
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.blocks.some(b => b.content.toLowerCase().includes(search.toLowerCase()))
    );

    if (!currentNote && notes.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50/50 to-blue-50/50 dark:from-gray-900 dark:to-teal-900/30">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createNewNote}
                    className="px-16 py-10 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-3xl font-bold rounded-3xl shadow-2xl flex items-center gap-6 hover:shadow-teal-500/50 transition-all"
                >
                    <Plus className="w-14 h-14" />
                    Tạo ghi chú đầu tiên
                </motion.button>
            </div>
        );
    }
    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-900 dark:via-cyan-900 dark:to-blue-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Ghi chú thông minh
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {notes.length} ghi chú • {currentNote?.blocks.length || 0} block
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Viết tự do, sắp xếp linh hoạt – như Notion, nhưng đẹp hơn và của riêng bạn.
                    </p>
                </div>
            </motion.div>

            <div className="flex h-screen bg-gradient-to-br from-teal-50/50 to-blue-50/50 dark:from-gray-900 dark:to-teal-900/30">
                {/* SIDEBAR */}
                <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-8 overflow-y-auto shadow-xl">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Tất cả ghi chú</h2>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={createNewNote}
                            className="p-4 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl shadow-xl text-white"
                        >
                            <Plus className="w-8 h-8" />
                        </motion.button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ghi chú..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-teal-500 focus:outline-none text-lg font-medium shadow-sm"
                        />
                    </div>

                    {/* Note List */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredNotes.map(note => (
                                <motion.div
                                    key={note.id}
                                    layout
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    onClick={() => setCurrentNoteId(note.id)}
                                    className={`p-6 rounded-2xl cursor-pointer transition-all group hover:shadow-lg ${currentNoteId === note.id
                                        ? "bg-teal-100 dark:bg-teal-900/50 ring-4 ring-teal-500 shadow-xl"
                                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                                {note.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(note.updatedAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                                                {note.blocks.find(b => b.content)?.content || "Trống"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* EDITOR */}
                <div className="flex-1 p-10 lg:p-16 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Title */}
                        <input
                            type="text"
                            value={currentNote.title}
                            onChange={e => updateNoteTitle(currentNote.id, e.target.value)}
                            placeholder="Tiêu đề ghi chú..."
                            className="w-full text-4xl lg:text-5xl font-extrabold bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-400"
                        />

                        {/* Blocks */}
                        <div className="space-y-6">
                            <AnimatePresence>
                                {currentNote.blocks.map((block, index) => (
                                    <motion.div
                                        key={block.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        draggable
                                        onDragEnd={(e) => onDragEnd(e, currentNote.id)}
                                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all p-6"
                                    >
                                        {/* Block Controls */}
                                        <div className="absolute left-0 top-6 opacity-0 group-hover:opacity-100 transition flex items-center gap-3 -ml-16">
                                            <GripVertical className="w-6 h-6 text-gray-400 cursor-grab active:cursor-grabbing" />
                                            <button
                                                onClick={() => setIsMenuOpen(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                                                className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
                                            >
                                                <Bold className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                            </button>
                                        </div>

                                        {/* Block Type Menu */}
                                        <AnimatePresence>
                                            {isMenuOpen[block.id] && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="absolute left-12 top-16 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 grid grid-cols-3 gap-3"
                                                >
                                                    {Object.entries(BLOCK_TYPES).map(([key, config]) => (
                                                        <button
                                                            key={key}
                                                            onClick={() => changeBlockType(currentNote.id, block.id, key)}
                                                            className="flex flex-col items-center gap-2 p-4 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-xl transition"
                                                        >
                                                            <config.icon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                                                            <span className="text-sm font-medium">{config.label}</span>
                                                        </button>
                                                    ))}
                                                    ))
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Block Content */}
                                        <div className="flex items-start gap-5">
                                            {block.type === "todo" && (
                                                <input
                                                    type="checkbox"
                                                    checked={block.content.includes("[x]")}
                                                    onChange={() => {
                                                        const newContent = block.content.includes("[ ] ")
                                                            ? block.content.replace("[ ] ", "[x] ")
                                                            : block.content.replace("[x] ", "[ ] ");
                                                        updateBlock(currentNote.id, block.id, newContent);
                                                    }}
                                                    className="mt-3 w-7 h-7 rounded-lg text-teal-600 focus:ring-teal-500"
                                                />
                                            )}

                                            <textarea
                                                value={block.content}
                                                onChange={e => updateBlock(currentNote.id, block.id, e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        addBlock(currentNote.id, block.id);
                                                    }
                                                    if (e.key === "Backspace" && !block.content && currentNote.blocks.length > 1) {
                                                        e.preventDefault();
                                                        deleteBlock(currentNote.id, block.id);
                                                    }
                                                }}
                                                placeholder={BLOCK_TYPES[block.type]?.placeholder || "Nhập nội dung..."}
                                                className={`flex-1 min-h-12 text-xl bg-transparent border-none outline-none resize-none font-medium leading-relaxed ${block.type === "h1" ? "text-5xl font-extrabold" :
                                                    block.type === "h2" ? "text-4xl font-bold" :
                                                        block.type === "h3" ? "text-3xl font-bold" :
                                                            block.type === "quote" ? "pl-10 border-l-4 border-teal-500 italic text-gray-600 dark:text-gray-400" :
                                                                block.type === "code" ? "font-mono text-sm bg-gray-100 dark:bg-gray-900 p-6 rounded-xl" :
                                                                    block.type === "todo" && block.content.includes("[x]") ? "line-through text-gray-500 dark:text-gray-600" :
                                                                        ""
                                                    } text-gray-800 dark:text-white placeholder-gray-400`}
                                                rows={1}
                                                autoFocus={index === currentNote.blocks.length - 1 && !block.content}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Add Block Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addBlock(currentNote.id)}
                                className="w-full py-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4"
                            >
                                <Plus className="w-8 h-8" /> Thêm block mới
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}