import { motion } from "framer-motion";

const FILTERS = [
    { key: "all", label: "Tất cả" },
    { key: "today", label: "Hôm nay" },
    { key: "upcoming", label: "Sắp tới" },
    { key: "completed", label: "Đã hoàn thành" },
];

export default function TaskFilters({ filter, setFilter }) {
    return (
        <div className="flex flex-wrap gap-4">
            {FILTERS.map(({ key, label }) => (
                <motion.button
                    key={key}
                    onClick={() => setFilter(key)}
                    whileHover={{ scale: 1.06, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-7 py-4 rounded-2xl font-semibold ${
                        filter === key
                            ? "bg-white text-indigo-700 shadow-indigo-500/30"
                            : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                    {label}
                    {filter === key && (
                        <motion.span
                            layoutId="filterBubble"
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 -z-10"
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
}
