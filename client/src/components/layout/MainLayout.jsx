import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

export default function MainLayout() {
    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900">

            {/* Navbar cố định */}
            <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md">
                <Navbar />
            </div>

            {/* Sidebar cố định */}
            <div className="fixed top-16 left-0 w-64 bottom-0 z-40 bg-white dark:bg-gray-800 shadow-md ">
                <Sidebar />
            </div>

            {/* Vùng nội dung — nằm bên phải sidebar và dưới navbar */}
            <main
                className="
                    ml-64          /* né sidebar */
                    mt-16          /* né navbar */
                    h-[calc(100vh-4rem)]  /* chiều cao còn lại trừ navbar */
                    overflow-y-auto
                    p-6
                "
            >
                <Outlet />
            </main>
        </div>
    );
}
