
import {
    Sparkles,
    Package,
    Leaf,
    FlaskConical,
    TriangleAlert,
    ChartColumn,
    HeartPulse,
    CircleCheckBig,
} from "lucide-react";

function AnalysisResult({ analysis }) {
    if (!analysis) return null;

    return (
        <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-emerald-600" size={34} />

                <h2 className="text-3xl font-bold text-slate-800">
                    AI Food Label Analysis
                </h2>
            </div>

            {/* Product Name */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="text-emerald-600" size={24} />

                    <h3 className="text-2xl font-semibold text-slate-800">
                        Product Name
                    </h3>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xl font-bold text-emerald-700">
                        {analysis.product_name}
                    </p>
                </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-5">
                    <Leaf className="text-green-600" size={24} />

                    <h3 className="text-2xl font-semibold text-slate-800">
                        Ingredients
                    </h3>
                </div>

                <div className="grid gap-4">

                    {analysis.ingredients?.map((ingredient, index) => (

                        <div
                            key={index}
                            className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    hover:shadow-md
                    transition
                "
                        >

                            <h4 className="text-lg font-semibold text-emerald-700">
                                {ingredient.name}
                            </h4>

                            <p className="text-slate-600 mt-2 leading-relaxed">
                                {ingredient.description}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

            {/* Additives */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-5">
                    <FlaskConical className="text-purple-600" size={24} />

                    <h3 className="text-2xl font-semibold text-slate-800">
                        Additives
                    </h3>
                </div>

                <div className="grid gap-5">

                    {analysis.additives?.map((additive, index) => (

                        <div
                            key={index}
                            className="
                    rounded-xl
                    border
                    border-purple-200
                    bg-purple-50
                    p-5
                    shadow-sm
                "
                        >

                            <h4 className="text-xl font-bold text-purple-700">
                                {additive.name}
                            </h4>

                            <div className="mt-4 space-y-3">

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Purpose
                                    </p>

                                    <p className="text-slate-700">
                                        {additive.purpose}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Health Note
                                    </p>

                                    <p className="text-slate-700">
                                        {additive.health_note}
                                    </p>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* Allergens */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-5">
                    <TriangleAlert className="text-orange-500" size={24} />

                    <h3 className="text-2xl font-semibold text-slate-800">
                       Common Allergens
                    </h3>
                </div>

                <div className="flex flex-wrap gap-3">

                    {analysis.allergens && analysis.allergens.length > 0 ? (

                        analysis.allergens.map((allergen, index) => (

                            <span
                                key={index}
                                className="
                        px-4
                        py-2
                        rounded-full
                        bg-orange-100
                        border
                        border-orange-200
                        text-orange-700
                        font-medium
                    "
                            >
                                {allergen}
                            </span>

                        ))

                    ) : (

                        <p className="text-slate-500">
                            No allergens detected.
                        </p>

                    )}

                </div>

            </div>

            {/* Nutrition Summary */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-5">
                    <ChartColumn className="text-blue-600" size={24} />

                    <h3 className="text-2xl font-semibold text-slate-800">
                        Nutrition Summary
                    </h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">

                    <p className="text-slate-700 leading-relaxed">
                        {analysis.nutrition_summary || "Nutrition information not available."}
                    </p>

                </div>

            </div>
            {/* Health Concerns */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-5">
                    <HeartPulse className="text-red-500" size={24} />

                    <h3 className="text-2xl font-semibold text-slate-800">
                        Health Concerns
                    </h3>
                </div>

                <div className="space-y-3">

                    {analysis.health_concerns?.map((concern, index) => (

                        <div
                            key={index}
                            className="
                    bg-red-50
                    border
                    border-red-200
                    rounded-xl
                    p-4
                "
                        >
                            {concern}
                        </div>

                    ))}

                </div>

            </div>

            {/* Recommendations */}
            <div>

                <div className="flex items-center gap-2 mb-5">
                    <CircleCheckBig className="text-green-600" size={24} />

                    <h3 className="text-2xl font-semibold text-slate-800">
                        Recommendations
                    </h3>
                </div>

                <div className="space-y-3">

                    {analysis.recommendations?.map((recommendation, index) => (

                        <div
                            key={index}
                            className="
                    bg-green-50
                    border
                    border-green-200
                    rounded-xl
                    p-4
                "
                        >
                            {recommendation}
                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default AnalysisResult;