import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function TaskModal({
    isOpen,
    form,
    setForm,
    onSave,
    onClose,
    editing,
}) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-10 shadow-2xl"
            >
                {/* Title + Close */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {editing ? "Sửa Task" : "Thêm Task Mới"}
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                    <input
                        type="text"
                        placeholder="Tên task..."
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        className="w-full p-4 rounded-xl bg-gray-50"
                    />
                    <input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) =>
                            setForm({ ...form, dueDate: e.target.value })
                        }
                        className="w-full p-4 rounded-xl bg-gray-50"
                    />
                    <textarea
                        rows={3}
                        placeholder="Ghi chú..."
                        value={form.notes}
                        onChange={(e) =>
                            setForm({ ...form, notes: e.target.value })
                        }
                        className="w-full p-4 rounded-xl bg-gray-50"
                    />

                    <button
                        onClick={onSave}
                        className="w-full mt-6 bg-indigo-600 py-4 rounded-xl text-white font-bold text-lg"
                    >
                        {editing ? "Cập nhật" : "Thêm Task"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
