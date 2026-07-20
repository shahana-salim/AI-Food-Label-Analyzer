import { FaLeaf } from "react-icons/fa";

function HeroCard() {
    return (
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl shadow-lg p-8 text-white">

            <div className="flex items-center gap-3 mb-4">
                <FaLeaf className="text-4xl" />

                <h1 className="text-4xl font-bold">
                    Welcome Back 👋
                </h1>
            </div>

            <p className="text-lg text-emerald-100 max-w-2xl">
                Upload a packaged food label and let AI analyze ingredients,
                nutrition facts, additives, and potential health concerns in
                just a few seconds.
            </p>

            <button
                className="
                    mt-6
                    bg-white
                    text-emerald-700
                    font-semibold
                    px-6
                    py-3
                    rounded-xl
                    hover:scale-105
                    hover:shadow-lg
                    transition-all
                    duration-300
                "
            >
                Upload Food Label
            </button>

        </div>
    );
}

export default HeroCard;