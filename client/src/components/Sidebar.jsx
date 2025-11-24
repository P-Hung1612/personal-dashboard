"use client";
import { useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu } from "lucide-react";
import { createPortal } from "react-dom";

export default function Sidebar() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSection, setOpenSection] = useState("Dashboard");
    const [hoverSection, setHoverSection] = useState(null);

    const triggerRefs = useRef({});

    const handleToggleSidebar = () => {
        setIsCollapsed(prev => !prev);
        setHoverSection(null);
    };

    // ICON EMOJI — FIXED
    const menu = [
        {
            section: "Dashboard",
            items: [
                { path: "/", label: "Overview", icon: "🏠" },
                { path: "/analytics", label: "Analytics", icon: "📊" },
                { path: "/review", label: "Daily Review", icon: "🔄" },
            ],
        },
        {
            section: "Productivity",
            items: [
                { path: "/tasks", label: "Tasks", icon: "📝" },
                { path: "/habits", label: "Habits", icon: "🌱" },
                { path: "/goals", label: "Goals", icon: "🎯" },
                { path: "/calendar", label: "Calendar", icon: "📅" },
                { path: "/focus", label: "Focus", icon: "⏱️" },
            ],
        },
        {
            section: "Growth",
            items: [
                { path: "/learning", label: "Learning", icon: "📚" },
                { path: "/journal", label: "Journal", icon: "✏️" },
                { path: "/notes", label: "Notes / Garden", icon: "🌿" },
                { path: "/mood", label: "Mood Tracker", icon: "🧠" },
            ],
        },
        {
            section: "Life",
            items: [
                { path: "/finance", label: "Finance", icon: "💰" },
                { path: "/health", label: "Health", icon: "❤️" },
                { path: "/relationships", label: "Relationships", icon: "🤝" },
                { path: "/collections", label: "Collections", icon: "📦" },
            ],
        },
        {
            section: "System",
            items: [
                { path: "/profile", label: "Profile", icon: "👤" },
                { path: "/settings", label: "Settings", icon: "⚙️" },
            ],
        },
    ];

    const user = {
        name: "Phuoc Hung",
        email: "phuochung@example.com",
        avatar: "https://i.pravatar.cc/100?img=12",
    };

    return (
        <>
            <motion.aside
                animate={{ width: isCollapsed ? 80 : 260 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-screen bg-white/80 border-r border-gray-200 p-4 flex flex-col justify-between relative z-50"
            >
                {/* HEADER */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold text-indigo-700">
                            {!isCollapsed && "Life OS"}
                        </h1>
                    </div>

                    <div className="space-y-6">
                        {menu.map((group) => (
                            <div key={group.section}>
                                {/* Khi mở rộng */}
                                {!isCollapsed && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setOpenSection(openSection === group.section ? "" : group.section)
                                            }
                                            className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-indigo-600 mb-2"
                                        >
                                            <span>{group.section}</span>
                                            <motion.span animate={{ rotate: openSection === group.section ? 90 : 0 }}>
                                                <ChevronRight size={14} />
                                            </motion.span>
                                        </button>

                                        <AnimatePresence>
                                            {openSection === group.section && (
                                                <motion.ul
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="space-y-1 pl-2"
                                                >
                                                    {group.items.map((item) => {
                                                        const isActive = location.pathname === item.path;
                                                        return (
                                                            <li key={item.path}>
                                                                <Link
                                                                    to={item.path}
                                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive
                                                                        ? "bg-indigo-100 text-indigo-600 font-medium"
                                                                        : "hover:bg-gray-100 text-gray-700"
                                                                        }`}
                                                                >
                                                                    <span className="text-lg">{item.icon}</span>
                                                                    <span>{item.label}</span>
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </>
                                )}

                                {/* Khi thu gọn */}
                                {isCollapsed && (
                                    <div
                                        ref={(el) => (triggerRefs.current[group.section] = el)}
                                        className="relative group"
                                    >
                                        {/* ICON */}
                                        <div
                                            className="flex flex-col items-center p-4 hover:bg-gray-100 rounded-xl cursor-pointer transition-all"
                                            onMouseEnter={() => setHoverSection(group.section)}
                                        >
                                            <span className="text-3xl">{group.items[0].icon}</span>
                                        </div>

                                        {/* CẦU NỐI — GIỮ HOVER KHI RÊ CHUỘT QUA */}
                                        <div
                                            className="absolute inset-y-0 left-full w-12 bg-transparent"
                                            onMouseEnter={() => setHoverSection(group.section)}
                                        />
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>

                {/* Collapse + avatar */}
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={handleToggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Menu size={22} />
                        </button>
                    </div>

                    <div
                        className={`flex items-center gap-3 border-t border-gray-200 pt-4 ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                        {!isCollapsed && (
                            <div>
                                <div className="text-sm font-medium">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* FLYOUT */}
            {isCollapsed &&
                hoverSection &&
                createPortal(
                    <motion.div
                        initial={{ opacity: 0, x: 30, scale: 0.94 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 30, scale: 0.94 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fixed left-20 z-[999999] pointer-events-none"
                        style={{
                            top: triggerRefs.current[hoverSection]?.getBoundingClientRect()?.top ?? 100,
                        }}
                        onMouseEnter={() => setHoverSection(hoverSection)}
                        onMouseLeave={() => setHoverSection(null)}
                    >
                        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-gray-200/60 pointer-events-auto min-w-72">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-5">
                                {hoverSection}
                            </h3>

                            <div className="space-y-2">
                                {menu
                                    .find((g) => g.section === hoverSection)
                                    ?.items.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setHoverSection(null)}
                                                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all ${isActive
                                                    ? "bg-indigo-100 text-indigo-600 font-semibold shadow-sm"
                                                    : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                <span className="text-2xl">{item.icon}</span>
                                                <span className="text-base">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    </motion.div>,
                    document.body
                )}
        </>
    );
}
