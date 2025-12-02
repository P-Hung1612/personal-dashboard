// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useContext, createContext, useState, useEffect } from "react";
import MainLayout from "./components/layout/MainLayout";
import { useAuth, AuthProvider } from "./context/AuthContext.jsx";

// === COMPONENT KHI CHƯA LÀM XONG TRANG ===
const DevPage = ({ name }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">{name || "Trang này"}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Đang được phát triển...</p>
        <p className="mt-8 text-sm text-gray-500">Sắp ra mắt rất sớm!</p>
    </div>
);

// === LAZY LOAD + TỰ ĐỘNG HIỆN DevPage NẾU CHƯA TẠO FILE ===
const lazyWithDevFallback = (importFunc, pageName) =>
    lazy(() =>
        importFunc().catch(() => ({
            default: () => <DevPage name={pageName} />,
        }))
    );

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
const Settings = lazyWithDevFallback(() => import("./pages/System/Settings"), "Settings");
const LoginPage = lazyWithDevFallback(() => import("./pages/Auth/AuthPage"), "Login");

// === ROUTE BẢO VỆ ===
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl font-medium text-indigo-600">Đang tải...</div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
}

// === APP CHÍNH ===
export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                            <div className="text-2xl font-medium text-indigo-600">Đang tải trang...</div>
                        </div>
                    }
                >
                    <Routes>
                        {/* Trang Login */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Tất cả dashboard đều cần đăng nhập */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            }
                        >
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

                        {/* Redirect tất cả các đường dẫn lạ về home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}