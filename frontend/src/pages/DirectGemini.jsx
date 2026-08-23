import { useState } from "react";
import api from "../services/api";

function DirectGemini() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (!files.length) return;

        setSelectedImages(files);

        const previewUrls = files.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviews(previewUrls);

        setAnalysis(null);
        setError("");
    };

    const handleAnalyze = async () => {
        if (!selectedImages.length) return;

        setLoading(true);
        setAnalysis(null);
        setError("");

        try {
            const formData = new FormData();

            selectedImages.forEach((image) => {
                formData.append("images", image);
            });

            const token = localStorage.getItem("access_token");

            const response = await api.post(
                "direct-gemini-analysis/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setAnalysis(response.data.analysis);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.error ||
                "Failed to analyze image."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold text-slate-800">
                Direct Gemini Analysis
            </h1>

            <p className="text-slate-500 mt-2">
                Experimental page for testing Gemini image analysis without OCR.
            </p>

            <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                />

                {previews.length > 0 && (
                    <div className="mt-6">

                        <div className="flex flex-wrap gap-4 mt-6">

                            {previews.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Food Label ${index + 1}`}
                                    className="w-64 h-64 object-cover rounded-xl shadow"
                                />
                            ))}

                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="
                                mt-6
                                bg-emerald-600
                                hover:bg-emerald-700
                                disabled:bg-emerald-400
                                text-white
                                px-6
                                py-3
                                rounded-xl
                            "
                        >
                            {loading
                                ? "Analyzing..."
                                : "Analyze with Gemini"}
                        </button>

                    </div>
                )}

                {error && (
                    <p className="mt-6 text-red-600">
                        {error}
                    </p>
                )}

                {analysis && (
                    <div className="mt-8">
                        <pre className="bg-slate-100 p-5 rounded-xl overflow-auto">
                            {JSON.stringify(analysis, null, 2)}
                        </pre>
                    </div>
                )}

            </div>

        </div>
    );
}

export default DirectGemini;