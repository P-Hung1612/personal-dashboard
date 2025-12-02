export default function Navbar() {
    return (
        <header className="h-14 bg-white shadow flex items-center justify-between px-6">
            <h1 className="text-2xl font-semibold">Life OS</h1>
            <div className="flex gap-3 items-center">
                <button className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Đăng nhập/Đăng ký
                </button>
            </div>
        </header>
    );
}
