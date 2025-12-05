import { motion } from "framer-motion";

export default function QuickActionButton({ icon: Icon, label, color }) {
    return (
        <motion.button
            whileHover={{ scale: 1.06, y: -6 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={`flex flex-col items-center justify-center p-7 rounded-2xl bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-gray-800 dark:to-gray-700 border border-${color}-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300`}
        >
            <Icon className={`w-12 h-12 text-${color}-600 mb-3`} />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {label}
            </span>
        </motion.button>
    );
}
