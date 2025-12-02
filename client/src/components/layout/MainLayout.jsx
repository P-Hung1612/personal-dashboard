import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

export default function MainLayout() {
    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            {/* <Navbar /> */}
            {/* <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
                <Navbar />
            </div> */}

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Outlet full màn hình */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}