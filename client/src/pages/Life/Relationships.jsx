// src/pages/Life/Relationship.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import {
    Heart, Gift, CalendarHeart, MessageCircle, Sparkles,
    Users, Plus, Edit2, Trash2, Cake, Clock
} from "lucide-react";

const LOVE_LANGUAGES = [
    { name: "Words of Affirmation", icon: MessageCircle, color: "from-pink-500 to-rose-500" },
    { name: "Acts of Service", icon: Sparkles, color: "from-yellow-500 to-orange-500" },
    { name: "Receiving Gifts", icon: Gift, color: "from-purple-500 to-indigo-500" },
    { name: "Quality Time", icon: Clock, color: "from-green-500 to-emerald-500" },
    { name: "Physical Touch", icon: Heart, color: "from-red-500 to-pink-600" },
];

export default function Relationship() {
    const [people, setPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);
    const [quickLove, setQuickLove] = useState(false);

    const [form, setForm] = useState({
        name: "", relationship: "Người yêu", anniversary: "", birthday: "",
        loveLanguage: LOVE_LANGUAGES[0].name,
        notes: "", gifts: [], memories: []
    });

    // Load
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-relationship");
        if (saved) {
            const data = JSON.parse(saved);
            setPeople(data);
            if (data.length > 0 && !selectedPerson) setSelectedPerson(data[0]);
        }
    }, []);

    // Save
    useEffect(() => {
        localStorage.setItem("lifeos-relationship", JSON.stringify(people));
    }, [people]);

    const openModal = (person = null) => {
        setEditingPerson(person);
        if (person) {
            setForm({
                name: person.name,
                relationship: person.relationship,
                anniversary: person.anniversary || "",
                birthday: person.birthday || "",
                loveLanguage: person.loveLanguage,
                notes: person.notes || "",
                gifts: person.gifts || [],
                memories: person.memories || []
            });
        } else {
            setForm({
                name: "", relationship: "Người yêu", anniversary: "", birthday: "",
                loveLanguage: LOVE_LANGUAGES[0].name, notes: "", gifts: [], memories: []
            });
        }
        setIsModalOpen(true);
    };

    const savePerson = () => {
        if (!form.name) return;

        const newPerson = editingPerson
            ? { ...editingPerson, ...form }
            : { id: Date.now(), ...form, createdAt: new Date().toISOString() };

        setPeople(prev =>
            editingPerson
                ? prev.map(p => p.id === editingPerson.id ? newPerson : p)
                : [...prev, newPerson]
        );

        if (!editingPerson) setSelectedPerson(newPerson);
        setIsModalOpen(false);
    };

    const deletePerson = (id) => {
        setPeople(prev => prev.filter(p => p.id !== id));
        if (selectedPerson?.id === id) {
            setSelectedPerson(people.find(p => p.id !== id) || null);
        }
    };

    const addMemory = () => {
        const memory = prompt("Kỷ niệm hôm nay là gì?");
        if (memory) {
            setPeople(prev => prev.map(p =>
                p.id === selectedPerson.id
                    ? { ...p, memories: [...p.memories, { text: memory, date: new Date().toISOString() }] }
                    : p
            ));
            setSelectedPerson(prev => ({ ...prev, memories: [...prev.memories, { text: memory, date: new Date().toISOString() }] }));
        }
    };

    const sendQuickLove = (type) => {
        setQuickLove(type);
        setTimeout(() => setQuickLove(false), 2000);
    };

    if (!selectedPerson && people.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:to-pink-900 flex items-center justify-center">
                <div className="text-center">
                    <Heart className="w-32 h-32 text-pink-500 mx-auto mb-8" />
                    <p className="text-5xl font-bold text-gray-800 dark:text-white mb-8">Chưa có ai trong trái tim</p>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => openModal()}
                        className="px-12 py-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full text-2xl font-bold shadow-2xl flex items-center gap-4 mx-auto">
                        <Plus className="w-10 h-10" /> Thêm người đặc biệt
                    </motion.button>
                </div>
            </div>
        );
    }

    const daysTogether = selectedPerson?.anniversary
        ? differenceInDays(new Date(), new Date(selectedPerson.anniversary))
        : 0;

    const nextBirthday = selectedPerson?.birthday
        ? differenceInDays(new Date(new Date().getFullYear() + 1, new Date(selectedPerson.birthday).getMonth(), new Date(selectedPerson.birthday).getDate()), new Date())
        : null;

    const loveLang = LOVE_LANGUAGES.find(l => l.name === selectedPerson?.loveLanguage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:to-pink-900">
            <div className="max-w-7xl mx-auto p-6 lg:p-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-6">
                        <Heart className="w-16 h-16 text-pink-600" />
                        Relationship Hub
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">Nuôi dưỡng những điều đẹp đẽ nhất</p>
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar - Danh sách người */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-3xl shadow-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold">Trái tim tôi</h2>
                                <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => openModal()}
                                    className="p-3 bg-pink-600 text-white rounded-xl shadow-xl">
                                    <Plus className="w-6 h-6" />
                                </motion.button>
                            </div>

                            <div className="space-y-4">
                                {people.map(person => (
                                    <motion.div
                                        key={person.id}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedPerson(person)}
                                        className={`p-6 rounded-2xl cursor-pointer transition-all ${selectedPerson?.id === person.id ? "bg-pink-100 dark:bg-pink-900/50 ring-4 ring-pink-500" : "bg-gray-50 dark:bg-gray-700"}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold">{person.name}</p>
                                                <p className="text-lg text-gray-600 dark:text-gray-400">{person.relationship}</p>
                                            </div>
                                            <Heart className={`w-8 h-8 ${selectedPerson?.id === person.id ? "fill-pink-600 text-pink-600" : "text-gray-400"}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    {selectedPerson && (
                        <div className="lg:col-span-3 space-y-8">
                            {/* Profile Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-6xl font-bold">{selectedPerson.name}</h2>
                                        <p className="text-3xl text-pink-600 mt-2">{selectedPerson.relationship}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => openModal(selectedPerson)} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"><Edit2 className="w-8 h-8" /></button>
                                        <button onClick={() => deletePerson(selectedPerson.id)} className="p-4 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"><Trash2 className="w-8 h-8 text-red-600" /></button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <CalendarHeart className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                                        <p className="text-5xl font-bold">{daysTogether}</p>
                                        <p className="text-xl text-gray-600">Ngày bên nhau</p>
                                    </div>
                                    {selectedPerson.birthday && (
                                        <div className="text-center">
                                            <Cake className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                                            <p className="text-5xl font-bold">{nextBirthday}</p>
                                            <p className="text-xl text-gray-600">Ngày nữa là sinh nhật</p>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${loveLang?.color} rounded-full flex items-center justify-center`}>
                                            <loveLang.icon className="w-12 h-12 text-white" />
                                        </div>
                                        <p className="text-xl mt-4 font-medium">Love Language</p>
                                        <p className="text-2xl font-bold">{selectedPerson.loveLanguage}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Love Buttons */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                                <h3 className="text-4xl font-bold text-center mb-8">Gửi yêu thương ngay!</h3>
                                <div className="grid grid-cols-5 gap-6">
                                    {["Hug", "Kiss", "I Love You", "Miss You", "Thinking of You"].map((action, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                            onClick={() => sendQuickLove(action)}
                                            className="text-6xl"
                                        >
                                            {i === 0 && "Hugging Face"}
                                            {i === 1 && "Kissing Heart"}
                                            {i === 2 && "Red Heart"}
                                            {i === 3 && "Pensive Face"}
                                            {i === 4 && "Thinking Face"}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Memories */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-4xl font-bold">Kỷ niệm đẹp</h3>
                                    <motion.button whileHover={{ scale: 1.1 }} onClick={addMemory}
                                        className="px-8 py-4 bg-pink-600 text-white rounded-2xl font-bold flex items-center gap-3">
                                        <Plus className="w-6 h-6" /> Thêm kỷ niệm
                                    </motion.button>
                                </div>
                                <div className="space-y-6">
                                    {selectedPerson.memories?.slice(-5).reverse().map((m, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                                            className="p-6 bg-pink-50 dark:bg-pink-900/30 rounded-2xl">
                                            <p className="text-2xl italic">"{m.text}"</p>
                                            <p className="text-right text-gray-600 mt-2">{format(new Date(m.date), "dd/MM/yyyy")}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Love Toast */}
            <AnimatePresence>
                {quickLove && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-12 py-8 rounded-full text-4xl font-bold backdrop-blur z-50">
                        Đã gửi {quickLove} đến {selectedPerson?.name}!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full max-h-screen overflow-y-auto">
                            <h2 className="text-4xl font-bold text-center mb-8">
                                {editingPerson ? "Chỉnh sửa" : "Thêm người đặc biệt"}
                            </h2>
                            {/* Form nội dung giống các trang trước, mình rút gọn để không quá dài */}
                            <div className="space-y-6">
                                <input type="text" placeholder="Tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700" />
                                <input type="text" placeholder="Mối quan hệ (Người yêu, Vợ/Chồng, Bạn thân...)" value={form.relationship}
                                    onChange={e => setForm({ ...form, relationship: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700" />
                                <input type="date" placeholder="Ngày kỷ niệm" value={form.anniversary}
                                    onChange={e => setForm({ ...form, anniversary: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700" />
                                <input type="date" placeholder="Sinh nhật" value={form.birthday}
                                    onChange={e => setForm({ ...form, birthday: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700" />
                                <select value={form.loveLanguage} onChange={e => setForm({ ...form, loveLanguage: e.target.value })}
                                    className="w-full px-6 py-5 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-700">
                                    {LOVE_LANGUAGES.map(l => <option key={l.name}>{l.name}</option>)}
                                </select>
                                <textarea placeholder="Ghi chú yêu thương..." value={form.notes} rows={4}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                    className="w-full px-6 py-5 text-xl rounded-2xl bg-gray-100 dark:bg-gray-700 resize-none" />
                            </div>
                            <div className="flex gap-6 justify-center mt-10">
                                <button onClick={() => setIsModalOpen(false)}
                                    className="px-12 py-5 rounded-2xl bg-gray-300 dark:bg-gray-700 font-bold text-xl">Hủy</button>
                                <button onClick={savePerson}
                                    className="px-14 py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xl shadow-xl">
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