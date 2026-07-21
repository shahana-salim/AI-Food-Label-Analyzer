import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

function UploadCard() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));
    };
    const handleRemove = () => {
        setSelectedImage(null);
        setPreview(null);

        document.getElementById("food-label-input").value = "";
    };
    return (
        <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

            <div className="text-center">

                <h2 className="text-3xl font-bold text-slate-800">
                    Start Your Analysis
                </h2>

                <p className="text-slate-500 mt-3">
                    Upload an image of a packaged food label to begin AI-powered analysis.
                </p>

            </div>
            <input
                type="file"
                id="food-label-input"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
            />

            {!preview ? (

                <div
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

                    <p className="text-sm text-slate-400 mt-6">
                        Supported formats: JPG, JPEG, PNG
                    </p>

                </div>

            ) : (

                <div className="mt-8 bg-slate-50 rounded-2xl p-8 text-center shadow-inner">

                    <img
                        src={preview}
                        alt="Food Label Preview"
                        className="mx-auto rounded-xl shadow-md max-h-72"
                    />

                    <h3 className="mt-6 text-xl font-semibold text-slate-800">
                        {selectedImage.name}
                    </h3>

                    <p className="text-emerald-600 mt-2">
                        ✓ Image selected successfully
                    </p>

                    <div className="flex justify-center gap-4 mt-8 flex-wrap">

                        <button
                            onClick={handleRemove}
                            className="
                                px-6
                                py-3
                                rounded-xl
                                bg-red-500
                                hover:bg-red-600
                                text-white
                                transition
                            "
                        >
                            Remove
                        </button>

                        <button
                            onClick={() =>
                                document.getElementById("food-label-input").click()
                            }
                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-slate-300
                                hover:bg-slate-100
                                transition
                            "
                        >
                            Choose Another
                        </button>

                        <button
                            className="
                               px-6
                               py-3
                               rounded-xl
                               bg-emerald-600
                               hover:bg-emerald-700
                               text-white
                               transition
                            "
                        >
                            Analyze Label
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}


export default UploadCard;