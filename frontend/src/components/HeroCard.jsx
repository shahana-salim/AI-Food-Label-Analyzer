import { FaLeaf, FaCheckCircle } from "react-icons/fa";

function HeroCard() {
    return (
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 rounded-2xl shadow-lg p-8 text-white">

            <div className="flex items-center gap-4">

                <div className="bg-white/20 p-4 rounded-full">
                    <FaLeaf className="text-4xl" />
                </div>

                <div>

                    <h1 className="text-4xl font-bold">
                        Welcome Back
                    </h1>

                    <p className="text-emerald-100 mt-2 text-lg">
                        Analyze packaged food labels with AI-powered insights.
                    </p>

                </div>

            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-3">

                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">

                    <FaCheckCircle className="text-xl" />

                    <span>Ingredient Analysis</span>

                </div>

                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">

                    <FaCheckCircle className="text-xl" />

                    <span>Nutrition Analysis</span>

                </div>

                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">

                    <FaCheckCircle className="text-xl" />

                    <span>Allergen Detection</span>

                </div>
                

            </div>

        </div>
    );
}

export default HeroCard;