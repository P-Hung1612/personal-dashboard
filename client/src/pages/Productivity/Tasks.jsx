// src/pages/Productivity/Tasks.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  GripVertical,
  Filter,
  X,
} from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";

const STATUS = {
  TODO: "todo",
  COMPLETED: "completed",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", dueDate: "", notes: "" });

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lifeos-tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save vào localStorage
  useEffect(() => {
    localStorage.setItem("lifeos-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const openModal = (task = null) => {
    setEditingTask(task);
    setForm(task || { title: "", dueDate: "", notes: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setForm({ title: "", dueDate: "", notes: "" });
  };

  const saveTask = () => {
    if (!form.title.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...form } : t));
    } else {
      const newTask = {
        id: Date.now(),
        title: form.title,
        notes: form.notes,
        dueDate: form.dueDate || null,
        status: STATUS.TODO,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
    }
    closeModal();
  };

  const toggleComplete = id => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, status: t.status === STATUS.TODO ? STATUS.COMPLETED : STATUS.TODO }
        : t
    ));
  };

  const deleteTask = id => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "today") return isToday(new Date(task.dueDate));
    if (filter === "upcoming") return task.dueDate && isFuture(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
    if (filter === "completed") return task.status === STATUS.COMPLETED;
    return true;
  });

  // Drag & Drop
  const onDragEnd = result => {
    if (!result.destination) return;
    const items = Array.from(filteredTasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    // Cập nhật lại thứ tự toàn bộ (nếu muốn lưu thứ tự thì thêm field order)
    setTasks(prev => {
      const newTasks = prev.filter(t => !filteredTasks.find(ft => ft.id === t.id));
      return [...newTasks, ...items];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto p-6 lg:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-3">Tasks</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {filteredTasks.length} tasks • {tasks.filter(t => t.status === STATUS.COMPLETED).length} completed
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["all", "today", "upcoming", "completed"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab === "all" && "All"}
              {tab === "today" && "Today"}
              {tab === "upcoming" && "Upcoming"}
              {tab === "completed" && "Completed"}
            </button>
          ))}
        </div>

        {/* Task List */}
        <motion.div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                draggable
                onDragEnd={e => onDragEnd({ ...e, source: { index }, destination: { index } })}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 group"
              >
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition" />

                <button onClick={() => toggleComplete(task.id)}>
                  {task.status === STATUS.COMPLETED ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition" />
                  )}
                </button>

                <div className="flex-1">
                  <h3 className={`font-medium text-lg ${task.status === STATUS.COMPLETED ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}>
                    {task.title}
                  </h3>
                  {task.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.notes}</p>}
                  {task.dueDate && (
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                      isPast(new Date(task.dueDate)) && task.status !== STATUS.COMPLETED
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30"
                    }`}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {format(new Date(task.dueDate), "dd/MM/yyyy")}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openModal(task)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-32 h-32 mx-auto mb-6" />
            <p className="text-xl text-gray-600 dark:text-gray-400">Chưa có task nào</p>
          </div>
        )}

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => openModal()}
          className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                {editingTask ? "Sửa Task" : "Thêm Task Mới"}
              </h2>

              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Tên task..."
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-5 py-4 text-lg rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                />

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none"
                />

                <textarea
                  rows={4}
                  placeholder="Ghi chú (tùy chọn)..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none resize-none"
                />

                <div className="flex gap-4 justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={saveTask}
                    className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg transition"
                  >
                    {editingTask ? "Cập nhật" : "Thêm Task"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}