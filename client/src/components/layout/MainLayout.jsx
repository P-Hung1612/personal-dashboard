import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Outlet full màn hình */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}