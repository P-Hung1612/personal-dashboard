// src/pages/Dashboard/Overview.jsx
import { motion } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    Flame,
    Target,
    TrendingUp,
    Coffee,
    Moon,
    Sun,
    Clock,
} from "lucide-react";

export default function Overview() {
    // Dữ liệu mẫu – sau này bạn sẽ thay bằng state thật hoặc từ localStorage
    const todayStats = {
        tasksDone: 7,
        tasksTotal: 12,
        streak: 21,
        focusMinutes: 127,
        mood: "Tốt",
        energy: 82,
    };

    const quickActions = [
        { label: "Thêm Task nhanh", icon: CheckCircle2, color: "indigo" },
        { label: "Check-in Habit", icon: Flame, color: "orange" },
        { label: "Ghi chú nhanh", icon: Target, color: "pink" },
        { label: "Bắt đầu Focus", icon: Clock, color: "green" },
    ];

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                    Chào mừng trở lại, Hưng
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                    Hôm nay là một ngày tuyệt vời để trở thành phiên bản tốt hơn!
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard
                    icon={<CheckCircle2 className="w-8 h-8 text-indigo-600" />}
                    label="Tasks hôm nay"
                    value={`${todayStats.tasksDone}/${todayStats.tasksTotal}`}
                    progress={(todayStats.tasksDone / todayStats.tasksTotal) * 100}
                />
                <StatCard
                    icon={<Flame className="w-8 h-8 text-orange-500" />}
                    label="Streak hiện tại"
                    value={`${todayStats.streak} ngày`}
                    subtitle="Giữ vững phong độ!"
                />
                <StatCard
                    icon={<Clock className="w-8 h-8 text-green-600" />}
                    label="Focus hôm nay"
                    value={`${Math.floor(todayStats.focusMinutes / 60)}h${todayStats.focusMinutes % 60}p`}
                />
                <StatCard
                    icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
                    label="Năng lượng"
                    value={`${todayStats.energy}%`}
                    progress={todayStats.energy}
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-5">
                    Hành động nhanh
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 dark:from-gray-800 dark:to-gray-700 border border-${action.color}-200 dark:border-gray-600 hover:shadow-lg transition-all`}
                        >
                            <action.icon className={`w-10 h-10 text-${action.color}-600 mb-3`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {action.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    Hoạt động gần đây
                </h2>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                    <ActivityItem icon={CheckCircle2} color="green" text="Hoàn thành task “Học React 1h”" time="15 phút trước" />
                    <ActivityItem icon={Flame} color="orange" text="Check-in 5 habits sáng nay" time="2 giờ trước" />
                    <ActivityItem icon={Coffee} color="amber" text="Focus session 25 phút" time="3 giờ trước" />
                    <ActivityItem icon={Moon} color="blue" text="Ghi nhật ký tối qua" time="Hôm qua" />
                </div>
            </div>
        </div>
    );
}

// Component con để code sạch
function StatCard({ icon, label, value, subtitle, progress }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between mb-3">
                {icon}
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            {subtitle && <p className="text-xs text-green-600 mt-1">{subtitle}</p>}
            {progress !== undefined && (
                <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-indigo-600 rounded-full"
                    />
                </div>
            )}
        </motion.div>
    );
}

function ActivityItem({ icon: Icon, color, text, time }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div className="flex-1">
                <p>{text}</p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
        </div>
    );
}