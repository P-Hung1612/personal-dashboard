// src/pages/Life/Finance.jsx – HOÀN CHỈNH, COPY-PASTE LÀ CHẠY!
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Wallet, TrendingUp, TrendingDown, PiggyBank,
    X, Edit2, Trash2, CreditCard, DollarSign, Coffee, Car, ShoppingBag, Gamepad2, Receipt, MoreHorizontal
} from "lucide-react";

const CATEGORIES = {
    income: [
        { name: "Lương", icon: DollarSign, color: "text-green-600" },
        { name: "Freelance", icon: Wallet, color: "text-blue-600" },
        { name: "Thưởng", icon: PiggyBank, color: "text-yellow-600" },
        { name: "Khác", icon: DollarSign, color: "text-gray-600" },
    ],
    expense: [
        { name: "Ăn uống", icon: Coffee, color: "text-red-600" },
        { name: "Di chuyển", icon: Car, color: "text-purple-600" },
        { name: "Mua sắm", icon: ShoppingBag, color: "text-pink-600" },
        { name: "Giải trí", icon: Gamepad2, color: "text-indigo-600" },
        { name: "Hóa đơn", icon: Receipt, color: "text-orange-600" },
        { name: "Khác", icon: MoreHorizontal, color: "text-gray-600" },
    ]
};

const WALLETS = [
    { id: "cash", name: "Tiền mặt", icon: Wallet, color: "from-green-500 to-emerald-600" },
    { id: "bank", name: "Ngân hàng", icon: CreditCard, color: "from-blue-500 to-cyan-600" },
    { id: "card", name: "Thẻ tín dụng", icon: CreditCard, color: "from-purple-500 to-pink-600" },
];

export default function Finance() {
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState({
        cash: { balance: 0 },
        bank: { balance: 5000000 },
        card: { balance: 0 },
    });
    const [budget, setBudget] = useState(20000000);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);

    const [form, setForm] = useState({
        type: "expense",
        amount: "",
        category: "",
        wallet: "cash",
        note: "",
        date: new Date().toISOString().split("T")[0]
    });

    useEffect(() => {
        const savedTx = localStorage.getItem("lifeos-finance-tx");
        const savedWallet = localStorage.getItem("lifeos-finance-wallets");
        const savedBudget = localStorage.getItem("lifeos-finance-budget");

        if (savedTx) setTransactions(JSON.parse(savedTx));
        if (savedWallet) setWallets(JSON.parse(savedWallet));
        if (savedBudget) setBudget(Number(savedBudget));
    }, []);

    useEffect(() => {
        localStorage.setItem("lifeos-finance-tx", JSON.stringify(transactions));
        localStorage.setItem("lifeos-finance-wallets", JSON.stringify(wallets));
        localStorage.setItem("lifeos-finance-budget", budget);
    }, [transactions, wallets, budget]);

    const openModal = (tx = null) => {
        setEditingTx(tx);
        if (tx) {
            setForm({
                type: tx.type,
                amount: tx.amount,
                category: tx.category,
                wallet: tx.wallet,
                note: tx.note || "",
                date: tx.date
            });
        } else {
            setForm({
                type: "expense", amount: "", category: "", wallet: "cash", note: "", date: new Date().toISOString().split("T")[0]
            });
        }
        setIsModalOpen(true);
    };

    const saveTransaction = () => {
        if (!form.amount || !form.category) return;

        const amount = Number(form.amount);
        const newTx = editingTx
            ? { ...editingTx, ...form, amount }
            : { id: Date.now(), ...form, amount };

        setWallets(prev => {
            const updated = { ...prev };
            if (editingTx) {
                if (editingTx.wallet === form.wallet) {
                    updated[form.wallet].balance += form.type === "income" ? amount - editingTx.amount : editingTx.amount - amount;
                } else {
                    updated[editingTx.wallet].balance += editingTx.type === "income" ? -editingTx.amount : editingTx.amount;
                    updated[form.wallet].balance += form.type === "income" ? amount : -amount;
                }
            } else {
                updated[form.wallet].balance += form.type === "income" ? amount : -amount;
            }
            return updated;
        });

        setTransactions(prev =>
            editingTx
                ? prev.map(t => t.id === editingTx.id ? newTx : t)
                : [...prev, newTx]
        );

        setIsModalOpen(false);
    };

    const deleteTransaction = (id) => {
        const tx = transactions.find(t => t.id === id);
        if (!tx) return;

        setWallets(prev => ({
            ...prev,
            [tx.wallet]: { ...prev[tx.wallet], balance: prev[tx.wallet].balance + (tx.type === "income" ? -tx.amount : tx.amount) }
        }));

        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthTx = transactions.filter(t =>
        new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd
    );

    const totalIncome = monthTx.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const totalExpense = monthTx.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
    const balance = totalIncome - totalExpense;
    const budgetUsed = budget > 0 ? (totalExpense / budget) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:to-teal-900">
            <div className="max-w-7xl mx-auto p-6 lg:p-12">
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-6">
                        <DollarSign className="w-16 h-16 text-green-600" />
                        Finance Tracker
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">
                        Tháng {now.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })} • Dư: {balance.toLocaleString()}đ
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-8 mb-12">
                    <motion.div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
                        <TrendingUp className="w-12 h-12 mb-4" />
                        <p className="text-5xl font-bold">{totalIncome.toLocaleString()}đ</p>
                        <p className="text-xl opacity-90">Thu nhập</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-8 text-white shadow-2xl">
                        <TrendingDown className="w-12 h-12 mb-4" />
                        <p className="text-5xl font-bold">{totalExpense.toLocaleString()}đ</p>
                        <p className="text-xl opacity-90">Chi tiêu</p>
                    </motion.div>

                    <motion.div className={`bg-gradient-to-br ${balance >= 0 ? "from-blue-500 to-cyan-600" : "from-orange-500 to-red-600"} rounded-3xl p-8 text-white shadow-2xl`}>
                        <Wallet className="w-12 h-12 mb-4" />
                        <p className="text-5xl font-bold">{balance.toLocaleString()}đ</p>
                        <p className="text-xl opacity-90">Còn lại</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
                        <PiggyBank className="w-12 h-12 mb-4" />
                        <p className="text-5xl font-bold">{budgetUsed.toFixed(0)}%</p>
                        <p className="text-xl opacity-90">Ngân sách đã dùng</p>
                        <div className="mt-4 bg-white/30 rounded-full h-4 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
                                className="h-full bg-white"
                            />
                        </div>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {WALLETS.map(w => (
                        <div key={w.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                            <div className={`w-16 h-16 bg-gradient-to-br ${w.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                                <w.icon className="w-10 h-10" />
                            </div>
                            <p className="text-3xl font-bold">{wallets[w.id].balance.toLocaleString()}đ</p>
                            <p className="text-lg text-gray-600 dark:text-gray-400">{w.name}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-4xl font-bold">Giao dịch gần đây</h2>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal()}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-xl flex items-center gap-3">
                            <Plus className="w-6 h-6" /> Thêm
                        </motion.button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {transactions.slice(-10).reverse().map(tx => (
                                <motion.div
                                    key={tx.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${tx.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                            {tx.type === "income" ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold">{tx.category}</p>
                                            <p className="text-gray-600 dark:text-gray-400">{tx.note || new Date(tx.date).toLocaleDateString("vi-VN")}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-2xl font-bold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                            {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()}đ
                                        </p>
                                        <div className="flex gap-3 mt-2">
                                            <button onClick={() => openModal(tx)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => deleteTransaction(tx.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="w-5 h-5 text-red-600" /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-4 z-50"
                        onClick={() => setIsModalOpen(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
                            <h2 className="text-4xl font-bold text-center mb-10">
                                {editingTx ? "Sửa giao dịch" : "Thêm giao dịch mới"}
                            </h2>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <button onClick={() => setForm({ ...form, type: "income" })}
                                    className={`p-8 rounded-2xl transition ${form.type === "income" ? "bg-green-500 text-white shadow-xl" : "bg-gray-100 dark:bg-gray-700"}`}>
                                    <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                                    <p className="text-2xl font-bold">Thu nhập</p>
                                </button>
                                <button onClick={() => setForm({ ...form, type: "expense" })}
                                    className={`p-8 rounded-2xl transition ${form.type === "expense" ? "bg-red-500 text-white shadow-xl" : "bg-gray-100 dark:bg-gray-700"}`}>
                                    <TrendingDown className="w-12 h-12 mx-auto mb-3" />
                                    <p className="text-2xl font-bold">Chi tiêu</p>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <input type="number" placeholder="Số tiền" value={form.amount}
                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                    className="w-full px-8 py-6 text-3xl font-bold rounded-2xl bg-gray-100 dark:bg-gray-700 text-center focus:outline-none focus:ring-4 focus:ring-emerald-500" />

                                <div className="grid grid-cols-3 gap-4">
                                    {CATEGORIES[form.type].map(cat => (
                                        <button key={cat.name} onClick={() => setForm({ ...form, category: cat.name })}
                                            className={`p-6 rounded-2xl transition ${form.category === cat.name ? "bg-emerald-500 text-white shadow-xl" : "bg-gray-100 dark:bg-gray-700"}`}>
                                            <cat.icon className={`w-10 h-10 mx-auto mb-2 ${form.category === cat.name ? "text-white" : cat.color}`} />
                                            <p className="font-medium">{cat.name}</p>
                                        </button>
                                    ))}
                                </div>

                                <select value={form.wallet} onChange={e => setForm({ ...form, wallet: e.target.value })}
                                    className="w-full px-8 py-6 rounded-2xl bg-gray-100 dark:bg-gray-700 text-xl">
                                    {WALLETS.map(w => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>

                                <input type="text" placeholder="Ghi chú (tùy chọn)" value={form.note}
                                    onChange={e => setForm({ ...form, note: e.target.value })}
                                    className="w-full px-8 py-6 rounded-2xl bg-gray-100 dark:bg-gray-700" />

                                <input type="date" value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full px-8 py-6 rounded-2xl bg-gray-100 dark:bg-gray-700" />
                            </div>

                            <div className="flex gap-6 justify-center mt-10">
                                <button onClick={() => setIsModalOpen(false)}
                                    className="px-12 py-5 rounded-2xl bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 font-bold text-xl">
                                    Hủy
                                </button>
                                <button onClick={saveTransaction}
                                    className="px-14 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl shadow-xl">
                                    {editingTx ? "Cập nhật" : "Thêm ngay"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}