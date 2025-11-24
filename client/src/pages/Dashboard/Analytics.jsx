// src/pages/Dashboard/Analytics.jsx – ĐÃ SỬA LỖI THẺ ĐÓNG
import { motion } from "framer-motion";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import {
    TrendingUp, Target, Flame, Clock, CheckCircle2, Calendar, Brain,
} from "lucide-react";

export default function Analytics() {
    const weeklyData = [
        { day: "T2", tasks: 12, focus: 120, habits: 7 },
        { day: "T3", tasks: 19, focus: 180, habits: 8 },
        { day: "T4", tasks: 15, focus: 90, habits: 6 },
        { day: "T5", tasks: 25, focus: 240, habits: 9 },
        { day: "T6", tasks: 18, focus: 150, habits: 8 },
        { day: "T7", tasks: 22, focus: 200, habits: 10 },
        { day: "CN", tasks: 10, focus: 60, habits: 5 },
    ];

    const categoryData = [
        { name: "Học tập", value: 35, color: "#8b5cf6" },
        { name: "Công việc", value: 30, color: "#3b82f6" },
        { name: "Sức khỏe", value: 20, color: "#10b981" },
        { name: "Giải trí", value: 15, color: "#f59e0b" },
    ];

    const streakData = [
        { month: "Th1", streak: 15 }, { month: "Th2", streak: 28 },
        { month: "Th3", streak: 22 }, { month: "Th4", streak: 31 },
        { month: "Th5", streak: 29 }, { month: "Th6", streak: 25 },
    ];

    const stats = {
        totalTasks: 342, completedRate: 87, avgFocusPerDay: "3h 12p",
        longestStreak: 31, currentStreak: 25,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white p-8 lg:p-12"
            >
                <div className="flex items-center gap-4 mb-4">
                    <Brain className="w-12 h-12" />
                    <h1 className="text-4xl lg:text-5xl font-bold">Analytics</h1>
                </div>
                <p className="text-xl opacity-90">
                    Theo dõi hành trình phát triển của bạn qua từng con số
                </p>
            </motion.div>

            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<CheckCircle2 className="w-8 h-8 text-green-500" />} label="Tổng task hoàn thành" value={stats.totalTasks} trend="+12%" />
                    <StatCard icon={<Target className="w-8 h-8 text-blue-500" />} label="Tỷ lệ hoàn thành" value={`${stats.completedRate}%`} trend="+5%" />
                    <StatCard icon={<Clock className="w-8 h-8 text-purple-500" />} label="Focus trung bình/ngày" value={stats.avgFocusPerDay} />
                    <StatCard icon={<Flame className="w-8 h-8 text-orange-500" />} label="Streak dài nhất" value={stats.longestStreak} subtitle={`Hiện tại: ${stats.currentStreak} ngày`} />
                </div>

                {/* Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Weekly Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                            <TrendingUp className="w-7 h-7 text-indigo-600" />
                            Hoạt động 7 ngày gần nhất
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.9)", border: "none", borderRadius: "12px" }} />
                                <Area type="monotone" dataKey="tasks" stackId="1" stroke="#8b5cf6" fill="#c4b5fd" name="Tasks" />
                                <Area type="monotone" dataKey="focus" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Focus (phút)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Category Distribution – ĐÃ SỬA THẺ ĐÓNG */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Phân bổ thời gian
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={100}
                                    paddingAngle={5} dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {categoryData.map((cat) => (
                                <div key={cat.name} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {cat.name}: {cat.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    {/* ← Kết thúc thẻ motion.div đúng chỗ */}
                </div>

                {/* Streak History */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <Flame className="w-8 h-8 text-orange-500" />
                        Lịch sử Streak (6 tháng gần nhất)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={streakData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="streak" fill="#fb923c" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, subtitle }) {
    return (
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                {icon}
                {trend && (
                    <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
            {subtitle && <p className="text-xs text-orange-600 mt-2">{subtitle}</p>}
        </motion.div>
    );
}