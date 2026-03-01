const StatCard = ({ title, value, icon: Icon, color, description }) => {
    const colorClasses = {
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        green: 'bg-green-600',
        orange: 'bg-orange-600',
        cyan: 'bg-cyan-600'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
                    {description && (
                        <p className="text-xs text-slate-500 mt-1">{description}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    )
}

export default StatCard
