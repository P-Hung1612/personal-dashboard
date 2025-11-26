// src/pages/Life/Relationship.jsx
// ĐÃ ĐỒNG BỘ 100% VỚI PHONG CÁCH OVERVIEW – ĐẸP NHƯ APP TRIỆU ĐÔ
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays, parseISO } from "date-fns";
import {
    Heart, Gift, CalendarHeart, MessageCircle, Sparkles,
    Plus, Edit2, Trash2, Cake, Clock, X, Calendar
} from "lucide-react";

const LOVE_LANGUAGES = [
    { name: "Words of Affirmation", icon: MessageCircle, color: "from-pink-400 to-rose-500" },
    { name: "Acts of Service", icon: Sparkles, color: "from-amber-400 to-orange-500" },
    { name: "Receiving Gifts", icon: Gift, color: "from-purple-400 to-indigo-500" },
    { name: "Quality Time", icon: Clock, color: "from-emerald-400 to-teal-500" },
    { name: "Physical Touch", icon: Heart, color: "from-red-400 to-pink-500" },
];

export default function Relationship() {
    const [people, setPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);
    const [quickLove, setQuickLove] = useState("");

    const [form, setForm] = useState({
        name: "", relationship: "", anniversary: "", birthday: "",
        loveLanguage: LOVE_LANGUAGES[0].name, notes: ""
    });

    // Load & Save
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-relationship");
            if (saved) {
                const data = JSON.parse(saved);
                setPeople(data);
                if (data.length > 0 && !selectedPerson) setSelectedPerson(data[0]);
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        localStorage.setItem("lifeos-relationship", JSON.stringify(people));
    }, [people]);

    const openModal = (person = null) => {
        setEditingPerson(person);
        setForm(person ? { ...person } : {
            name: "", relationship: "", anniversary: "", birthday: "",
            loveLanguage: LOVE_LANGUAGES[0].name, notes: ""
        });
        setIsModalOpen(true);
    };

    const savePerson = () => {
        if (!form.name.trim()) return;
        const newPerson = editingPerson
            ? { ...editingPerson, ...form }
            : { id: Date.now(), createdAt: new Date().toISOString(), memories: [], ...form };

        setPeople(prev => editingPerson
            ? prev.map(p => p.id === editingPerson.id ? newPerson : p)
            : [...prev, newPerson]
        );
        if (!editingPerson) setSelectedPerson(newPerson);
        setIsModalOpen(false);
    };

    const deletePerson = (id) => {
        setPeople(prev => prev.filter(p => p.id !== id));
        if (selectedPerson?.id === id) {
            const remaining = people.filter(p => p.id !== id);
            setSelectedPerson(remaining[0] || null);
        }
    };

    const addMemory = () => {
        const text = prompt(`Hôm nay có điều gì đặc biệt với ${selectedPerson.name} không?`);
        if (!text?.trim()) return;
        const newMem = { text: text.trim(), date: new Date().toISOString() };
        setPeople(prev => prev.map(p => p.id === selectedPerson.id ? { ...p, memories: [...(p.memories || []), newMem] } : p));
        setSelectedPerson(prev => ({ ...prev, memories: [...(prev.memories || []), newMem] }));
    };

    const sendQuickLove = (type) => {
        setQuickLove(type);
        setTimeout(() => setQuickLove(""), 3000);
    };

    // Tính toán
    const daysTogether = selectedPerson?.anniversary
        ? differenceInDays(new Date(), parseISO(selectedPerson.anniversary))
        : null;

    const nextBirthdayDays = selectedPerson?.birthday
        ? (() => {
            const bd = parseISO(selectedPerson.birthday);
            const thisYear = new Date(new Date().getFullYear(), bd.getMonth(), bd.getDate());
            const next = thisYear <= new Date()
                ? new Date(new Date().getFullYear() + 1, bd.getMonth(), bd.getDate())
                : thisYear;
            return differenceInDays(next, new Date());
        })()
        : null;

    const loveLang = LOVE_LANGUAGES.find(l => l.name === selectedPerson?.loveLanguage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
            {/* EMPTY STATE – ĐẸP NHƯ OVERVIEW */}
            {people.length === 0 && (
                <div className="flex items-center justify-center min-h-screen p-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl">
                        <Heart className="w-32 h-32 mx-auto mb-8 text-pink-500 fill-pink-500 animate-pulse" />
                        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                            Trái tim đang chờ người đặc biệt
                        </h1>
                        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-12">
                            Thêm người bạn yêu thương để nuôi dưỡng mối quan hệ mỗi ngày
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => openModal()}
                            className="px-12 py-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-2xl font-semibold rounded-2xl shadow-xl flex items-center gap-4 mx-auto"
                        >
                            <Plus className="w-10 h-10" /> Thêm người yêu thương
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* MAIN CONTENT – ĐỒNG BỘ HOÀN TOÀN VỚI OVERVIEW */}
            {people.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Relationship Hub
                        </h1>
                        <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mt-4">
                            Nơi lưu giữ và nuôi dưỡng những điều đẹp đẽ nhất
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                        Trái tim
                                    </h2>
                                    <motion.button
                                        whileHover={{ rotate: 90 }} whileTap={{ scale: 0.8 }}
                                        onClick={() => openModal()}
                                        className="p-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl shadow-lg"
                                    >
                                        <Plus className="w-8 h-8" />
                                    </motion.button>
                                </div>
                                <div className="space-y-4">
                                    {people.map(p => (
                                        <motion.div
                                            key={p.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setSelectedPerson(p)}
                                            className={`p-6 rounded-2xl cursor-pointer transition-all ${selectedPerson?.id === p.id
                                                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl ring-4 ring-pink-300"
                                                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-2xl font-bold">{p.name}</p>
                                                    <p className="text-lg opacity-90">{p.relationship}</p>
                                                </div>
                                                <Heart className={`w-10 h-10 ${selectedPerson?.id === p.id ? "fill-white" : ""}`} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Area */}
                        {selectedPerson && (
                            <div className="lg:col-span-3 space-y-10">
                                {/* Profile Card */}
                                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-white/20">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                                {selectedPerson.name}
                                            </h2>
                                            <p className="text-3xl text-pink-600 mt-3">{selectedPerson.relationship}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => openModal(selectedPerson)} className="p-4 bg-gray-200/50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                                                <Edit2 className="w-8 h-8" />
                                            </button>
                                            <button onClick={() => deletePerson(selectedPerson.id)} className="p-4 bg-red-100 dark:bg-red-900/50 rounded-2xl hover:bg-red-200 transition">
                                                <Trash2 className="w-8 h-8 text-red-600" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {daysTogether !== null && (
                                            <div className="text-center">
                                                <CalendarHeart className="w-20 h-20 text-pink-600 mx-auto mb-4" />
                                                <p className="text-5xl font-bold text-pink-600">{daysTogether}</p>
                                                <p className="text-xl text-gray-600">Ngày bên nhau</p>
                                            </div>
                                        )}
                                        {nextBirthdayDays !== null && (
                                            <div className="text-center">
                                                <Cake className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                                                <p className="text-5xl font-bold text-purple-600">{nextBirthdayDays}</p>
                                                <p className="text-xl text-gray-600">Ngày nữa là sinh nhật</p>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <div className={`w-28 h-28 mx-auto bg-gradient-to-br ${loveLang?.color} rounded-full flex items-center justify-center shadow-xl`}>
                                                {loveLang && <loveLang.icon className="w-14 h-14 text-white" />}
                                            </div>
                                            <p className="text-2xl font-bold mt-6">{selectedPerson.loveLanguage}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Love */}
                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl shadow-xl p-10 text-white text-center">
                                    <h3 className="text-4xl md:text-5xl font-bold mb-10">Gửi yêu thương ngay!</h3>
                                    <div className="grid grid-cols-5 gap-6 max-w-2xl mx-auto">
                                        {[
                                            { type: "Ôm", emoji: "🤗" },
                                            { type: "Hôn", emoji: "😘" },
                                            { type: "Yêu", emoji: "❤️" },
                                            { type: "Nhớ", emoji: "😔" },
                                            { type: "Nghĩ về", emoji: "🤔" }
                                        ].map(({ type, emoji }) => (
                                            <motion.button
                                                key={type}
                                                whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}
                                                onClick={() => sendQuickLove(type)}
                                                className="text-5xl"
                                                title={type}
                                            >
                                                {emoji}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Memories */}
                                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-white/20">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                            Kỷ niệm đẹp
                                        </h3>
                                        <motion.button whileHover={{ scale: 1.1 }} onClick={addMemory}
                                            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg"
                                        >
                                            <Plus className="w-7 h-7" /> Thêm kỷ niệm
                                        </motion.button>
                                    </div>
                                    <div className="space-y-6">
                                        {(selectedPerson.memories || []).slice(-8).reverse().map((m, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl"
                                            >
                                                <p className="text-2xl italic leading-relaxed">"{m.text}"</p>
                                                <p className="text-right text-gray-600 mt-3">
                                                    {format(parseISO(m.date), "dd/MM/yyyy")}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toast */}
            <AnimatePresence>
                {quickLove && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/90 text-white px-12 py-8 rounded-full text-4xl font-bold backdrop-blur z-50 shadow-2xl"
                    >
                        Đã gửi {quickLove} đến {selectedPerson?.name}!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal – ĐẸP NHƯ CÁC TRANG KHÁC */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 z-[9999]"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full max-h-screen overflow-y-auto"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                                <X className="w-8 h-8" />
                            </button>
                            <h2 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                {editingPerson ? "Chỉnh sửa" : "Thêm người đặc biệt"}
                            </h2>
                            <div className="space-y-6">
                                <input type="text" placeholder="Tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700 focus:ring-4 focus:ring-pink-400 outline-none" />
                                <input type="text" placeholder="Mối quan hệ" value={form.relationship || ""} onChange={e => setForm({ ...form, relationship: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700 focus:ring-4 focus:ring-pink-400 outline-none" />
                                <div className="relative">
                                    <input type="date" id="anniversary" value={form.anniversary}
                                        onChange={e => setForm({ ...form, anniversary: e.target.value })}
                                        className="peer w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700 focus:ring-4 focus:ring-pink-400 outline-none pt-8" />
                                    <label htmlFor="anniversary" className={`absolute left-6 transition-all duration-200 pointer-events-none text-gray-500
      peer-focus:text-pink-500 peer-focus:text-lg peer-focus:-top-1
      ${form.anniversary ? 'text-pink-500 text-lg -top-1' : 'top-5 text-2xl'}`}>
                                        Ngày kỷ niệm
                                    </label>
                                </div>
                                <div className="relative">
                                    <input type="text" id="birthday" value={form.birthday}
                                        onChange={e => setForm({ ...form, birthday: e.target.value })}
                                        className="peer w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700 focus:ring-4 focus:ring-pink-400 outline-none pt-8" />
                                    <label htmlFor="birthday" className={`absolute left-6 transition-all duration-200 pointer-events-none text-gray-500
      peer-focus:text-pink-500 peer-focus:text-lg peer-focus:-top-1
      ${form.birthday ? 'text-pink-500 text-lg -top-1' : 'top-5 text-2xl'}`}>
                                        Sinh nhật
                                    </label>
                                </div>
                                <select value={form.loveLanguage} onChange={e => setForm({ ...form, loveLanguage: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700">
                                    {LOVE_LANGUAGES.map(l => <option key={l.name}>{l.name}</option>)}
                                </select>
                                <textarea placeholder="Ghi chú..." value={form.notes} rows={4} onChange={e => setForm({ ...form, notes: e.target.value })}
                                    className="w-full px-6 py-5 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700 resize-none focus:ring-4 focus:ring-pink-400 outline-none" />
                            </div>
                            <div className="flex justify-center gap-6 mt-10">
                                <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 text-xl font-bold bg-gray-200 dark:bg-gray-700 rounded-2xl">
                                    Hủy
                                </button>
                                <button onClick={savePerson} className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl shadow-xl">
                                    {editingPerson ? "Cập nhật" : "Thêm vào trái tim"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}