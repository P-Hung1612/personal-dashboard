// src/pages/Productivity/Focus.jsx
// ĐÃ ĐỒNG BỘ HOÀN TOÀN VỚI TOÀN BỘ APP (Overview, Tasks, Habits, Goals, Calendar)
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Target, Coffee, Sun } from "lucide-react";
import Confetti from "react-confetti";

export default function Focus() {
    const [mode, setMode] = useState("pomodoro");
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);

    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    // Load & Save
    useEffect(() => {
        try {
            const saved = localStorage.getItem("lifeos-focus");
            if (saved) {
                const data = JSON.parse(saved);
                setCompletedPomodoros(data.completedPomodoros || 0);
            }
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("lifeos-focus", JSON.stringify({ completedPomodoros }));
        } catch (e) { console.error(e); }
    }, [completedPomodoros]);

    // Sound
    useEffect(() => {
        audioRef.current = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
        audioRef.current.volume = 0.6;
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

    const startTimer = () => setIsRunning(true);
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(getTimeForMode());
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(getTimeForMode());
        setIsRunning(false);
    };

    // Timer Logic
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        playSound();
                        setIsRunning(false);

                        if (mode === "pomodoro") {
                            const newCount = completedPomodoros + 1;
                            setCompletedPomodoros(newCount);
                            if (newCount % 4 === 0) {
                                switchMode("longBreak");
                                setShowConfetti(true);
                                setTimeout(() => setShowConfetti(false), 8000);
                            } else {
                                switchMode("shortBreak");
                            }
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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const progress = ((getTimeForMode() - timeLeft) / getTimeForMode()) * 100;

    const config = {
        pomodoro: { name: "Tập trung", color: "from-red-600 to-pink-600", icon: Target },
        shortBreak: { name: "Nghỉ ngắn", color: "from-green-600 to-emerald-600", icon: Coffee },
        longBreak: { name: "Nghỉ dài", color: "from-blue-600 to-cyan-600", icon: Sun },
    }[mode];

    const Icon = config.icon;

    return (
        <>
            {showConfetti && <Confetti recycle={false} numberOfPieces={400} gravity={0.08} />}

            {/* HEADER – ĐỒNG BỘ HOÀN TOÀN */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 dark:from-red-900 dark:via-pink-900 dark:to-purple-900 text-white p-8 lg:p-14"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <Flame className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl animate-pulse" />
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Focus Timer
                            </h1>
                            <p className="text-xl lg:text-2xl opacity-95 mt-3 font-medium">
                                {completedPomodoros} Pomodoro hoàn thành hôm nay
                            </p>
                        </div>
                    </div>
                    <p className="text-lg lg:text-xl opacity-90 max-w-4xl ml-24">
                        Tập trung 25 phút – Nghỉ ngơi – Lặp lại. Bí quyết của những người thành công nhất.
                    </p>
                </div>
            </motion.div>

            {/* NỘI DUNG CHÍNH – ĐỒNG BỘ HOÀN TOÀN */}
            <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
                <div className="w-full max-w-2xl space-y-12">

                    {/* Timer Circle */}
                    <div className="relative flex justify-center">
                        <svg className="w-80 h-80 lg:w-96 lg:h-96 -rotate-90">
                            <circle
                                cx="50%" cy="50%" r="42%"
                                stroke="rgba(156, 163, 175, 0.2)"
                                strokeWidth="28"
                                fill="none"
                                className="dark:stroke-gray-700"
                            />
                            <motion.circle
                                cx="50%" cy="50%" r="42%"
                                stroke="url(#gradient)"
                                strokeWidth="28"
                                fill="none"
                                strokeDasharray={2 * Math.PI * (0.42 * 384)}
                                initial={{ strokeDashoffset: 2 * Math.PI * (0.42 * 384) }}
                                animate={{ strokeDashoffset: 2 * Math.PI * (0.42 * 384) * (1 - progress / 100) }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Content inside circle */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Icon
                                className="w-18 h-18 lg:w-20 lg:h-20 
                       text-gray-900 dark:text-white 
                       drop-shadow-xl mb-6"
                            />

                            <motion.div
                                key={timeLeft}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                {/* Timer text */}
                                <div
                                    className="
                    text-5xl lg:text-6xl font-extrabold 
                    text-gray-900 dark:text-white 
                    drop-shadow-2xl
                "
                                >
                                    {formatTime(timeLeft)}
                                </div>

                                {/* Mode name */}
                                <p
                                    className="
                    text-xl lg:text-2xl mt-4 font-medium 
                    text-gray-600 dark:text-gray-300
                "
                                >
                                    {config.name}
                                </p>
                            </motion.div>
                        </div>
                    </div>


                    {/* Control Buttons */}
                    <div className="flex justify-center items-center gap-8">

                        {/* Play / Pause */}
                        {isRunning ? (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={pauseTimer}
                                className="
                w-24 h-24 rounded-full shadow-2xl flex items-center justify-center 
                bg-gradient-to-br from-yellow-500 to-orange-600
            "
                            >
                                <Pause className="w-14 h-14 text-white drop-shadow" />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={startTimer}
                                className="
                w-28 h-28 rounded-full shadow-2xl flex items-center justify-center 
                bg-gradient-to-br from-green-500 to-emerald-600
            "
                            >
                                <Play className="w-16 h-16 text-white drop-shadow ml-2" />
                            </motion.button>
                        )}

                        {/* Reset button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={resetTimer}
                            className="
            w-20 h-20 rounded-full flex items-center justify-center
            backdrop-blur-xl shadow-lg
            bg-white/70 dark:bg-white/10
            border border-gray-200 dark:border-white/10
        "
                        >
                            <RotateCcw
                                className="
                w-10 h-10 
                text-gray-900 dark:text-white 
                drop-shadow
            "
                            />
                        </motion.button>

                        {/* Sound toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="
            w-20 h-20 rounded-full flex items-center justify-center
            backdrop-blur-xl shadow-lg
            bg-white/70 dark:bg-white/10
            border border-gray-200 dark:border-white/10
        "
                        >
                            {soundEnabled ? (
                                <Volume2
                                    className="
                    w-10 h-10
                    text-gray-900 dark:text-white 
                    drop-shadow
                "
                                />
                            ) : (
                                <VolumeX
                                    className="
                    w-10 h-10
                    text-gray-900 dark:text-white 
                    drop-shadow
                "
                                />
                            )}
                        </motion.button>

                    </div>


                    {/* Mode Selector */}
                    <div className="flex justify-center gap-6 flex-wrap">
                        {[
                            { key: "pomodoro", label: "Pomodoro", time: "25:00", color: "from-red-600 to-pink-600" },
                            { key: "shortBreak", label: "Nghỉ ngắn", time: "05:00", color: "from-green-600 to-emerald-600" },
                            { key: "longBreak", label: "Nghỉ dài", time: "15:00", color: "from-blue-600 to-cyan-600" },
                        ].map(m => (
                            <motion.button
                                key={m.key}
                                whileHover={{ y: -8, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => switchMode(m.key)}
                                className={`
                px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl
                ${mode === m.key
                                        ? `bg-gradient-to-r ${m.color} text-white shadow-2xl ring-4 ring-white/30 scale-110`
                                        : `bg-white/70 dark:bg-white/10 
                       backdrop-blur-xl 
                       border border-gray-200 dark:border-white/10 
                       text-gray-900 dark:text-white`
                                    }
            `}
                            >
                                <div>{m.label}</div>
                                <div className="
                text-sm 
                opacity-80 
                text-gray-700 dark:text-gray-300
            ">
                                    {m.time}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div
                            className="
            inline-flex items-center gap-6 
            px-8 py-8 rounded-3xl shadow-2xl
            backdrop-blur-xl 
            bg-white/70 dark:bg-white/10
            border border-gray-200 dark:border-white/10
        "
                        >
                            <Flame
                                className="
                w-20 h-20 
                text-orange-500 
                drop-shadow-lg
                dark:text-orange-400
            "
                            />

                            <div>
                                {/* Big number */}
                                <p
                                    className="
                    text-5xl lg:text-6xl font-extrabold 
                    text-gray-900 dark:text-white 
                    drop-shadow-2xl
                "
                                >
                                    {completedPomodoros}
                                </p>

                                {/* Label */}
                                <p
                                    className="
                    text-2xl font-medium
                    text-gray-700 dark:text-gray-300
                "
                                >
                                    Pomodoro hôm nay
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </>
    );
}