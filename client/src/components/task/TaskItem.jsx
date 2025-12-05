import { motion } from "framer-motion";
import { CheckCircle2, Circle, Calendar, Trash2, Edit2 } from "lucide-react";
import { format, isPast } from "date-fns";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow flex items-center gap-5 group"
        >
            <button onClick={onToggle} className="shrink-0">
                {task.status === "completed" ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                    <Circle className="w-8 h-8 text-gray-400 hover:text-indigo-600" />
                )}
            </button>

            <div className="flex-1">
                <h3
                    className={`text-xl font-semibold ${
                        task.status === "completed"
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                    }`}
                >
                    {task.title}
                </h3>

                {task.notes && (
                    <p className="text-sm text-gray-600 mt-2">{task.notes}</p>
                )}

                {task.dueDate && (
                    <span
                        className={`inline-flex items-center gap-2 mt-3 text-xs px-4 py-2 rounded-full ${
                            isPast(new Date(task.dueDate)) &&
                            task.status !== "completed"
                                ? "bg-red-100 text-red-700"
                                : "bg-indigo-100 text-indigo-700"
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                        {format(new Date(task.dueDate), "dd/MM/yyyy")}
                    </span>
                )}
            </div>

            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                <button onClick={onEdit}>
                    <Edit2 className="w-5 h-5 text-indigo-600" />
                </button>
                <button onClick={onDelete}>
                    <Trash2 className="w-5 h-5 text-red-600" />
                </button>
            </div>
        </motion.div>
    );
}
