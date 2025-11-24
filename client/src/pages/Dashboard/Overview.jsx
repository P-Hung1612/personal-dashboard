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
    Brain, // Thêm icon Brain cho header
} from "lucide-react";

export default function Overview() {
    // Dữ liệu mẫu – sau này thay bằng state thật
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
        <>
            {/* HEADER CODE TAY – SIÊU ĐẸP, CHUẨN ANALYTICS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Brain className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Chào mừng trở lại, Hưng
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                Hôm nay là một ngày tuyệt vời để trở thành phiên bản tốt hơn!
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Hãy cùng xem bạn đã làm được gì hôm nay và chuẩn bị cho một ngày bứt phá!
                    </p>
                </div>
            </motion.div>

            {/* Nội dung chính */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<CheckCircle2 className="w-9 h-9 text-indigo-600" />}
                        label="Tasks hôm nay"
                        value={`${todayStats.tasksDone}/${todayStats.tasksTotal}`}
                        progress={(todayStats.tasksDone / todayStats.tasksTotal) * 100}
                    />
                    <StatCard
                        icon={<Flame className="w-9 h-9 text-orange-500" />}
                        label="Streak hiện tại"
                        value={`${todayStats.streak} ngày`}
                        subtitle="Giữ vững phong độ!"
                    />
                    <StatCard
                        icon={<Clock className="w-9 h-9 text-green-600" />}
                        label="Focus hôm nay"
                        value={`${Math.floor(todayStats.focusMinutes / 60)}h${todayStats.focusMinutes % 60}p`}
                    />
                    <StatCard
                        icon={<TrendingUp className="w-9 h-9 text-purple-600" />}
                        label="Năng lượng"
                        value={`${todayStats.energy}%`}
                        progress={todayStats.energy}
                    />
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        Hành động nhanh
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {quickActions.map((action, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.06, y: -6 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                className={`flex flex-col items-center justify-center p-7 rounded-2xl bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 dark:from-gray-800 dark:to-gray-700 border border-${action.color}-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300`}
                            >
                                <action.icon className={`w-12 h-12 text-${action.color}-600 mb-3`} />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    {action.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-7">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        Hoạt động gần đây
                    </h2>
                    <div className="space-y-5">
                        <ActivityItem icon={CheckCircle2} color="green" text="Hoàn thành task “Học React 1h”" time="15 phút trước" />
                        <ActivityItem icon={Flame} color="orange" text="Check-in 5 habits sáng nay" time="2 giờ trước" />
                        <ActivityItem icon={Coffee} color="amber" text="Focus session 25 phút" time="3 giờ trước" />
                        <ActivityItem icon={Moon} color="blue" text="Ghi nhật ký tối qua" time="Hôm qua" />
                    </div>
                </div>
            </div>
        </>
    );
}

// StatCard – nâng cấp nhẹ cho đẹp hơn
function StatCard({ icon, label, value, subtitle, progress }) {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
        >
            <div className="flex items-center justify-between mb-4">
                {icon}
                {progress !== undefined && (
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </span>
                )}
            </div>
            {progress === undefined && (
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {value}
                </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            {subtitle && <p className="text-xs text-green-600 font-medium mt-2">{subtitle}</p>}
            {progress !== undefined && (
                <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    />
                </div>
            )}
        </motion.div>
    );
}

// ActivityItem – giữ nguyên
function ActivityItem({ icon: Icon, color, text, time }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
            <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">{text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
            </div>
        </div>
    );
}