import { useState } from "react";
import api from "../services/api";
import Breadcrumb from "../components/Breadcrumb";


const getStatusClass = (status) => {
    if (status === "Suitable") {
        return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Caution") {
        return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
};


function Compare() {

    const [product1Image, setProduct1Image] =
        useState(null);

    const [product2Image, setProduct2Image] =
        useState(null);


    const [product1Preview, setProduct1Preview] =
        useState(null);

    const [product2Preview, setProduct2Preview] =
        useState(null);


    const [comparison, setComparison] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleImageChange = (
        event,
        productNumber
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image file."
            );

            return;
        }


        const previewUrl =
            URL.createObjectURL(file);


        setComparison(null);
        setError("");


        if (productNumber === 1) {

            setProduct1Image(file);
            setProduct1Preview(previewUrl);

        } else {

            setProduct2Image(file);
            setProduct2Preview(previewUrl);

        }

    };


    const removeImage = (productNumber) => {

        setComparison(null);
        setError("");


        if (productNumber === 1) {

            setProduct1Image(null);
            setProduct1Preview(null);

        } else {

            setProduct2Image(null);
            setProduct2Preview(null);

        }

    };


    const handleCompare = async () => {

        if (!product1Image || !product2Image) {

            setError(
                "Please upload images for both products."
            );

            return;
        }


        try {

            setLoading(true);
            setError("");
            setComparison(null);


            const formData =
                new FormData();


            formData.append(
                "product1_image",
                product1Image
            );


            formData.append(
                "product2_image",
                product2Image
            );


            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response =
                await api.post(
                    "compare-upload/",
                    formData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            setComparison(
                response.data
            );


        } catch (error) {

            console.error(
                "Comparison Error:",
                error.response?.data ||
                    error
            );


            setError(
                error.response?.data?.error ||
                    error.response?.data
                        ?.product1_error ||
                    error.response?.data
                        ?.product2_error ||
                    "Unable to compare the selected products."
            );


        } finally {

            setLoading(false);

        }

    };


    const getComparisonSummary = (
        product1,
        product2
    ) => {

        const assessment1 =
            product1.personalized_assessment ||
            {};


        const assessment2 =
            product2.personalized_assessment ||
            {};


        const statusScore = {

            Suitable: 3,

            Caution: 2,

            "Not Recommended": 1,

        };


        const score1 =
            statusScore[
                assessment1.status
            ] || 0;


        const score2 =
            statusScore[
                assessment2.status
            ] || 0;


        if (score1 > score2) {

            return {

                type: "winner",

                product: product1,

                message:
                    `${product1.product_name || "Product 1"} has a more favorable personalized suitability assessment than ${product2.product_name || "Product 2"}.`,

            };

        }


        if (score2 > score1) {

            return {

                type: "winner",

                product: product2,

                message:
                    `${product2.product_name || "Product 2"} has a more favorable personalized suitability assessment than ${product1.product_name || "Product 2"}.`,

            };

        }


        return {

            type: "equal",

            message:
                "Both products have the same personalized suitability status for your profile. Review the specific concerns below to understand their differences.",

        };

    };


    const comparisonSummary =
        comparison
            ? getComparisonSummary(
                  comparison.product1,
                  comparison.product2
              )
            : null;


    const renderIssues = (
        product
    ) => {

        const issues =
            product.personalized_assessment
                ?.issues || [];


        if (!issues.length) {

            return (
                <p className="text-sm text-slate-500">
                    No specific concerns identified.
                </p>
            );

        }


        return (

            <ul className="space-y-2">

                {issues.map(
                    (
                        issue,
                        index
                    ) => (

                        <li
                            key={index}
                            className="
                                text-sm
                                text-slate-600
                                flex
                                gap-2
                            "
                        >

                            <span className="text-red-500">
                                •
                            </span>

                            <span>
                                {issue}
                            </span>

                        </li>

                    )
                )}

            </ul>

        );

    };


    const renderAllergens = (
        product
    ) => {

        if (
            product.allergens?.length
        ) {

            return (

                <ul className="
                    list-disc
                    list-inside
                    text-slate-600
                    space-y-2
                ">

                    {product.allergens.map(
                        (
                            allergen,
                            index
                        ) => (

                            <li key={index}>
                                {allergen}
                            </li>

                        )
                    )}

                </ul>

            );

        }


        return (
            <p className="text-slate-500">
                None listed
            </p>
        );

    };


    return (

        <div className="p-8">

            {/* Breadcrumb */}

            <Breadcrumb
                items={[
                    {
                        label: "Home",
                        path: "/",
                    },

                    {
                        label:
                            "Compare Products",
                    },
                ]}
            />


            {/* Heading */}

            <h1 className="
                text-3xl
                font-bold
                text-slate-800
                mb-2
            ">
                Compare Products
            </h1>


            <p className="
                text-slate-500
                mb-8
            ">
                Upload two food products to compare
                their ingredients, nutrition, allergens,
                and personalized suitability.
            </p>


            {/* Error */}

            {error && (

                <div className="
                    bg-red-50
                    text-red-600
                    px-5
                    py-3
                    rounded-xl
                    mb-6
                ">
                    {error}
                </div>

            )}


            {/* Upload Sections */}

            <div className="
                grid
                md:grid-cols-2
                gap-6
            ">

                {/* Product 1 */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-6
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <h2 className="
                            text-xl
                            font-bold
                            text-slate-800
                        ">
                            Product 1
                        </h2>


                        {product1Image && (

                            <span className="
                                text-sm
                                font-semibold
                                text-emerald-600
                            ">
                                ✓ Ready
                            </span>

                        )}

                    </div>


                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                        mb-5
                    ">
                        Upload a clear image of the food package.
                    </p>


                    {product1Preview ? (

                        <div>

                            <img
                                src={
                                    product1Preview
                                }
                                alt="Product 1"
                                className="
                                    w-full
                                    h-72
                                    object-contain
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    p-2
                                "
                            />


                            <div className="
                                flex
                                gap-3
                                mt-4
                            ">

                                <label
                                    className="
                                        flex-1
                                        text-center
                                        bg-slate-100
                                        hover:bg-slate-200
                                        text-slate-700
                                        px-4
                                        py-2
                                        rounded-lg
                                        cursor-pointer
                                        transition
                                    "
                                >
                                    Replace Image

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event) =>
                                            handleImageChange(
                                                event,
                                                1
                                            )
                                        }
                                    />

                                </label>


                                <button
                                    type="button"
                                    onClick={() =>
                                        removeImage(1)
                                    }
                                    className="
                                        flex-1
                                        bg-red-50
                                        hover:bg-red-100
                                        text-red-600
                                        px-4
                                        py-2
                                        rounded-lg
                                        transition
                                    "
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ) : (

                        <label
                            className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                h-72
                                border-2
                                border-dashed
                                border-slate-300
                                rounded-xl
                                bg-slate-50
                                hover:bg-slate-100
                                cursor-pointer
                                transition
                            "
                        >

                            <div className="text-center">

                                <div className="
                                    text-4xl
                                    mb-3
                                ">
                                    📷
                                </div>


                                <p className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    Upload Product Image
                                </p>


                                <p className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                ">
                                    PNG, JPG or JPEG
                                </p>

                            </div>


                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) =>
                                    handleImageChange(
                                        event,
                                        1
                                    )
                                }
                            />

                        </label>

                    )}

                </div>


                {/* Product 2 */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-6
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <h2 className="
                            text-xl
                            font-bold
                            text-slate-800
                        ">
                            Product 2
                        </h2>


                        {product2Image && (

                            <span className="
                                text-sm
                                font-semibold
                                text-emerald-600
                            ">
                                ✓ Ready
                            </span>

                        )}

                    </div>


                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                        mb-5
                    ">
                        Upload a clear image of the food package.
                    </p>


                    {product2Preview ? (

                        <div>

                            <img
                                src={
                                    product2Preview
                                }
                                alt="Product 2"
                                className="
                                    w-full
                                    h-72
                                    object-contain
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    p-2
                                "
                            />


                            <div className="
                                flex
                                gap-3
                                mt-4
                            ">

                                <label
                                    className="
                                        flex-1
                                        text-center
                                        bg-slate-100
                                        hover:bg-slate-200
                                        text-slate-700
                                        px-4
                                        py-2
                                        rounded-lg
                                        cursor-pointer
                                        transition
                                    "
                                >
                                    Replace Image

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event) =>
                                            handleImageChange(
                                                event,
                                                2
                                            )
                                        }
                                    />

                                </label>


                                <button
                                    type="button"
                                    onClick={() =>
                                        removeImage(2)
                                    }
                                    className="
                                        flex-1
                                        bg-red-50
                                        hover:bg-red-100
                                        text-red-600
                                        px-4
                                        py-2
                                        rounded-lg
                                        transition
                                    "
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ) : (

                        <label
                            className="
                                flex
                                flex-col
                                items-center
                                justify-center
                                h-72
                                border-2
                                border-dashed
                                border-slate-300
                                rounded-xl
                                bg-slate-50
                                hover:bg-slate-100
                                cursor-pointer
                                transition
                            "
                        >

                            <div className="text-center">

                                <div className="
                                    text-4xl
                                    mb-3
                                ">
                                    📷
                                </div>


                                <p className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    Upload Product Image
                                </p>


                                <p className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                ">
                                    PNG, JPG or JPEG
                                </p>

                            </div>


                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) =>
                                    handleImageChange(
                                        event,
                                        2
                                    )
                                }
                            />

                        </label>

                    )}

                </div>

            </div>


            {/* Compare Button */}

            <div className="
                mt-8
                flex
                flex-col
                items-center
                gap-3
            ">

                <button
                    type="button"
                    onClick={handleCompare}
                    disabled={
                        !product1Image ||
                        !product2Image ||
                        loading
                    }
                    className="
                        bg-emerald-600
                        hover:bg-emerald-700
                        disabled:bg-slate-300
                        disabled:cursor-not-allowed
                        text-white
                        px-8
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                >
                    {loading
                        ? "Comparing..."
                        : "Compare Products"}
                </button>


                <p className="
                    text-sm
                    text-slate-500
                ">

                    {product1Image &&
                    product2Image
                        ? "Both products are ready to compare."
                        : "Upload both products to continue."}

                </p>

            </div>


            {/* Comparison Result */}

            {comparison && (

                <div className="mt-12">

                    {/* Personalized Comparison */}

                    {comparisonSummary && (

                        <div className="
                            bg-white
                            rounded-2xl
                            shadow-md
                            p-6
                            mb-8
                            border
                            border-slate-200
                        ">

                            <p className="
                                text-sm
                                font-semibold
                                text-emerald-600
                                uppercase
                                tracking-wide
                            ">
                                Personalized Comparison
                            </p>


                            <h2 className="
                                text-2xl
                                font-bold
                                text-slate-800
                                mt-2
                            ">
                                {comparisonSummary.type ===
                                "winner"
                                    ? "More suitable option"
                                    : "Same suitability level"}
                            </h2>


                            {/* Different Status */}

                            {comparisonSummary.type ===
                            "winner" ? (

                                <>

                                    <p className="
                                        text-xl
                                        font-semibold
                                        text-emerald-700
                                        mt-4
                                    ">
                                        {
                                            comparisonSummary
                                                .product
                                                .product_name ||
                                            "Product"
                                        }
                                    </p>


                                    <p className="
                                        text-slate-600
                                        mt-3
                                    ">
                                        {
                                            comparisonSummary
                                                .message
                                        }
                                    </p>


                                    <div className="
                                        grid
                                        md:grid-cols-2
                                        gap-4
                                        mt-6
                                    ">

                                        {[

                                            comparison.product1,

                                            comparison.product2,

                                        ].map(
                                            (
                                                product
                                            ) => (

                                                <div
                                                    key={
                                                        product
                                                            .id ||
                                                        product
                                                            .product_name
                                                    }
                                                    className="
                                                        bg-slate-50
                                                        rounded-xl
                                                        p-4
                                                    "
                                                >

                                                    <p className="
                                                        font-semibold
                                                        text-slate-800
                                                    ">
                                                        {
                                                            product
                                                                .product_name ||
                                                            "Product"
                                                        }
                                                    </p>


                                                    <span
                                                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                                                            product
                                                                .personalized_assessment
                                                                ?.status
                                                        )}`}
                                                    >
                                                        {
                                                            product
                                                                .personalized_assessment
                                                                ?.status ||
                                                            "Not Available"
                                                        }
                                                    </span>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </>

                            ) : (

                                /* Same Status */

                                <>

                                    <p className="
                                        text-slate-600
                                        mt-4
                                    ">
                                        {
                                            comparisonSummary
                                                .message
                                        }
                                    </p>


                                    <div className="mt-6">

                                        <h3 className="
                                            text-lg
                                            font-bold
                                            text-slate-800
                                            mb-4
                                        ">
                                            Personalized Concerns
                                        </h3>


                                        <div className="
                                            grid
                                            md:grid-cols-2
                                            gap-5
                                        ">

                                            {[

                                                comparison.product1,

                                                comparison.product2,

                                            ].map(
                                                (
                                                    product
                                                ) => (

                                                    <div
                                                        key={
                                                            product
                                                                .id ||
                                                            product
                                                                .product_name
                                                        }
                                                        className="
                                                            bg-slate-50
                                                            rounded-xl
                                                            p-5
                                                        "
                                                    >

                                                        <div className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                            gap-3
                                                        ">

                                                            <h4 className="
                                                                font-semibold
                                                                text-slate-800
                                                            ">
                                                                {
                                                                    product
                                                                        .product_name ||
                                                                    "Product"
                                                                }
                                                            </h4>


                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                                    product
                                                                        .personalized_assessment
                                                                        ?.status
                                                                )}`}
                                                            >
                                                                {
                                                                    product
                                                                        .personalized_assessment
                                                                        ?.status ||
                                                                    "Not Available"
                                                                }
                                                            </span>

                                                        </div>


                                                        <div className="mt-4">

                                                            {renderIssues(
                                                                product
                                                            )}

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                </>

                            )}


                            <p className="
                                text-sm
                                text-slate-500
                                mt-6
                            ">
                                The comparison is based on
                                your saved health and dietary
                                preferences and the information
                                available on the uploaded
                                product labels.
                            </p>

                        </div>

                    )}


                    {/* Allergens */}

                    <div className="mt-8">

                        <h3 className="
                            text-xl
                            font-bold
                            text-slate-800
                            mb-5
                        ">
                            Allergens
                        </h3>


                        <div className="
                            grid
                            md:grid-cols-2
                            gap-6
                        ">

                            {/* Product 1 Allergens */}

                            <div className="
                                bg-white
                                rounded-2xl
                                shadow-md
                                p-6
                            ">

                                <h4 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                    mb-4
                                ">
                                    {
                                        comparison.product1
                                            .product_name ||
                                        "Product 1"
                                    }
                                </h4>


                                {renderAllergens(
                                    comparison.product1
                                )}

                            </div>


                            {/* Product 2 Allergens */}

                            <div className="
                                bg-white
                                rounded-2xl
                                shadow-md
                                p-6
                            ">

                                <h4 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                    mb-4
                                ">
                                    {
                                        comparison.product2
                                            .product_name ||
                                        "Product 2"
                                    }
                                </h4>


                                {renderAllergens(
                                    comparison.product2
                                )}

                            </div>

                        </div>

                    </div>


                    {/* Nutrition */}

                    <div className="mt-8">

                        <h3 className="
                            text-xl
                            font-bold
                            text-slate-800
                            mb-5
                        ">
                            Nutrition Summary
                        </h3>


                        <div className="
                            bg-white
                            rounded-2xl
                            shadow-md
                            p-6
                        ">

                            <div className="
                                grid
                                md:grid-cols-2
                                gap-8
                            ">

                                {/* Product 1 Nutrition */}

                                <div>

                                    <h4 className="
                                        text-lg
                                        font-bold
                                        text-slate-800
                                        mb-4
                                    ">
                                        {
                                            comparison.product1
                                                .product_name ||
                                            "Product 1"
                                        }
                                    </h4>


                                    <p className="
                                        text-slate-600
                                        whitespace-pre-line
                                        leading-relaxed
                                    ">
                                        {
                                            comparison.product1
                                                .nutrition_summary ||
                                            "Not Available"
                                        }
                                    </p>

                                </div>


                                {/* Product 2 Nutrition */}

                                <div>

                                    <h4 className="
                                        text-lg
                                        font-bold
                                        text-slate-800
                                        mb-4
                                    ">
                                        {
                                            comparison.product2
                                                .product_name ||
                                            "Product 2"
                                        }
                                    </h4>


                                    <p className="
                                        text-slate-600
                                        whitespace-pre-line
                                        leading-relaxed
                                    ">
                                        {
                                            comparison.product2
                                                .nutrition_summary ||
                                            "Not Available"
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Compare;