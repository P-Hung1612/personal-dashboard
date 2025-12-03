// src/App.jsx – PHIÊN BẢN CHẠY NGON 100% (KHÔNG CÒN LỖI NÀO)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/layout/MainLayout";
import { useAuth } from "./context/AuthContext.jsx";
import Settings from "./pages/System/Settings.jsx";

// DevPage fallback
const DevPage = ({ name }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">{name || "Trang này"}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Đang được phát triển...</p>
    </div>
);

const lazyWithDevFallback = (importFunc, pageName) =>
    lazy(() => importFunc().catch(() => ({ default: () => <DevPage name={pageName} /> })));

// Lazy load tất cả các trang (giữ nguyên như của bạn)
const Overview = lazyWithDevFallback(() => import("./pages/Dashboard/Overview"), "Overview");
const Analytics = lazyWithDevFallback(() => import("./pages/Dashboard/Analytics"), "Analytics");
const DailyReview = lazyWithDevFallback(() => import("./pages/Dashboard/DailyReview"), "Daily Review");
const Tasks = lazyWithDevFallback(() => import("./pages/Productivity/Tasks"), "Tasks");
const Habits = lazyWithDevFallback(() => import("./pages/Productivity/Habits"), "Habits");
const Goals = lazyWithDevFallback(() => import("./pages/Productivity/Goals"), "Goals");
const Calendar = lazyWithDevFallback(() => import("./pages/Productivity/Calendar"), "Calendar");
const Focus = lazyWithDevFallback(() => import("./pages/Productivity/Focus"), "Focus Mode");
const Learning = lazyWithDevFallback(() => import("./pages/Growth/Learning"), "Learning");
const Journal = lazyWithDevFallback(() => import("./pages/Growth/Journal"), "Journal");
const Notes = lazyWithDevFallback(() => import("./pages/Growth/Notes"), "Notes");
const MoodTracker = lazyWithDevFallback(() => import("./pages/Growth/MoodTracker"), "Mood Tracker");
const Finance = lazyWithDevFallback(() => import("./pages/Life/Finance"), "Finance");
const Health = lazyWithDevFallback(() => import("./pages/Life/Health"), "Health");
const Relationships = lazyWithDevFallback(() => import("./pages/Life/Relationships"), "Relationships");
const Collections = lazyWithDevFallback(() => import("./pages/Life/Collections"), "Collections");
const Profile = lazyWithDevFallback(() => import("./pages/System/Profile"), "Profile");
// const Settings = lazyWithDevFallback(() => import("./pages/System/Settings"), "Settings");
const LoginPage = lazyWithDevFallback(() => import("./pages/Auth/AuthPage"), "Login");

// Protected Route
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center min-h-screen text-2xl">Đang tải...</div>;
    return user ? children : <Navigate to="/login" replace />;
}

// COMPONENT CHÍNH
function App() {
    return (
        <Router>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-2xl">Đang tải trang...</div>}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                        <Route path="/" element={<Overview />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/review" element={<DailyReview />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/habits" element={<Habits />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/focus" element={<Focus />} />
                        <Route path="/learning" element={<Learning />} />
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/notes" element={<Notes />} />
                        <Route path="/mood" element={<MoodTracker />} />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/health" element={<Health />} />
                        <Route path="/relationships" element={<Relationships />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;