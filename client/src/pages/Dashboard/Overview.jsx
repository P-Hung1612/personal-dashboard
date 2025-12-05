import { motion } from "framer-motion";
import {
    Brain,
    CheckCircle2,
    Flame,
    Clock,
    TrendingUp,
    Coffee,
    Moon,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import QuickActionButton from "../../components/dashboard/QuickActionButton";
import ActivityItem from "../../components/dashboard/ActivityItem";
import { useData } from "../../context/DataContext";
export default function Overview() {
    const { userData, initDemo, loading } = useData();

    const ov = userData?.overview || {
        tasks: userData?.tasks?.length ?? 0,
        notes: userData?.notes?.length ?? 0,
        habits: userData?.habits?.length ?? 0,
        goals: userData?.goals?.length ?? 0,
        areas: userData?.areas?.length ?? 0,
    };

    const todayStats = {
        tasksDone: (userData?.tasks || []).filter((t) => t.completed).length,
        tasksTotal: userData?.tasks?.length || 0,
        streak: userData?.habits?.reduce((a, b) => a + (b.streak || 0), 0)
            ? Math.floor(userData.habits?.[0]?.streak || 0)
            : 0,
        focusMinutes: 127,
        energy: 82,
    };

    const quickActions = [
        { label: "Thêm Task nhanh", icon: CheckCircle2, color: "indigo" },
        { label: "Check-in Habit", icon: Flame, color: "orange" },
        { label: "Ghi chú nhanh", icon: TrendingUp, color: "pink" },
        { label: "Bắt đầu Focus", icon: Clock, color: "green" },
    ];

    if (loading) return <div className="p-6">⏳ Đang tải...</div>;

    return (
        <>
            {/* header same as before */}
            <motion.div
                /* ... */ className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Brain className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold">
                                Chào mừng trở lại
                            </h1>
                            <p className="text-xl mt-3 opacity-95">
                                Bạn có {ov.tasks} tasks và {ov.notes} notes.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={
                            <CheckCircle2 className="w-9 h-9 text-indigo-600" />
                        }
                        label="Tasks"
                        value={`${todayStats.tasksDone}/${todayStats.tasksTotal}`}
                        progress={
                            todayStats.tasksTotal
                                ? (todayStats.tasksDone /
                                      todayStats.tasksTotal) *
                                  100
                                : 0
                        }
                    />
                    <StatCard
                        icon={<Flame className="w-9 h-9 text-orange-500" />}
                        label="Habits"
                        value={`${ov.habits}`}
                        subtitle="Thói quen đang theo dõi"
                    />
                    <StatCard
                        icon={<Clock className="w-9 h-9 text-green-600" />}
                        label="Notes"
                        value={ov.notes}
                    />
                    <StatCard
                        icon={
                            <TrendingUp className="w-9 h-9 text-purple-600" />
                        }
                        label="Goals"
                        value={ov.goals}
                        progress={ov.goals ? Math.min(100, ov.goals * 10) : 0}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Hành động nhanh</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {quickActions.map((btn, i) => (
                            <QuickActionButton key={i} {...btn} />
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-7">
                    <h2 className="text-2xl font-bold mb-6">
                        Hoạt động gần đây
                    </h2>
                    <div className="space-y-5">
                        {/* Example activity: map latest tasks */}
                        {(userData?.tasks || []).slice(0, 4).map((t) => (
                            <ActivityItem
                                key={t.id}
                                icon={CheckCircle2}
                                color="green"
                                text={`Task: ${t.title}`}
                                time={new Date(t.createdAt).toLocaleString()}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
