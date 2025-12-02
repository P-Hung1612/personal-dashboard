// src/App.jsx – PHIÊN BẢN CHẠY NGAY DẬN, KHÔNG LỖI DÙ FILE CHƯA TỒN TẠI
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/layout/MainLayout";

// Component fallback khi trang đang phát triển
const DevPage = ({ name }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">{name || "Trang này"}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Đang được phát triển...</p>
        <p className="mt-8 text-sm text-gray-500">Sắp ra mắt rất sớm!</p>
    </div>
);

// Lazy load tất cả các page – nếu file chưa tồn tại → tự động hiện DevPage
const Overview = lazy(() => import("./pages/Dashboard/Overview").catch(() => ({ default: () => <DevPage name="Overview" /> })));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics").catch(() => ({ default: () => <DevPage name="Analytics" /> })));
const DailyReview = lazy(() => import("./pages/Dashboard/DailyReview").catch(() => ({ default: () => <DevPage name="Daily Review" /> })));

const Tasks = lazy(() => import("./pages/Productivity/Tasks").catch(() => ({ default: () => <DevPage name="Tasks" /> })));
const Habits = lazy(() => import("./pages/Productivity/Habits").catch(() => ({ default: () => <DevPage name="Habits" /> })));
const Goals = lazy(() => import("./pages/Productivity/Goals").catch(() => ({ default: () => <DevPage name="Goals" /> })));
const Calendar = lazy(() => import("./pages/Productivity/Calendar").catch(() => ({ default: () => <DevPage name="Calendar" /> })));
const Focus = lazy(() => import("./pages/Productivity/Focus").catch(() => ({ default: () => <DevPage name="Focus Mode" /> })));

const Learning = lazy(() => import("./pages/Growth/Learning").catch(() => ({ default: () => <DevPage name="Learning" /> })));
const Journal = lazy(() => import("./pages/Growth/Journal").catch(() => ({ default: () => <DevPage name="Journal" /> })));
const Notes = lazy(() => import("./pages/Growth/Notes").catch(() => ({ default: () => <DevPage name="Notes" /> })));
const MoodTracker = lazy(() => import("./pages/Growth/MoodTracker").catch(() => ({ default: () => <DevPage name="Mood Tracker" /> })));

const Finance = lazy(() => import("./pages/Life/Finance").catch(() => ({ default: () => <DevPage name="Finance" /> })));
const Health = lazy(() => import("./pages/Life/Health").catch(() => ({ default: () => <DevPage name="Health" /> })));
const Relationships = lazy(() => import("./pages/Life/Relationships").catch(() => ({ default: () => <DevPage name="Relationships" /> })));
const Collections = lazy(() => import("./pages/Life/Collections").catch(() => ({ default: () => <DevPage name="Collections" /> })));

const Profile = lazy(() => import("./pages/System/Profile").catch(() => ({ default: () => <DevPage name="Profile" /> })));
const Settings = lazy(() => import("./pages/System/Settings").catch(() => ({ default: () => <DevPage name="Settings" /> })));

// const Login = lazy(() => import("./pages/Login-Register/Login").catch(() => ({ default: () => <DevPage name="Login" /> })));

export default function App() {
    return (
        <Router>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                    <div className="text-2xl font-medium text-indigo-600">Đang tải...</div>
                </div>
            }>
                <Routes>
                    {/* Tất cả trang chính đều có Sidebar */}
                    <Route element={<MainLayout />}>
                        {/* Dashboard */}
                        <Route path="/" element={<Overview />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/review" element={<DailyReview />} />

                        {/* Productivity */}
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/habits" element={<Habits />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/focus" element={<Focus />} />

                        {/* Growth */}
                        <Route path="/learning" element={<Learning />} />
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/notes" element={<Notes />} />
                        <Route path="/mood" element={<MoodTracker />} />

                        {/* Life */}
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/health" element={<Health />} />
                        <Route path="/relationships" element={<Relationships />} />
                        <Route path="/collections" element={<Collections />} />

                        {/* System */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />

                        {/* Login/Register */}
                        {/* <Route path="/login" element={<Login />} /> */}
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}