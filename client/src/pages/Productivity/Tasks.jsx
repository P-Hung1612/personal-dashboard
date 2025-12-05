import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2 } from "lucide-react";
import { useData } from "../../context/DataContext.jsx";

import TaskFilters from "../../components/task/TaskFilters";
import TaskItem from "../../components/task/TaskItem";
import TaskModal from "../../components/task/TaskModal";

export default function Tasks() {
    const { userData, loading, createTask, editTask, removeTask } = useData();

    const tasks = userData?.tasks || [];

    const [filter, setFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: "", notes: "", dueDate: "" });

    // Pagination
    const pageSize = 10;
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let result = tasks;
        switch (filter) {
            case "active":
                result = tasks.filter((t) => !t.completed);
                break;
            case "completed":
                result = tasks.filter((t) => t.completed);
                break;
        }
        return result;
    }, [tasks, filter]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    const pagedTasks = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    const changePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const openModal = useCallback((task = null) => {
        setEditing(task);
        setForm(task || { title: "", notes: "", dueDate: "" });
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setEditing(null);
        setForm({ title: "", notes: "", dueDate: "" });
        setIsModalOpen(false);
    }, []);

    const saveTask = useCallback(async () => {
        if (!form.title.trim()) return;

        if (editing) {
            await editTask(editing.id, form);
        } else {
            await createTask({ ...form, completed: false });
        }
        closeModal();
    }, [editing, form, createTask, editTask, closeModal]);

    if (loading) return <p className="p-10 text-center">Loading tasks...</p>;

    return (
        <>
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-indigo-600 text-white p-10"
            >
                <CheckCircle2 className="w-14 h-14" />
                <h1 className="text-4xl font-bold mt-3">Tasks</h1>
            </motion.div>

            {/* Content */}
            <div className="p-10 max-w-5xl mx-auto space-y-10">
                <TaskFilters
                    filter={filter}
                    setFilter={(f) => {
                        setFilter(f);
                        setPage(1); // reset về page 1 khi filter
                    }}
                />

                <AnimatePresence>
                    {pagedTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={() =>
                                editTask(task.id, {
                                    completed: !task.completed,
                                })
                            }
                            onEdit={() => openModal(task)}
                            onDelete={() => removeTask(task.id)}
                        />
                    ))}
                </AnimatePresence>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-6 text-sm">
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-40"
                            disabled={page === 1}
                            onClick={() => changePage(page - 1)}
                        >
                            Prev
                        </button>

                        <span className="text-gray-700">
                            Page {page} / {totalPages}
                        </span>

                        <button
                            className="px-3 py-1 border rounded disabled:opacity-40"
                            disabled={page === totalPages}
                            onClick={() => changePage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* FAB */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 p-5 bg-indigo-600 rounded-3xl text-white shadow-xl"
                >
                    <Plus className="w-8 h-8" />
                </motion.button>
            </div>

            {/* Modal */}
            <TaskModal
                isOpen={isModalOpen}
                form={form}
                setForm={setForm}
                onSave={saveTask}
                onClose={closeModal}
                editing={!!editing}
            />
        </>
    );
}
