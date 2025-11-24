export default function Card({ title, desc }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    );
}
