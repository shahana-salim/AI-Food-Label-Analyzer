import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../services/api";
import AnalysisResult from "./AnalysisResult";

function UploadCard() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(
        "Reading your food label..."
    );
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {

        if (!loading) return;

        const messages = [
            "Reading your food label...",
            "Extracting ingredients...",
            "Analyzing the food information...",
            "Preparing your results..."
        ];

        let index = 0;

        setLoadingMessage(messages[0]);

        const interval = setInterval(() => {

            index = (index + 1) % messages.length;

            setLoadingMessage(messages[index]);

        }, 3000);

        return () => clearInterval(interval);

    }, [loading]);
    const isLoggedIn = !!localStorage.getItem("access_token");
    const handleFileChange = (event) => {

        const files = Array.from(event.target.files);

        if (files.length === 0) return;

        // Anonymous users → only one image
        if (!isLoggedIn) {

            setSelectedImages([files[0]]);
            setPreviews([URL.createObjectURL(files[0])]);
            return;
        }

        // Logged-in users → append images (maximum 3)

        const updatedImages = [...selectedImages, ...files];

        if (updatedImages.length > 3) {
            alert("You can upload a maximum of 3 images.");
            return;
        }

        setSelectedImages(updatedImages);

        setPreviews(
            updatedImages.map(file => URL.createObjectURL(file))
        );
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);

        if (files.length === 0) {
            return;
        }

        handleFileChange({
            target: {
                files: files,
            },
        });
    };
    const removeImage = (index) => {

        const updatedImages = selectedImages.filter(
            (_, i) => i !== index
        );

        const updatedPreviews = previews.filter(
            (_, i) => i !== index
        );

        setSelectedImages(updatedImages);
        setPreviews(updatedPreviews);

        if (updatedImages.length === 0) {
            document.getElementById("food-label-input").value = "";
        }

    };

    const handleAnalyze = async () => {
        if (selectedImages.length === 0) return;

        setLoading(true);
        setError("");
        setAnalysisResult(null);

        try {
            const formData = new FormData();

            selectedImages.forEach((image) => {
                formData.append("images", image);
            });

            const token = localStorage.getItem("access_token");

            const headers = {
                "Content-Type": "multipart/form-data",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await api.post(
                "upload-label/",
                formData,
                {
                    headers,
                }
            );

            setAnalysisResult(response.data);
            console.log(response.data);

        } catch (err) {
            console.error(err);

            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Failed to analyze image. Please try again.");
            }

            setAnalysisResult(null);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="bg-white rounded-2xl shadow-md p-8 mt-8" >

                <div className="text-center">

                    <h2 className="text-3xl font-bold text-slate-800 mb-3">
                        Start Your Analysis
                    </h2>

                    <p className="text-gray-500 text-base mb-8">
                        {isLoggedIn ? (
                            "Upload up to 3 images for a more complete and accurate AI analysis."
                        ) : (
                            <>
                                <span className="block">
                                    Upload a single image for quick AI analysis.
                                </span>

                                <span className="block mt-2.5">
                                    Sign in to upload up to 3 images for more accurate results.
                                </span>
                            </>
                        )}
                    </p>

                </div>
                <input
                    type="file"
                    multiple={isLoggedIn}
                    id="food-label-input"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {previews.length === 0 ? (

                    <div onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="
                       mt-8
                       border-2
                       border-dashed
                       border-emerald-400
                       rounded-2xl
                       p-12
                       text-center
                       hover:bg-emerald-50
                       transition
                       cursor-pointer
        "
                    >

                        <FaCloudUploadAlt className="text-6xl text-emerald-600 mx-auto mb-6" />

                        <h3 className="text-2xl font-semibold text-slate-700">
                            Drag & Drop Your Image
                        </h3>

                        <p className="text-slate-500 mt-3">
                            or click the button below to browse files
                        </p>

                        <button
                            onClick={() =>
                                document.getElementById("food-label-input").click()
                            }
                            className="
                           mt-8
                           bg-emerald-600
                           hover:bg-emerald-700
                           text-white
                           px-8
                           py-3
                           rounded-xl
                           transition
                        "
                        >
                            Browse Files
                        </button>

                        <p className="text-gray-400 mt-8">
                            Supported formats: JPG, JPEG, PNG
                        </p>

                    </div>

                ) : (

                    <div className="mt-8 bg-slate-50 rounded-2xl p-8 text-center shadow-inner">
                        {isLoggedIn && (
                            <h3 className="text-lg font-semibold text-slate-700 mb-6">
                                Images Selected ({selectedImages.length}/3)
                            </h3>
                        )}

                        <div
                            className={
                                selectedImages.length === 1
                                    ? "flex justify-center"
                                    : selectedImages.length === 2
                                        ? "grid grid-cols-2 gap-4"
                                        : "grid grid-cols-1 md:grid-cols-3 gap-4"
                            }
                        >

                            {previews.map((preview, index) => (

                                <div key={index} className="text-center">

                                    <div className="relative inline-block">

                                        <button
                                            onClick={() => removeImage(index)}
                                            disabled={loading}
                                            className="
                                                absolute
                                                -top-3
                                                -right-3
                                                bg-red-500
                                                hover:bg-red-600
                                                text-white
                                                rounded-full
                                                w-8
                                                h-8
                                                flex
                                                items-center
                                                justify-center
                                                shadow-md
                                                z-10
                                                disabled:opacity-50
                                                disabled:cursor-not-allowed
                                            "
                                        >
                                            ×
                                        </button>

                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="rounded-xl shadow-md h-56 object-cover"
                                        />

                                    </div>

                                    <p className="mt-3 text-sm font-medium text-slate-700">
                                        {selectedImages[index].name}
                                    </p>

                                </div>

                            ))}

                        </div>

                        <p className="text-emerald-600 mt-6">
                            ✓ {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""} selected successfully
                        </p>

                        <div className="flex justify-center gap-4 mt-8 flex-wrap">


                            {(!isLoggedIn || selectedImages.length < 3) && (

                                <button
                                    onClick={() =>
                                        document.getElementById("food-label-input").click()
                                    }
                                    disabled={loading}
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        border
                                        border-slate-300
                                        hover:bg-slate-100
                                        transition
                                        disabled:bg-slate-100
                                        disabled:text-slate-400
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {isLoggedIn ? "Add Another Image" : "Choose Another"}
                                </button>

                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="
                                px-6
                                py-3
                                rounded-xl
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                transition
                                disabled:bg-emerald-400
                            "
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Analyzing...
                                    </span>
                                ) : (
                                    "Analyze Label"
                                )}
                            </button>
                        </div>
                        {loading && (
                            <div className="mt-5 text-center">
                                <p className="text-slate-700 font-medium">
                                    {loadingMessage}
                                </p>

                                <p className="text-sm text-slate-500 mt-1">
                                    This may take a minute. Please don't close or refresh the page.
                                </p>
                            </div>
                        )}

                    </div>

                )}

            </div>
            {error && (
                <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}
            {analysisResult && (
                <AnalysisResult analysis={analysisResult.analysis} />
            )}
        </>
    );
}


export default UploadCard;