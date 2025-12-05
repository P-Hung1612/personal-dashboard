export default function ActivityItem({ icon: Icon, color, text, time }) {
    return (
        <div className="flex items-center gap-4">
            <div
                className={`p-2.5 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}
            >
                <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
            <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                    {text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {time}
                </p>
            </div>
        </div>
    );
}
