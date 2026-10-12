function About() {
    const features = [
        {
            title: "AI Food Label Analysis",
            description:
                "Understand ingredients and nutritional information from packaged food labels.",
        },
        {
            title: "Personalized Insights",
            description:
                "Identify food-related concerns based on your saved allergies, medical conditions, and dietary preferences.",
        },
        {
            title: "Product Comparison",
            description:
                "Compare two food products to understand their differences and suitability for your profile.",
        },
        {
            title: "Alternative Suggestions",
            description:
                "Explore alternative products that may better match your preferences and needs.",
        },
    ];

    return (
        <section
            id="about"
            className="w-full bg-slate-800 text-white py-12 px-8 md:px-16"
        >
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400 mb-2">
                        About Our Project
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        AI Food Label Analyzer
                    </h2>

                    <p className="text-slate-300 leading-7">
                        AI Food Label Analyzer helps users understand packaged
                        food labels through AI-powered ingredient analysis and
                        personalized insights. It considers saved allergies,
                        medical conditions, and dietary preferences to help users
                        make more informed food choices.
                    </p>
                </div>

                <h3 className="text-xl font-bold text-white mb-5">
                    What We Offer
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-slate-700 rounded-xl border border-slate-600 p-5"
                        >
                            <h4 className="font-semibold text-white mb-2">
                                {feature.title}
                            </h4>

                            <p className="text-sm text-slate-300 leading-6">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 border-t border-slate-600 pt-5">
                    <p className="text-sm text-slate-300">
                        This application provides informational assistance and
                        does not replace professional medical or dietary advice.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;