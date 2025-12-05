import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { generateDemoData } from "../../services/data.api.js";
import { useNavigate } from "react-router-dom";

export default function InitData() {
    const { user } = useAuth();
    const { userData, refreshData, loading } = useData();

    const handleInit = async () => {
        await generateDemoData(user.email);
        await refreshData();
    };

    if (loading) return <p className="p-10 text-center">⏳ Loading...</p>;

    if (!userData) {
        return (
            <div className="p-10 text-center space-y-4">
                <h2 className="text-2xl font-bold">No Data Yet</h2>
                <p className="text-gray-600">
                    Nhấn nút bên dưới để sinh dữ liệu demo
                </p>
                <button
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:opacity-90"
                    onClick={handleInit}
                >
                    ✨ Generate Demo Data
                </button>
            </div>
        );
    }

    const { overview, tasks, notes, habits, goals, areas } = userData;

    return (
        <div className="p-10 max-w-5xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold">📊 Your Demo Dataset</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {Object.entries(overview).map(([key, val]) => (
                    <div
                        key={key}
                        className="bg-white p-5 rounded-2xl shadow border text-center"
                    >
                        <p className="text-sm uppercase text-gray-500">{key}</p>
                        <p className="text-3xl font-bold text-indigo-600">
                            {val}
                        </p>
                    </div>
                ))}
            </div>

            {/* CATEGORY PREVIEW */}
            <PreviewSection title="Tasks" items={tasks} />
            <PreviewSection title="Notes" items={notes} />
            <PreviewSection title="Habits" items={habits} field="name" />
            <PreviewSection title="Goals" items={goals} field="title" />
            <PreviewSection title="Areas" items={areas} field="name" />

            <div className="pt-10 flex gap-3">
                <button
                    className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:opacity-90"
                    onClick={refreshData}
                >
                    🔄 Refresh
                </button>

                <button
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:opacity-90"
                    onClick={handleInit}
                >
                    ✨ Re-Generate Data
                </button>
            </div>
        </div>
    );
}

function PreviewSection({ title, items, field = "title" }) {
    const navigate = useNavigate();
    const path = "/" + title.toLowerCase(); // auto convert Tasks → /tasks

    return (
        <div className="bg-white p-6 rounded-2xl shadow border">
            <div className="flex justify-between mb-3">
                <h2 className="font-semibold text-xl">{title}</h2>
                <span className="text-gray-500">
                    {items?.length || 0} items
                </span>
            </div>

            <ul className="text-gray-700 space-y-1 text-sm">
                {(items ?? []).slice(0, 5).map((i) => (
                    <li key={i.id} className="truncate">
                        • {i[field]}
                    </li>
                ))}

                {items?.length > 5 && (
                    <li
                        className="text-indigo-600 text-xs mt-2 cursor-pointer hover:underline"
                        onClick={() => navigate(path)}
                    >
                        ...View More
                    </li>
                )}
            </ul>
        </div>
    );
}
