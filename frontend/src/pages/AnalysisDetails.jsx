// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Breadcrumb from "../components/Breadcrumb";

// import api from "../services/api";
// import AnalysisResult from "../components/AnalysisResult";

// function AnalysisDetails() {
//     const { id } = useParams();

//     const [analysis, setAnalysis] = useState(null);
//     const [productName, setProductName] = useState("");

//     useEffect(() => {
//         const fetchAnalysis = async () => {
//             try {
//                 const token = localStorage.getItem("access_token");

//                 const response = await api.get(`history/${id}/`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 setAnalysis(response.data.analysis);
//                 setProductName(response.data.product_name);

//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchAnalysis();
//     }, [id]);

//     return (
//         <div className="p-8">
//             <Breadcrumb
//                 items={[
//                     { label: "Home", path: "/" },
//                     { label: "History", path: "/history" },
//                     { label: productName || "Analysis Details" },
//                 ]}
//             />

//             <AnalysisResult analysis={analysis} />

//         </div>
//     );
// }

// export default AnalysisDetails;




import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

import api from "../services/api";
import AnalysisResult from "../components/AnalysisResult";

function AnalysisDetails() {
    const { id } = useParams();

    const [analysis, setAnalysis] = useState(null);
    const [productName, setProductName] = useState("");

    const [alternatives, setAlternatives] = useState([]);
    const [loadingAlternatives, setLoadingAlternatives] = useState(false);
    const [alternativesLoaded, setAlternativesLoaded] = useState(false);
    const [alternativeError, setAlternativeError] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await api.get(`history/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAnalysis(response.data.analysis);
                setProductName(response.data.product_name);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAnalysis();
    }, [id]);

    const handleFindAlternatives = async () => {
        setLoadingAlternatives(true);
        setAlternativeError("");
        setAlternatives([]);

        try {
            const token = localStorage.getItem("access_token");

            const response = await api.get(`alternatives/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAlternatives(response.data.alternatives || []);
            setAlternativesLoaded(true);
        } catch (error) {
            console.error(error);

            setAlternativeError(
                error.response?.data?.error ||
                    "Unable to find alternatives right now. Please try again later."
            );

            setAlternativesLoaded(false);
        } finally {
            setLoadingAlternatives(false);
        }
    };

    const formatCategory = (categories) => {
        if (!categories || categories.length === 0) {
            return "";
        }

        const category = categories[0]
            .replace("en:", "")
            .replace(/-/g, " ");

        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <div className="p-8">
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "History", path: "/history" },
                    { label: productName || "Analysis Details" },
                ]}
            />

            <AnalysisResult analysis={analysis} />

            {/* Potential Alternatives */}
            <div className="mt-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">
                                Potential Alternatives
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Find other products related to this product
                                based on its category and your saved
                                preferences.
                            </p>
                        </div>

                        <button
                            onClick={handleFindAlternatives}
                            disabled={loadingAlternatives}
                            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingAlternatives
                                ? "Finding..."
                                : "Find Alternatives"}
                        </button>
                    </div>

                    {/* Loading */}
                    {loadingAlternatives && (
                        <div className="mt-8 flex flex-col items-center justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"></div>

                            <p className="mt-3 text-sm text-slate-500">
                                Searching for potential alternatives...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loadingAlternatives && alternativeError && (
                        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {alternativeError}
                        </div>
                    )}

                    {/* No alternatives */}
                    {!loadingAlternatives &&
                        alternativesLoaded &&
                        alternatives.length === 0 && (
                            <div className="mt-6 rounded-lg bg-slate-50 p-6 text-center">
                                <p className="text-sm text-slate-600">
                                    No suitable potential alternatives were
                                    found. Try checking your saved dietary
                                    preferences or analyzing another product.
                                </p>
                            </div>
                        )}

                    {/* Alternative Cards */}
                    {!loadingAlternatives && alternatives.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {alternatives.map((product, index) => {
                                const category = formatCategory(
                                    product.categories_tags
                                );

                                const calories =
                                    product.nutriments?.["energy-kcal_100g"];

                                return (
                                    <div
                                        key={
                                            product.code ||
                                            `${product.product_name}-${index}`
                                        }
                                        className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        {/* Product Image */}
                                        <div className="flex h-48 items-center justify-center bg-slate-50 p-4">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={
                                                        product.product_name ||
                                                        "Food product"
                                                    }
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                                                    No image available
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-5">
                                            <h3 className="line-clamp-2 text-base font-semibold text-slate-800">
                                                {product.product_name ||
                                                    "Unknown Product"}
                                            </h3>

                                            {product.brands && (
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {product.brands}
                                                </p>
                                            )}

                                            {category && (
                                                <div className="mt-3">
                                                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                        {category}
                                                    </span>
                                                </div>
                                            )}

                                            {calories !== undefined && (
                                                <p className="mt-3 text-sm text-slate-600">
                                                    {calories} kcal per 100g
                                                </p>
                                            )}

                                            {product.code && (
                                                <a
                                                    href={`https://world.openfoodfacts.org/product/${product.code}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                                                >
                                                    View Details
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnalysisDetails;