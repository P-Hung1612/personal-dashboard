// src/pages/Productivity/Tasks.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  GripVertical,
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

  // Load & Save localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lifeos-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.error("Lỗi load tasks:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lifeos-tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Lỗi save tasks:", e);
    }
  }, [tasks]);

  const openModal = (task = null) => {
    setEditingTask(task);
    setForm(
      task
        ? { title: task.title, dueDate: task.dueDate || "", notes: task.notes || "" }
        : { title: "", dueDate: "", notes: "" }
    );
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
      setTasks(tasks.map(t =>
        t.id === editingTask.id
          ? { ...t, ...form, title: form.title.trim(), notes: form.notes.trim() }
          : t
      ));
    } else {
      const newTask = {
        id: Date.now(),
        title: form.title.trim(),
        notes: form.notes.trim(),
        dueDate: form.dueDate || null,
        status: STATUS.TODO,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
    }
    closeModal();
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, status: t.status === STATUS.TODO ? STATUS.COMPLETED : STATUS.TODO }
        : t
    ));
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.status === STATUS.COMPLETED;
    if (filter === "today" && task.dueDate) return isToday(new Date(task.dueDate));
    if (filter === "upcoming" && task.dueDate) return isFuture(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
    if (filter === "all") return true;
    return task.status === STATUS.TODO;
  });

  const completedCount = tasks.filter(t => t.status === STATUS.COMPLETED).length;

  return (
    <>
      {/* HEADER CODE TAY – ĐẸP NHƯ ANALYTICS, OVERVIEW, DAILYREVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-white p-8 lg:p-14"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <CheckCircle2 className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl" />
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                Tasks
              </h1>
              <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                {filteredTasks.length} nhiệm vụ đang chờ • {completedCount} đã hoàn thành
              </p>
            </div>
          </div>
          <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
            Tập trung vào những gì quan trọng nhất. Hoàn thành từng việc một – bạn đang tiến rất gần đến mục tiêu!
          </p>
        </div>
      </motion.div>

      {/* Nội dung chính */}
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

        {/* Filter Tabs – đẹp hơn nữa */}
        <div className="flex flex-wrap gap-4">
          {[
            { key: "all", label: "Tất cả" },
            { key: "today", label: "Hôm nay" },
            { key: "upcoming", label: "Sắp tới" },
            { key: "completed", label: "Đã hoàn thành" },
          ].map(({ key, label }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(key)}
              className={`relative px-7 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg ${filter === key
                ? "bg-white text-indigo-700 dark:bg-gray-800 dark:text-white shadow-indigo-500/30"
                : "bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white hover:bg-white/20 border border-white/20"
                }`}
            >
              {label}
              {filter === key && (
                <motion.span
                  layoutId="filterBubble"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-5">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-5 group transition-all duration-300 hover:shadow-xl"
              >
                <GripVertical className="w-6 h-6 text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition" />

                <button onClick={() => toggleComplete(task.id)} className="shrink-0">
                  {task.status === STATUS.COMPLETED ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <Circle className="w-8 h-8 text-gray-400 hover:text-indigo-600 transition" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-semibold ${task.status === STATUS.COMPLETED ? "line-through text-gray-500" : "text-gray-900 dark:text-white"}`}>
                    {task.title}
                  </h3>
                  {task.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{task.notes}</p>
                  )}
                  {task.dueDate && (
                    <span className={`inline-flex items-center gap-2 mt-3 text-xs px-4 py-2 rounded-full font-medium ${isPast(new Date(task.dueDate)) && task.status !== STATUS.COMPLETED
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30"
                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30"
                      }`}>
                      <Calendar className="w-4 h-4" />
                      {format(new Date(task.dueDate), "dd 'tháng' MM, yyyy")}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openModal(task)}
                    className="p-3 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition"
                  >
                    <Edit2 className="w-5 h-5 text-indigo-600" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-24">
            <div className="w-40 h-40 mx-auto mb-8 bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-3xl" />
            <p className="text-2xl font-medium text-gray-600 dark:text-gray-400">
              {filter === "completed" ? "Chưa hoàn thành task nào" : "Chưa có task nào ở đây"}
            </p>
            <p className="text-gray-500 mt-3">
              {filter === "all" && "Bắt đầu bằng cách thêm một nhiệm vụ mới!"}
            </p>
          </div>
        )}

        {/* Floating Add Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => openModal()}
          className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center text-white z-10 hover:shadow-3xl transition-all"
        >
          <Plus className="w-10 h-10" />
        </motion.button>

        {/* Modal – đẹp hơn, đồng bộ */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {editingTask ? "Sửa Task" : "Thêm Task Mới"}
                  </h2>
                  <button onClick={closeModal} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <input
                    type="text"
                    placeholder="Tên task..."
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none text-lg font-medium"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none text-lg"
                  />
                  <textarea
                    rows={4}
                    placeholder="Ghi chú (tùy chọn)..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-indigo-500 focus:outline-none resize-none text-base"
                  />

                  <div className="flex gap-4 justify-end pt-6">
                    <button
                      onClick={closeModal}
                      className="px-8 py-4 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-lg transition"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={saveTask}
                      className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all"
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
    </>
  );
}