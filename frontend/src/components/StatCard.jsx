function StatCard({ title, value, subtitle, icon }) {
    return (
        <div
            className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
                hover:shadow-xl
                transition-all
                duration-300
            "
        >
            <div className="flex items-center justify-between">

                <div>

                    <p className="text-slate-500 text-sm">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value}
                    </h2>

                    <p className="text-emerald-600 text-sm mt-2">
                        {subtitle}
                    </p>

                </div>

                <div className="text-4xl">
                    {icon}
                </div>

            </div>
        </div>
    );
}

export default StatCard;