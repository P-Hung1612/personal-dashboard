// src/pages/Notes/Editor.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, FileText, Trash2, GripVertical, ChevronDown,
    ChevronRight, Bold, Italic, List, ListOrdered, Code, Quote
} from "lucide-react";

const BLOCK_TYPES = {
    text: { icon: FileText, label: "Text", placeholder: "Nhập nội dung..." },
    h1: { icon: Bold, label: "Heading 1", prefix: "# " },
    h2: { icon: Bold, label: "Heading 2", prefix: "## " },
    h3: { icon: Bold, label: "Heading 3", prefix: "### " },
    todo: { icon: List, label: "To-do", prefix: "- [ ] " },
    bullet: { icon: List, label: "Bullet", prefix: "- " },
    numbered: { icon: ListOrdered, label: "Numbered", prefix: "1. " },
    quote: { icon: Quote, label: "Quote", prefix: "> " },
    code: { icon: Code, label: "Code", prefix: "```" },
};

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState({});

    // Load notes
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-notes");
        if (saved) {
            const parsed = JSON.parse(saved);
            setNotes(parsed);
            if (parsed.length > 0 && !currentNoteId) {
                setCurrentNoteId(parsed[0].id);
            }
        } else {
            // Tạo note mặc định
            createNewNote();
        }
    }, []);

    // Auto save
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem("lifeos-notes", JSON.stringify(notes));
        }
    }, [notes]);

    const currentNote = notes.find(n => n.id === currentNoteId);

    const createNewNote = () => {
        const newNote = {
            id: Date.now(),
            title: "Untitled Note",
            blocks: [{ id: Date.now(), type: "text", content: "" }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes(prev => [...prev, newNote]);
        setCurrentNoteId(newNote.id);
    };

    const updateNoteTitle = (id, title) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, title, updatedAt: new Date().toISOString() } : n));
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
                    : n.blocks.flatMap(b => b.id === afterId ? [b, newBlock] : b);
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
                return { ...n, blocks: blocks.length === 0 ? [{ id: Date.now(), type: "text", content: "" }] : blocks };
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
                        const content = b.content.replace(/^[#>-]\s*|\[.\]\s*|\d+\.\s*|```/g, "");
                        return { ...b, type, content: prefix + content };
                    }
                    return b;
                });
                return { ...n, blocks };
            }
            return n;
        }));
    };

    // Drag & Drop
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

    if (!currentNote) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:to-teal-900 flex">
            {/* Sidebar */}
            <div className="w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Notes</h1>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={createNewNote}
                        className="p-3 bg-teal-600 hover:bg-te020 rounded-xl text-white shadow-lg">
                        <Plus className="w-6 h-6" />
                    </motion.button>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text" placeholder="Tìm kiếm note..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 focus:ring-4 focus:ring-teal-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredNotes.map(note => (
                            <motion.div
                                key={note.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={() => setCurrentNoteId(note.id)}
                                className={`p-5 rounded-2xl cursor-pointer transition-all group ${currentNoteId === note.id
                                        ? "bg-teal-100 dark:bg-teal-900/50 ring-4 ring-teal-500"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{note.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(note.updatedAt).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={currentNote.title}
                        onChange={e => updateNoteTitle(currentNote.id, e.target.value)}
                        placeholder="Untitled Note"
                        className="w-full text-5xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-400"
                    />

                    <div className="mt-12 space-y-4">
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
                                    className="group relative"
                                >
                                    <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition flex items-center gap-2 -ml-12">
                                        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                        <button onClick={() => setIsMenuOpen(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                                            {isMenuOpen[block.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {isMenuOpen[block.id] && (
                                        <div className="absolute left-0 top-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-3 z-10 grid grid-cols-3 gap-3">
                                            {Object.entries(BLOCK_TYPES).map(([key, config]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => { changeBlockType(currentNote.id, block.id, key); setIsMenuOpen({}); }}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <config.icon className="w-5 h-5" />
                                                    <span className="text-sm">{config.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
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
                                                className="mt-2 w-6 h-6"
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
                                                if (e.key === "Backspace" && !block.content) {
                                                    e.preventDefault();
                                                    deleteBlock(currentNote.id, block.id);
                                                }
                                            }}
                                            placeholder={BLOCK_TYPES[block.type]?.placeholder || "Nhập nội dung..."}
                                            className={`flex-1 min-h-12 text-xl bg-transparent border-none outline-none resize-none ${block.type === "h1" ? "text-4xl font-bold" :
                                                    block.type === "h2" ? "text-3xl font-bold" :
                                                        block.type === "h3" ? "text-2xl font-bold" :
                                                            block.type === "quote" ? "pl-8 border-l-4 border-teal-500 italic" :
                                                                block.type === "code" ? "font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg" :
                                                                    block.type === "todo" && block.content.includes("[x]") ? "line-through text-gray-500" :
                                                                        ""
                                                } text-gray-800 dark:text-white`}
                                            rows={1}
                                            autoFocus={index === currentNote.blocks.length - 1 && !block.content}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => addBlock(currentNote.id)}
                            className="mt-8 px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium flex items-center gap-3"
                        >
                            <Plus className="w-5 h-5" /> Thêm block
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}