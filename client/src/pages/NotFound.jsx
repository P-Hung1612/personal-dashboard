export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-gray-500 mb-8">Trang bạn tìm không tồn tại</p>
            <a
                href="/"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Về trang chủ
            </a>
        </div>
    );
}
