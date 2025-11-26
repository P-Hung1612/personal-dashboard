// src/pages/Life/Finance.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI OVERVIEW, NOTES, MOOD → ĐẸP KHÔNG THỂ CHỐNG CỰ!
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Wallet, TrendingUp, TrendingDown, PiggyBank, Sparkles,
    X, Edit2, Trash2, CreditCard, DollarSign, Coffee, Car,
    ShoppingBag, Gamepad2, Receipt, MoreHorizontal, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const CATEGORIES = {
    income: [
        { name: "Lương", icon: DollarSign, color: "text-green-600" },
        { name: "Freelance", icon: Wallet, color: "text-cyan-600" },
        { name: "Thưởng", icon: PiggyBank, color: "text-yellow-600" },
        { name: "Đầu tư", icon: TrendingUp, color: "text-emerald-600" },
        { name: "Khác", icon: MoreHorizontal, color: "text-gray-600" },
    ],
    expense: [
        { name: "Ăn uống", icon: Coffee, color: "text-orange-600" },
        { name: "Di chuyển", icon: Car, color: "text-purple-600" },
        { name: "Mua sắm", icon: ShoppingBag, color: "text-pink-600" },
        { name: "Giải trí", icon: Gamepad2, color: "text-indigo-600" },
        { name: "Hóa đơn", icon: Receipt, color: "text-red-600" },
        { name: "Khác", icon: MoreHorizontal, color: "text-gray-600" },
    ]
};

const WALLETS = [
    { id: "cash", name: "Tiền mặt", icon: Wallet, gradient: "from-emerald-500 to-teal-600" },
    { id: "bank", name: "Ngân hàng", icon: CreditCard, gradient: "from-blue-500 to-cyan-600" },
    { id: "card", name: "Thẻ tín dụng", icon: CreditCard, gradient: "from-purple-500 to-pink-600" },
];

export default function Finance() {
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState({
        cash: { balance: 2500000 },
        bank: { balance: 18500000 },
        card: { balance: -3200000 },
    });
    const [budget, setBudget] = useState(25000000);
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

    // Load & Save
    useEffect(() => {
        try {
            const tx = localStorage.getItem("lifeos-finance-tx");
            const w = localStorage.getItem("lifeos-finance-wallets");
            const b = localStorage.getItem("lifeos-finance-budget");
            if (tx) setTransactions(JSON.parse(tx));
            if (w) setWallets(JSON.parse(w));
            if (b) setBudget(Number(b));
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-finance-tx", JSON.stringify(transactions));
            localStorage.setItem("lifeos-finance-wallets", JSON.stringify(wallets));
            localStorage.setItem("lifeos-finance-budget", budget);
        } catch (e) { console.error(e); }
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
                type: "expense", amount: "", category: "", wallet: "cash", note: "",
                date: new Date().toISOString().split("T")[0]
            });
        }
        setIsModalOpen(true);
    };

    const saveTransaction = () => {
        if (!form.amount || !form.category) return;
        const amount = Number(form.amount);
        const newTx = editingTx
            ? { ...editingTx, ...form, amount }
            : { id: Date.now(), createdAt: new Date().toISOString(), ...form, amount };

        setWallets(prev => {
            const updated = { ...prev };
            if (editingTx) {
                // Hoàn tiền cũ
                updated[editingTx.wallet].balance += editingTx.type === "income"
                    ? -editingTx.amount : editingTx.amount;
                if (editingTx.wallet !== form.wallet) {
                    updated[form.wallet].balance += form.type === "income" ? amount : -amount;
                } else {
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
        setEditingTx(null);
    };

    const deleteTransaction = (id) => {
        const tx = transactions.find(t => t.id === id);
        if (!tx) return;
        setWallets(prev => ({
            ...prev,
            [tx.wallet]: {
                ...prev[tx.wallet],
                balance: prev[tx.wallet].balance + (tx.type === "income" ? -tx.amount : tx.amount)
            }
        }));
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    // Tính toán tháng hiện tại
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
    const totalBalance = Object.values(wallets).reduce((a, w) => a + w.balance, 0);

    return (
        <>
            {/* HEADER – ĐỒNG BỘ CHUẨN LIFE OS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                                Quản lý tài chính
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {now.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })} • Tổng tài sản: {totalBalance.toLocaleString()}đ
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Theo dõi thu chi, kiểm soát ngân sách – tự do tài chính bắt đầu từ hôm nay.
                    </p>
                </div>
            </motion.div>

            <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">

                {/* STATS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <motion.div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
                        <ArrowUpRight className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-3xl font-extrabold">{totalIncome.toLocaleString()}đ</p>
                        <p className="text-xl opacity-90 mt-2">Thu nhập tháng này</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-8 text-white shadow-2xl">
                        <ArrowDownRight className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-3xl font-extrabold">{totalExpense.toLocaleString()}đ</p>
                        <p className="text-xl opacity-90 mt-2">Chi tiêu tháng này</p>
                    </motion.div>

                    <motion.div className={`bg-gradient-to-br ${balance >= 0 ? "from-cyan-500 to-blue-600" : "from-orange-500 to-red-600"} rounded-3xl p-8 text-white shadow-2xl`}>
                        <Wallet className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-3xl font-extrabold">{balance.toLocaleString()}đ</p>
                        <p className="text-xl opacity-90 mt-2">Còn lại tháng này</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
                        <PiggyBank className="w-14 h-14 mb-4 opacity-90" />
                        <p className="text-3xl font-extrabold">{budgetUsed.toFixed(0)}%</p>
                        <p className="text-xl opacity-90 mt-2">Ngân sách đã dùng</p>
                        <div className="mt-6 bg-white/30 rounded-full h-6 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="h-full bg-white rounded-full shadow-lg"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* WALLETS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {WALLETS.map(w => (
                        <motion.div
                            key={w.id}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all"
                        >
                            <div className={`w-20 h-20 bg-gradient-to-br ${w.gradient} rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                                <w.icon className="w-12 h-12" />
                            </div>
                            <p className="text-3xl font-extrabold text-gray-800 dark:text-white">
                                {wallets[w.id].balance.toLocaleString()}đ
                            </p>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">{w.name}</p>
                        </motion.div>
                    ))}
                </div>

                {/* RECENT TRANSACTIONS */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
                            Giao dịch gần đây
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openModal()}
                            className="px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-4"
                        >
                            <Plus className="w-8 h-8" />
                            Thêm giao dịch
                        </motion.button>
                    </div>

                    <div className="space-y-5">
                        <AnimatePresence>
                            {transactions.slice(-15).reverse().map(tx => {
                                const cat = [...CATEGORIES.income, ...CATEGORIES.expense].find(c => c.name === tx.category);
                                return (
                                    <motion.div
                                        key={tx.id}
                                        layout
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`p-4 rounded-2xl ${tx.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                                                {tx.type === "income" ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{tx.category}</p>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {tx.note || new Date(tx.date).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "short" })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`text-3xl font-extrabold ${tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                                                {tx.type === "income" ? "+" : "−"}{tx.amount.toLocaleString()}đ
                                            </p>
                                            <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => openModal(tx)} className="p-3 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl">
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => deleteTransaction(tx.id)} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl">
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* MODAL */}
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
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-3xl w-full h-full border border-gray-200 dark:border-gray-700 overflow-y-auto"
                        >
                            <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white">
                                {editingTx ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
                            </h2>

                            {/* Type */}
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                {["income", "expense"].map(type => (
                                    <motion.button
                                        key={type}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setForm(prev => ({ ...prev, type }))}
                                        className={`p-10 rounded-3xl transition-all ${form.type === type
                                            ? type === "income"
                                                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl"
                                                : "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-2xl"
                                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        {type === "income" ? <ArrowUpRight className="w-16 h-16 mx-auto mb-4" /> : <ArrowDownRight className="w-16 h-16 mx-auto mb-4" />}
                                        <p className="text-3xl font-bold">
                                            {type === "income" ? "Thu nhập" : "Chi tiêu"}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Amount */}
                            <input
                                type="number"
                                placeholder="0"
                                value={form.amount}
                                onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full px-10 py-8 text-5xl font-extrabold text-center rounded-3xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:outline-none transition-all"
                            />

                            {/* Category */}
                            <div className="grid grid-cols-3 gap-5 mt-8">
                                {CATEGORIES[form.type].map(cat => (
                                    <motion.button
                                        key={cat.name}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setForm(prev => ({ ...prev, category: cat.name }))}
                                        className={`p-8 rounded-3xl transition-all ${form.category === cat.name
                                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl ring-4 ring-emerald-500/30"
                                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        <cat.icon className={`w-12 h-12 mx-auto mb-3 ${form.category === cat.name ? "text-white" : cat.color}`} />
                                        <p className="text-lg font-bold">{cat.name}</p>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Wallet + Note + Date */}
                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <select
                                    value={form.wallet}
                                    onChange={e => setForm(prev => ({ ...prev, wallet: e.target.value }))}
                                    className="px-8 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 text-xl font-medium border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-emerald-500 focus:outline-none"
                                >
                                    {WALLETS.map(w => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                                    className="px-8 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 text-xl font-medium border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Ghi chú (tùy chọn)"
                                value={form.note}
                                onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
                                className="w-full mt-6 px-8 py-6 rounded-2xl bg-gray-50 dark:bg-gray-700 text-xl border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-emerald-500 focus:outline-none"
                            />

                            <div className="flex justify-end gap-6 mt-12">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-12 py-6 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-xl transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={saveTransaction}
                                    className="px-14 py-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl shadow-2xl hover:shadow-emerald-500/50 transition-all"
                                >
                                    {editingTx ? "Cập nhật" : "Thêm ngay"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}