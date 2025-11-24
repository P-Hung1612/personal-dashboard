// src/pages/Productivity/Focus.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function Focus() {
    const [mode, setMode] = useState("pomodoro"); // pomodoro | shortBreak | longBreak
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    // Load từ localStorage
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-focus");
        if (saved) {
            const data = JSON.parse(saved);
            setCompletedPomodoros(data.completedPomodoros || 0);
        }
    }, []);

    // Save khi hoàn thành pomodoro
    useEffect(() => {
        localStorage.setItem("lifeos-focus", JSON.stringify({ completedPomodoros }));
    }, [completedPomodoros]);

    // Tạo âm thanh chuông
    useEffect(() => {
        audioRef.current = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
        audioRef.current.volume = 0.5;
    }, []);

    const playSound = () => {
        if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    const getTimeForMode = () => {
        switch (mode) {
            case "pomodoro": return 25 * 60;
            case "shortBreak": return 5 * 60;
            case "longBreak": return 15 * 60;
            default: return 25 * 60;
        }
    };

    const startTimer = () => {
        if (isRunning) return;
        setIsRunning(true);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(getTimeForMode());
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(getTimeForMode());
        setIsRunning(false);
    };

    // Timer logic
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        playSound();
                        setIsRunning(false);

                        if (mode === "pomodoro") {
                            setCompletedPomodoros(c => c + 1);
                            switchMode(completedPomodoros % 4 === 3 ? "longBreak" : "shortBreak");
                        } else {
                            switchMode("pomodoro");
                        }
                        return getTimeForMode();
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft, mode, completedPomodoros]);

    // Format thời gian
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const progress = ((getTimeForMode() - timeLeft) / getTimeForMode()) * 100;

    const getModeConfig = () => {
        switch (mode) {
            case "pomodoro":
                return { name: "Tập trung", color: "from-red-500 to-pink-500", icon: "Target" };
            case "shortBreak":
                return { name: "Nghỉ ngắn", color: "from-green-500 to-emerald-500", icon: "Coffee" };
            case "longBreak":
                return { name: "Nghỉ dài", color: "from-blue-500 to-cyan-500", icon: "Sun" };
        }
    };

    const config = getModeConfig();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-7xl font-bold text-gray-800 dark:text-white mb-4">
                        Focus Timer
                    </h1>
                    <p className="text-3xl text-gray-600 dark:text-gray-400">
                        {config.name} • {completedPomodoros} Pomodoro hôm nay
                    </p>
                </motion.div>

                {/* Timer Circle */}
                <div className="relative flex justify-center mb-16">
                    <svg className="w-96 h-96 transform -rotate-90">
                        <circle
                            cx="192"
                            cy="192"
                            r="180"
                            stroke="rgba(156, 163, 175, 0.3)"
                            strokeWidth="24"
                            fill="none"
                        />
                        <motion.circle
                            cx="192"
                            cy="192"
                            r="180"
                            stroke="url(#gradient)"
                            strokeWidth="24"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 180}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 180 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 180 * (1 - progress / 100) }}
                            transition={{ duration: 0.5 }}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Thời gian lớn */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            key={timeLeft}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="text-9xl font-bold text-gray-800 dark:text-white">
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-3xl mt-4 text-gray-600 dark:text-gray-400">
                                {mode === "pomodoro" ? "Tập trung nào!" : "Thư giãn đi"}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-8 mb-12">
                    {!isRunning ? (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={startTimer}
                            className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center"
                        >
                            <Play className="w-12 h-12 ml-2" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={pauseTimer}
                            className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center"
                        >
                            <Pause className="w-12 h-12" />
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={resetTimer}
                        className="w-20 h-20 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-xl flex items-center justify-center"
                    >
                        <RotateCcw className="w-10 h-10" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="w-20 h-20 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-xl flex items-center justify-center"
                    >
                        {soundEnabled ? <Volume2 className="w-10 h-10" /> : <VolumeX className="w-10 h-10" />}
                    </motion.button>
                </div>

                {/* Mode Selector */}
                <div className="flex justify-center gap-6">
                    {[
                        { key: "pomodoro", label: "Pomodoro 25p", color: "bg-red-500" },
                        { key: "shortBreak", label: "Nghỉ ngắn 5p", color: "bg-green-500" },
                        { key: "longBreak", label: "Nghỉ dài 15p", color: "bg-blue-500" },
                    ].map(m => (
                        <motion.button
                            key={m.key}
                            whileHover={{ y: -5 }}
                            onClick={() => switchMode(m.key)}
                            className={`px-10 py-6 rounded-2xl font-bold text-white shadow-xl transition-all ${mode === m.key
                                    ? `${m.color} shadow-2xl scale-110`
                                    : "bg-gray-300 dark:bg-gray-700 text-gray-600"
                                }`}
                        >
                            {m.label}
                        </motion.button>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex items-center gap-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-full px-12 py-8 shadow-2xl">
                        <div className="text-6xl">Fire</div>
                        <div>
                            <p className="text-5xl font-bold text-orange-500">{completedPomodoros}</p>
                            <p className="text-2xl text-gray-600 dark:text-gray-400">Pomodoro hôm nay</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}