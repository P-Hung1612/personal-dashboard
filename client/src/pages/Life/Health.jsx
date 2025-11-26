// src/pages/Life/Health.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI NOTES, MOOD, FINANCE → ĐẸP KHÔNG THỂ CHỐNG CỰ!
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfWeek, addDays, subDays } from "date-fns";
import {
  Heart, Moon, Droplet, Footprints, Flame, Target, Sparkles,
  Plus, GlassWater, Trophy, TrendingUp, X, Activity
} from "lucide-react";

export default function Health() {
  const [weightLog, setWeightLog] = useState([]); // [{date, weight}]
  const [sleepLog, setSleepLog] = useState([]);   // [{date, hours}]
  const [waterLog, setWaterLog] = useState({});   // { "2025-04-05": 8 }
  const [stepsLog, setStepsLog] = useState({});   // { "2025-04-05": 12345 }
  const [dailyGoal, setDailyGoal] = useState({ water: 8, steps: 10000 });
  const [showWaterModal, setShowWaterModal] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayDate = new Date();

  // Load & Save
  useEffect(() => {
    try {
      const keys = ["weight", "sleep", "water", "steps", "goal"];
      keys.forEach(key => {
        const item = localStorage.getItem(`lifeos-health-${key}`);
        if (item) {
          const data = JSON.parse(item);
          if (key === "weight") setWeightLog(data);
          if (key === "sleep") setSleepLog(data);
          if (key === "water") setWaterLog(data);
          if (key === "steps") setStepsLog(data);
          if (key === "goal") setDailyGoal(data);
        }
      });
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lifeos-health-weight", JSON.stringify(weightLog));
      localStorage.setItem("lifeos-health-sleep", JSON.stringify(sleepLog));
      localStorage.setItem("lifeos-health-water", JSON.stringify(waterLog));
      localStorage.setItem("lifeos-health-steps", JSON.stringify(stepsLog));
      localStorage.setItem("lifeos-health-goal", JSON.stringify(dailyGoal));
    } catch (e) { console.error(e); }
  }, [weightLog, sleepLog, waterLog, stepsLog, dailyGoal]);

  const todayWater = waterLog[today] || 0;
  const todaySteps = stepsLog[today] || 0;
  const waterProgress = (todayWater / dailyGoal.water) * 100;
  const stepsProgress = Math.min((todaySteps / dailyGoal.steps) * 100, 100);

  // Tuần hiện tại (bắt đầu từ Thứ Hai)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), "yyyy-MM-dd"));

  const weekWater = weekDays.reduce((sum, d) => sum + (waterLog[d] || 0), 0);
  const weekSteps = weekDays.reduce((sum, d) => sum + (stepsLog[d] || 0), 0);

  // Chuỗi ngày đạt mục tiêu
  const waterStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (waterLog[date] >= dailyGoal.water) streak++;
      else if (i > 0) break;
    }
    return streak;
  })();

  const latestWeight = weightLog.sort((a, b) => b.date.localeCompare(a.date))[0]?.weight || "--";
  const avgSleepLast7 = sleepLog
    .filter(s => weekDays.includes(s.date))
    .reduce((a, b) => a + b.hours, 0) / 7 || 0;

  const addWater = () => {
    setWaterLog(prev => ({
      ...prev,
      [today]: (prev[today] || 0) + 1
    }));
  };

  const logWeight = () => {
    const current = weightLog.find(l => l.date === today)?.weight || "";
    const w = prompt("Cân nặng hôm nay (kg):", current || "65");
    if (w === null) return;
    const num = parseFloat(w);
    if (!isNaN(num) && num > 20 && num < 200) {
      setWeightLog(prev => [
        ...prev.filter(l => l.date !== today),
        { date: today, weight: num }
      ]);
    }
  };

  const logSleep = () => {
    const current = sleepLog.find(l => l.date === today)?.hours || "";
    const h = prompt("Ngủ bao nhiêu tiếng đêm qua?", current || "8");
    if (h === null) return;
    const num = parseFloat(h);
    if (!isNaN(num) && num >= 0 && num <= 24) {
      setSleepLog(prev => [
        ...prev.filter(l => l.date !== today),
        { date: today, hours: num }
      ]);
    }
  };

  const logSteps = () => {
    const s = prompt("Số bước chân hôm nay?", todaySteps.toString());
    if (s === null) return;
    const num = Number(s);
    if (!isNaN(num) && num >= 0) {
      setStepsLog(prev => ({ ...prev, [today]: num }));
    }
  };

  return (
    <>
      {/* HEADER – ĐỒNG BỘ CHUẨN LIFE OS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 dark:from-rose-900 dark:via-pink-900 dark:to-purple-900 text-white p-8 lg:p-14"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <Sparkles className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                Sức khỏe toàn diện
              </h1>
              <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                {todayWater}/{dailyGoal.water} ly • {todaySteps.toLocaleString()} bước • Chuỗi {waterStreak} ngày
              </p>
            </div>
          </div>
          <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
            Theo dõi giấc ngủ, nước, cân nặng, vận động – yêu thương bản thân mỗi ngày.
          </p>
        </div>
      </motion.div>

      <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">

        {/* MAIN METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cân nặng */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={logWeight}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-10 cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <Target className="w-14 h-14 text-rose-600" />
              <Activity className="w-8 h-8 text-rose-400 opacity-60" />
            </div>
            <p className="text-5xl font-extrabold text-gray-800 dark:text-white">{latestWeight}</p>
            <p className="text-2xl text-gray-600 dark:text-gray-400 mt-2">Cân nặng (kg)</p>
          </motion.div>

          {/* Giấc ngủ */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={logSleep}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-10 cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <Moon className="w-14 h-14 text-indigo-600" />
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">{avgSleepLast7.toFixed(1)}h</p>
                <p className="text-sm text-gray-500">tuần này</p>
              </div>
            </div>
            <p className="text-5xl font-extrabold text-gray-800 dark:text-white">
              {sleepLog.find(s => s.date === today)?.hours || "--"}
            </p>
            <p className="text-2xl text-gray-600 dark:text-gray-400 mt-2">Giờ ngủ đêm qua</p>
          </motion.div>

          {/* Nước */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => setShowWaterModal(true)}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-10 text-white shadow-2xl cursor-pointer relative overflow-hidden"
          >
            <Droplet className="w-16 h-16 mb-6 drop-shadow-lg" />
            <p className="text-5xl font-extrabold">{todayWater}<span className="text-5xl">/{dailyGoal.water}</span></p>
            <p className="text-xl opacity-90 mt-2">Ly nước hôm nay</p>
            <div className="h-5 bg-white/30 rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${waterProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white"
              />
            </div>
          </motion.div>

          {/* Bước chân */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={logSteps}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-10 text-white shadow-2xl cursor-pointer"
          >
            <Footprints className="w-16 h-16 mb-6 drop-shadow-lg" />
            <p className="text-5xl font-extrabold">{(todaySteps / 1000).toFixed(1)}k</p>
            <p className="text-xl opacity-90 mt-2">Bước chân hôm nay</p>
            <div className="mt-4 bg-white/30 rounded-full h-5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepsProgress}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
            {todaySteps >= dailyGoal.steps && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-2xl text-center"
              >
                Đạt mục tiêu!
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* STREAKS & WEEKLY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-10 text-white shadow-2xl text-center">
            <Flame className="w-20 h-20 mx-auto mb-4" />
            <p className="text-7xl font-extrabold">{waterStreak}</p>
            <p className="text-2xl opacity-90 mt-2">Chuỗi uống đủ nước</p>
          </motion.div>

          <motion.div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
            <GlassWater className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
            <p className="text-6xl font-extrabold text-cyan-600">{weekWater}</p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">Ly nước tuần này</p>
          </motion.div>

          <motion.div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
            <TrendingUp className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <p className="text-6xl font-extrabold text-emerald-600">{(weekSteps / 1000).toFixed(0)}k</p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">Bước chân tuần này</p>
          </motion.div>
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Weight Trend */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10"
          >
            <h3 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white">
              Xu hướng cân nặng (30 ngày)
            </h3>
            <div className="h-80 flex items-end justify-between gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
                const entry = weightLog.find(w => w.date === date);
                const height = entry ? Math.min((entry.weight / 100) * 100, 90) : 5;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.02 }}
                    className="flex-1 bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-xl relative group cursor-pointer"
                    title={entry ? `${format(new Date(date), "dd/MM")}: ${entry.weight}kg` : format(new Date(date), "dd/MM")}
                  >
                    {entry && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {entry.weight}kg
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Sleep Trend */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10"
          >
            <h3 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white">
              Giấc ngủ (30 ngày)
            </h3>
            <div className="h-80 flex items-end justify-between gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
                const entry = sleepLog.find(s => s.date === date);
                const hours = entry?.hours || 0;
                const color = hours >= 7 ? "from-emerald-500 to-teal-500" : hours >= 5 ? "from-yellow-500 to-orange-500" : "from-rose-500 to-red-600";
                const height = entry
                  ? Math.max(entry.hours * 11.11, 5)  // có dữ liệu → đúng tỷ lệ, tối thiểu 12%
                  : 5;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.02 }}
                    className={`flex-1 bg-gradient-to-t ${color} rounded-t-xl relative group cursor-pointer`}
                    title={entry ? `${format(new Date(date), "dd/MM")}: ${hours}h` : format(new Date(date), "dd/MM")}
                  >
                    {entry && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {hours}h
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* WATER MODAL */}
      <AnimatePresence>
        {showWaterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setShowWaterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-2xl w-full border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => setShowWaterModal(false)}
                className="absolute top-6 right-6 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
              >
                <X className="w-8 h-8" />
              </button>

              <h2 className="text-5xl lg:text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Uống nước nào!
              </h2>

              <div className="grid grid-cols-4 gap-8 mb-12">
                {Array.from({ length: dailyGoal.water }, (_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={addWater}
                    className="focus:outline-none disabled:cursor-not-allowed"
                    disabled={i > todayWater}
                  >
                    {i < todayWater ? (
                      <Droplet className="w-20 h-20 text-cyan-600 fill-cyan-600" />
                    ) : i === todayWater ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Droplet className="w-20 h-20 text-cyan-400 fill-cyan-400" />
                      </motion.div>
                    ) : (
                      <Droplet className="w-20 h-20 text-gray-300" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-5xl font-extrabold text-cyan-600">
                  {todayWater} / {dailyGoal.water} ly
                </p>
                {todayWater >= dailyGoal.water && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mt-8"
                  >
                    <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                    <p className="text-3xl font-bold text-green-600">
                      Tuyệt vời! Đã đủ nước hôm nay
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}