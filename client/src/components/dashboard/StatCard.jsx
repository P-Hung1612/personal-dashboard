import { motion } from "framer-motion";

export default function StatCard({ icon, label, value, subtitle, progress }) {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
        >
            <div className="flex items-center justify-between mb-4">
                {icon}
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {value}
                </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            {subtitle && (
                <p className="text-xs text-green-600 font-medium mt-2">
                    {subtitle}
                </p>
            )}

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
