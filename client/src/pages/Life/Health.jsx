// src/pages/Life/Health.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfWeek, addDays } from "date-fns";
import {
  Heart, Moon, Droplet, Footprints, Flame, Target,
  Plus, GlassWater, TrendingUp, TrendingDown, Trophy
} from "lucide-react";

export default function Health() {
  const [weightLog, setWeightLog] = useState([]);     // [{date, weight}]
  const [sleepLog, setSleepLog] = useState([]);       // [{date, hours}]
  const [waterLog, setWaterLog] = useState({});       // { "2025-04-05": 8 }
  const [stepsLog, setStepsLog] = useState({});       // { "2025-04-05": 12345 }
  const [dailyGoal, setDailyGoal] = useState({ water: 8, steps: 10000 });
  const [showWaterModal, setShowWaterModal] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  // Load
  useEffect(() => {
    const data = {
      weight: localStorage.getItem("lifeos-health-weight"),
      sleep: localStorage.getItem("lifeos-health-sleep"),
      water: localStorage.getItem("lifeos-health-water"),
      steps: localStorage.getItem("lifeos-health-steps"),
      goal: localStorage.getItem("lifeos-health-goal")
    };
    if (data.weight) setWeightLog(JSON.parse(data.weight));
    if (data.sleep) setSleepLog(JSON.parse(data.sleep));
    if (data.water) setWaterLog(JSON.parse(data.water));
    if (data.steps) setStepsLog(JSON.parse(data.steps));
    if (data.goal) setDailyGoal(JSON.parse(data.goal));
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem("lifeos-health-weight", JSON.stringify(weightLog));
    localStorage.setItem("lifeos-health-sleep", JSON.stringify(sleepLog));
    localStorage.setItem("lifeos-health-water", JSON.stringify(waterLog));
    localStorage.setItem("lifeos-health-steps", JSON.stringify(stepsLog));
    localStorage.setItem("lifeos-health-goal", JSON.stringify(dailyGoal));
  }, [weightLog, sleepLog, waterLog, stepsLog, dailyGoal]);

  const todayWater = waterLog[today] || 0;
  const todaySteps = stepsLog[today] || 0;
  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), "yyyy-MM-dd"));

  const weekWater = weekDays.reduce((sum, d) => sum + (waterLog[d] || 0), 0);
  const weekSteps = weekDays.reduce((sum, d) => sum + (stepsLog[d] || 0), 0);
  const waterStreak = weekDays.reverse().findIndex(d => !(waterLog[d] >= dailyGoal.water)) + 1;

  const addWater = () => {
    setWaterLog(prev => ({ ...prev, [today]: (prev[today] || 0) + 1 }));
  };

  const logWeight = () => {
    const w = prompt("Cân nặng hôm nay (kg):", weightLog.find(l => l.date === today)?.weight || "");
    if (w && !isNaN(w)) {
      setWeightLog(prev => {
        const filtered = prev.filter(l => l.date !== today);
        return [...filtered, { date: today, weight: Number(w) }];
      });
    }
  };

  const logSleep = () => {
    const h = prompt("Ngủ bao nhiêu tiếng hôm qua?", sleepLog.find(l => l.date === today)?.hours || "8");
    if (h && !isNaN(h)) {
      setSleepLog(prev => {
        const filtered = prev.filter(l => l.date !== today);
        return [...filtered, { date: today, hours: Number(h) }];
      });
    }
  };

  const logSteps = () => {
    const s = prompt("Số bước hôm nay?", todaySteps || "0");
    if (s && !isNaN(s)) {
      setStepsLog(prev => ({ ...prev, [today]: Number(s) }));
    }
  };

  const latestWeight = weightLog.sort((a, b) => b.date.localeCompare(a.date))[0]?.weight || 0;
  const avgSleep = sleepLog.length > 0
    ? (sleepLog.reduce((a, b) => a + b.hours, 0) / sleepLog.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:to-rose-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-6">
            <Heart className="w-16 h-16 text-rose-600" />
            Health Dashboard
          </h1>
          <p className="text-3xl text-gray-600 dark:text-gray-400">Yêu thương cơ thể – Sống trọn từng ngày</p>
        </motion.div>

        {/* Big Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div whileHover={{ scale: 1.05 }} onClick={logWeight}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-10 text-white shadow-2xl cursor-pointer">
            <Target className="w-14 h-14 mb-6" />
            <p className="text-6xl font-bold">{latestWeight || "--"} kg</p>
            <p className="text-2xl opacity-90">Cân nặng</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} onClick={logSleep}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-10 text-white shadow-2xl cursor-pointer">
            <Moon className="w-14 h-14 mb-6" />
            <p className="text-6xl font-bold">{avgSleep || "--"} h</p>
            <p className="text-2xl opacity-90">Giấc ngủ trung bình</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} onClick={() => setShowWaterModal(true)}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-10 text-white shadow-2xl cursor-pointer relative overflow-hidden">
            <Droplet className="w-14 h-14 mb-6" />
            <p className="text-6xl font-bold">{todayWater}/{dailyGoal.water}</p>
            <p className="text-2xl opacity-90">Ly nước hôm nay</p>
            <div className="absolute bottom-0 left-0 right-0 h-8 flex">
              {Array.from({ length: dailyGoal.water }, (_, i) => (
                <div key={i} className={`flex-1 ${i < todayWater ? "bg-white/50" : "bg-white/20"}`} />
              ))}
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} onClick={logSteps}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-10 text-white shadow-2xl cursor-pointer">
            <Footprints className="w-14 h-14 mb-6" />
            <p className="text-5xl font-bold">{(todaySteps || 0).toLocaleString()}</p>
            <p className="text-2xl opacity-90">Bước chân</p>
            <p className="text-lg opacity-80 mt-2">{todaySteps >= dailyGoal.steps ? "Đạt mục tiêu!" : `${dailyGoal.steps - todaySteps} còn lại`}</p>
          </motion.div>
        </div>

        {/* Stats + Streak */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <Flame className="w-12 h-12 text-orange-500 mb-4" />
            <p className="text-5xl font-bold text-orange-500">{waterStreak}</p>
            <p className="text-xl text-gray-600 dark:text-gray-400">Ngày uống đủ nước liên tiếp</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-5xl font-bold text-yellow-500">{weekWater}</p>
            <p className="text-xl text-gray-600 dark:text-gray-400">Ly nước tuần này</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <TrendingUp className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-5xl font-bold text-green-500">{weekSteps.toLocaleString()}</p>
            <p className="text-xl text-gray-600 dark:text-gray-400">Bước chân tuần này</p>
          </div>
        </div>

        {/* Weight & Sleep Trend */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <h3 className="text-3xl font-bold mb-6">Xu hướng cân nặng (30 ngày)</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = format(new Date(Date.now() - (29 - i) * 86400000), "yyyy-MM-dd");
                const entry = weightLog.find(w => w.date === date);
                const height = entry ? (entry.weight / 100) * 10 : 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}px` }}
                    className="flex-1 bg-gradient-to-t from-pink-500 to-rose-500 rounded-t-lg"
                    title={`${date}: ${entry?.weight || "-"} kg`}
                  />
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <h3 className="text-3xl font-bold mb-6">Giấc ngủ (30 ngày)</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = format(new Date(Date.now() - (29 - i) * 86400000), "yyyy-MM-dd");
                const entry = sleepLog.find(s => s.date === date);
                const height = entry ? entry.hours * 20 : 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}px` }}
                    className={`flex-1 rounded-t-lg ${entry?.hours >= 7 ? "bg-green-500" : "bg-purple-500"}`}
                    title={`${date}: ${entry?.hours || "-"} giờ`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Water Modal */}
      <AnimatePresence>
        {showWaterModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50"
            onClick={() => setShowWaterModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md">
              <h2 className="text-5xl font-bold text-center mb-10">Uống nước nào!</h2>
              <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => { addWater(); if (todayWater + 1 >= dailyGoal.water) setShowWaterModal(false); }}
                    className={`text-6xl ${i < todayWater ? "opacity-30" : ""}`}
                    disabled={i >= dailyGoal.water}
                  >
                    {i < todayWater ? "Droplet Full" : "Droplet Empty"}
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-3xl font-bold mt-8">{todayWater}/{dailyGoal.water} ly</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}