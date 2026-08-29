
// import {
//     Sparkles,
//     Package,
//     Leaf,
//     FlaskConical,
//     TriangleAlert,
//     ChartColumn,
//     HeartPulse,
//     CircleCheckBig,
// } from "lucide-react";

// function AnalysisResult({ analysis }) {
//     if (!analysis) return null;

//     return (
//         <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

//             <div className="flex items-center gap-3 mb-8">
//                 <Sparkles className="text-emerald-600" size={34} />

//                 <h2 className="text-3xl font-bold text-slate-800">
//                     AI Analysis
//                 </h2>
//             </div>
//             {/* Personalized Health Assessment */}
//             {analysis.personalized_assessment && (
//                 <div className="mb-8">

//                     <div className="flex items-center gap-2 mb-5">
//                         <HeartPulse className="text-emerald-600" size={24} />

//                         <h3 className="text-2xl font-semibold text-slate-800">
//                             Personalized Health Assessment
//                         </h3>
//                     </div>

//                     <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">

//                         <p className="text-xl font-bold text-emerald-700 mb-2">
//                             {analysis.personalized_assessment.status}
//                         </p>

//                         <p className="text-slate-700 leading-relaxed mb-4">
//                             {analysis.personalized_assessment.summary}
//                         </p>

//                         {analysis.personalized_assessment.reasons?.length > 0 && (
//                             <div className="space-y-2">

//                                 {analysis.personalized_assessment.reasons.map(
//                                     (reason, index) => (
//                                         <div
//                                             key={index}
//                                             className="bg-white rounded-lg p-3 text-slate-700"
//                                         >
//                                             • {reason}
//                                         </div>
//                                     )
//                                 )}

//                             </div>
//                         )}

//                     </div>

//                 </div>
//             )}

//             {/* Product Name */}
//             <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-4">
//                     <Package className="text-emerald-600" size={24} />

//                     <h3 className="text-2xl font-semibold text-slate-800">
//                         Product Name
//                     </h3>
//                 </div>

//                 <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
//                     <p className="text-xl font-bold text-emerald-700">
//                         {analysis.product_name}
//                     </p>
//                 </div>
//             </div>

//             {/* Ingredients */}
//             <div className="mb-8">

//                 <div className="flex items-center gap-2 mb-5">
//                     <Leaf className="text-green-600" size={24} />

//                     <h3 className="text-2xl font-semibold text-slate-800">
//                         Ingredients
//                     </h3>
//                 </div>

//                 <div className="grid gap-4">

//                     {analysis.ingredients?.map((ingredient, index) => (

//                         <div
//                             key={index}
//                             className="
//                     rounded-xl
//                     border
//                     border-slate-200
//                     bg-white
//                     p-5
//                     shadow-sm
//                     hover:shadow-md
//                     transition
//                 "
//                         >

//                             <h4 className="text-lg font-semibold text-emerald-700">
//                                 {ingredient.name}
//                             </h4>

//                             <p className="text-slate-600 mt-2 leading-relaxed">
//                                 {ingredient.description}
//                             </p>

//                         </div>

//                     ))}

//                 </div>

//             </div>

//             {/* Additives */}
//             <div className="mb-8">

//                 <div className="flex items-center gap-2 mb-5">
//                     <FlaskConical className="text-purple-600" size={24} />

//                     <h3 className="text-2xl font-semibold text-slate-800">
//                         Additives
//                     </h3>
//                 </div>

//                 <div className="grid gap-5">

//                     {analysis.additives && analysis.additives.length > 0 ? (

//                         analysis.additives.map((additive, index) => (

//                             <div
//                                 key={index}
//                                 className="
//                     rounded-xl
//                     border
//                     border-purple-200
//                     bg-purple-50
//                     p-5
//                     shadow-sm
//                 "
//                             >

//                                 <h4 className="text-xl font-bold text-purple-700">
//                                     {additive.name}
//                                 </h4>

//                                 <div className="mt-4 space-y-3">

//                                     <div>
//                                         <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
//                                             Purpose
//                                         </p>

//                                         <p className="text-slate-700">
//                                             {additive.purpose}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
//                                             Health Note
//                                         </p>

//                                         <p className="text-slate-700">
//                                             {additive.health_note}
//                                         </p>
//                                     </div>

//                                 </div>

//                             </div>

//                         ))

//                     ) : (

//                         <p className="text-slate-500">
//                             No additives identified from the provided label.
//                         </p>

//                     )}

//                 </div>

//             </div>

//             {/* Allergens */}
//             <div className="mb-8">

//                 <div className="flex items-center gap-2 mb-5">
//                     <TriangleAlert className="text-orange-500" size={24} />

//                     <h3 className="text-2xl font-semibold text-slate-800">
//                         Common Allergens
//                     </h3>
//                 </div>

//                 <div className="flex flex-wrap gap-3">

//                     {analysis.allergens && analysis.allergens.length > 0 ? (

//                         analysis.allergens.map((allergen, index) => (

//                             <span
//                                 key={index}
//                                 className="
//                         px-4
//                         py-2
//                         rounded-full
//                         bg-orange-100
//                         border
//                         border-orange-200
//                         text-orange-700
//                         font-medium
//                     "
//                             >
//                                 {allergen}
//                             </span>

//                         ))

//                     ) : (

//                         <p className="text-slate-500">
//                             No allergens detected.
//                         </p>

//                     )}

//                 </div>

//             </div>

//             {/* Nutrition Summary */}
//             <div className="mb-8">

//                 <div className="flex items-center gap-2 mb-5">
//                     <ChartColumn className="text-blue-600" size={24} />

//                     <h3 className="text-2xl font-semibold text-slate-800">
//                         Nutrition Summary
//                     </h3>
//                 </div>

//                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">

//                     <p className="text-slate-700 leading-relaxed">
//                         {analysis.nutrition_summary || "Nutrition information not available."}
//                     </p>

//                 </div>

//             </div>
//             {/* Health Concerns */}
//             <div className="mb-8">

//                 <div className="flex items-center gap-2 mb-5">
//                     <HeartPulse className="text-red-500" size={24} />

//                     <h3 className="text-2xl font-semibold text-slate-800">
//                         Health Concerns
//                     </h3>
//                 </div>

//                 <div className="space-y-3">

//                     {analysis.health_concerns?.map((concern, index) => (

//                         <div
//                             key={index}
//                             className="
//                     bg-red-50
//                     border
//                     border-red-200
//                     rounded-xl
//                     p-4
//                 "
//                         >
//                             {concern}
//                         </div>

//                     ))}

//                 </div>

//             </div>

//             {/* Recommendations */}
//             <div>

//                 <div className="flex items-center gap-2 mb-5">
//                     <CircleCheckBig className="text-green-600" size={24} />

//                     <h3 className="text-2xl font-semibold text-slate-800">
//                         Recommendations
//                     </h3>
//                 </div>

//                 <div className="space-y-3">

//                     {analysis.recommendations?.map((recommendation, index) => (

//                         <div
//                             key={index}
//                             className="
//                     bg-green-50
//                     border
//                     border-green-200
//                     rounded-xl
//                     p-4
//                 "
//                         >
//                             {recommendation}
//                         </div>

//                     ))}

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default AnalysisResult;



import { useState } from "react";
import {
    Sparkles,
    Package,
    Leaf,
    FlaskConical,
    TriangleAlert,
    ChartColumn,
    HeartPulse,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

function AnalysisResult({ analysis }) {
    const [showIngredientInfo, setShowIngredientInfo] = useState(false);

    if (!analysis) return null;

    const assessment = analysis.personalized_assessment;

    return (
        <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

            {/* Title */}
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

            {/* Personalized Health Assessment */}
            {assessment && (
                <div className="mb-8">

                    <div className="flex items-center gap-2 mb-5">
                        <HeartPulse className="text-red-500" size={24} />

                        <h3 className="text-2xl font-semibold text-slate-800">
                            Personalized Health Assessment
                        </h3>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">

                        {/* Status */}
                        <div className="mb-4">
                            

                            <p className="text-2xl font-bold text-emerald-700">
                                {assessment.status}
                            </p>
                        </div>

                        {/* Summary */}
                        {assessment.summary && (
                            <p className="text-slate-700 leading-relaxed mb-5">
                                {assessment.summary}
                            </p>
                        )}

                        {/* Issues */}
                        {assessment.issues?.length > 0 && (
                            <div className="mb-5">

                                <p className="text-lg font-semibold text-slate-800 mb-3">
                                    Issues
                                </p>

                                <div className="space-y-2">

                                    {assessment.issues.map((issue, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-red-100 rounded-lg p-3 text-slate-700"
                                        >
                                            • {issue}
                                        </div>
                                    ))}

                                </div>

                            </div>
                        )}

                        {/* Recommendations */}
                        {assessment.recommendations?.length > 0 && (
                            <div>

                                <p className="text-lg font-semibold text-slate-800 mb-3">
                                    Recommendations
                                </p>

                                <div className="space-y-2">

                                    {assessment.recommendations.map(
                                        (recommendation, index) => (
                                            <div
                                                key={index}
                                                className="bg-white border border-green-100 rounded-lg p-3 text-slate-700"
                                            >
                                                • {recommendation}
                                            </div>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                </div>
            )}

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
                        {analysis.nutrition_summary ||
                            "Nutrition information not available."}
                    </p>

                </div>

            </div>

            {/* Ingredient Information Toggle */}
            <div>

                <button
                    onClick={() =>
                        setShowIngredientInfo(!showIngredientInfo)
                    }
                    className="
                        w-full
                        flex
                        items-center
                        justify-between
                        bg-slate-50
                        hover:bg-slate-100
                        border
                        border-slate-200
                        rounded-xl
                        p-5
                        transition
                    "
                >

                    <div className="flex items-center gap-3">

                        <Leaf className="text-green-600" size={24} />

                        <span className="text-xl font-semibold text-slate-800">
                            Ingredient Information
                        </span>

                    </div>

                    {showIngredientInfo ? (
                        <ChevronUp size={24} />
                    ) : (
                        <ChevronDown size={24} />
                    )}

                </button>

                {showIngredientInfo && (
                    <div className="mt-5 space-y-8">

                        {/* Ingredients */}
                        <div>

                            <div className="flex items-center gap-2 mb-5">
                                <Leaf
                                    className="text-green-600"
                                    size={24}
                                />

                                <h3 className="text-2xl font-semibold text-slate-800">
                                    Ingredients
                                </h3>
                            </div>

                            <div className="grid gap-4">

                                {analysis.ingredients?.length > 0 ? (
                                    analysis.ingredients.map(
                                        (ingredient, index) => (
                                            <div
                                                key={index}
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    bg-white
                                                    p-5
                                                    shadow-sm
                                                "
                                            >
                                                <h4 className="text-lg font-semibold text-emerald-700">
                                                    {ingredient.name}
                                                </h4>

                                                <p className="text-slate-600 mt-2 leading-relaxed">
                                                    {ingredient.description}
                                                </p>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="text-slate-500">
                                        Ingredient information not available.
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Additives */}
                        <div>

                            <div className="flex items-center gap-2 mb-5">
                                <FlaskConical
                                    className="text-purple-600"
                                    size={24}
                                />

                                <h3 className="text-2xl font-semibold text-slate-800">
                                    Additives
                                </h3>
                            </div>

                            <div className="grid gap-5">

                                {analysis.additives?.length > 0 ? (
                                    analysis.additives.map(
                                        (additive, index) => (
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
                                        )
                                    )
                                ) : (
                                    <p className="text-slate-500">
                                        Additive information not available.
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Common Allergens */}
                        <div>

                            <div className="flex items-center gap-2 mb-5">
                                <TriangleAlert
                                    className="text-orange-500"
                                    size={24}
                                />

                                <h3 className="text-2xl font-semibold text-slate-800">
                                    Common Allergens
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-3">

                                {analysis.allergens &&
                                analysis.allergens.length > 0 ? (
                                    analysis.allergens.map(
                                        (allergen, index) => (
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
                                        )
                                    )
                                ) : (
                                    <p className="text-slate-500">
                                        No allergens detected.
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default AnalysisResult;