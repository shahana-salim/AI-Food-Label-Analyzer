import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import api from "../services/api";


const ALLERGIES = [
    "Milk",
    "Eggs",
    "Peanuts",
    "Tree Nuts",
    "Soy",
    "Wheat",
    "Fish",
    "Shellfish",
    "Sesame",
    "Mustard",
    "Celery",
    "Lupin",
    "Sulphites",
    "Corn",
    "Oats",
    "Rice",
    "Coconut",
    "Chocolate",
    "Yeast",
];
const DIETS = [
    "None",
    "Vegetarian",
    "Vegan",
    "Jain",
    "Halal",
    "Kosher",
    "Gluten-Free",
    "Lactose-Free",
];
const CONDITIONS = [
    "Diabetes",
    "High Blood Pressure",
    "High Cholesterol",
    "Heart Disease",
    "Kidney Disease",
    "Celiac Disease",
    "Lactose Intolerance",
    "Obesity",
];
function HealthPreferences() {
    const [preferences, setPreferences] = useState({
        allergies: [],
        other_allergy: "",
        dietary_preference: "",
        medical_conditions: [],
        other_medical_condition: "",
    });
    useEffect(() => {

        const fetchPreferences = async () => {

            try {

                const token = localStorage.getItem("access_token");

                const response = await api.get(
                    "health-preferences/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setPreferences(response.data);

            } catch (error) {
                console.error(error);
            }

        };

        fetchPreferences();

    }, []);
    const handleSave = async () => {

        try {

            const token = localStorage.getItem("access_token");

            const response = await api.put(
                "health-preferences/",
                preferences,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPreferences(response.data);

            alert("Health preferences updated successfully!");

        } catch (error) {

            console.error(error);

            alert("Failed to update health preferences.");

        }

    };


    return (

        <div className="p-8">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Profile", path: "/profile" },
                    { label: "Health Preferences" },
                ]}
            />

            <h1 className="text-3xl font-bold">
                Health Preferences
            </h1>
            <p className="mt-2 text-slate-600">
                Your health preferences help personalize AI food label analysis and provide more relevant recommendations.
            </p>
            <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-xl font-bold mb-6">
                    Allergies
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {ALLERGIES.map((allergy) => (

                        <label
                            key={allergy}
                            className="flex items-center gap-3"
                        >

                            <input
                                type="checkbox"
                                checked={preferences.allergies.includes(allergy)}
                                onChange={(e) => {

                                    if (e.target.checked) {

                                        setPreferences({
                                            ...preferences,
                                            allergies: [
                                                ...preferences.allergies,
                                                allergy,
                                            ],
                                        });

                                    } else {

                                        setPreferences({
                                            ...preferences,
                                            allergies: preferences.allergies.filter(
                                                (item) => item !== allergy
                                            ),
                                        });

                                    }

                                }}
                            />

                            {allergy}

                        </label>

                    ))}

                </div>

                <div className="mt-6">

                    <label className="block text-sm text-slate-500 mb-2">
                        Other Allergy (Optional)
                    </label>

                    <input
                        type="text"
                        value={preferences.other_allergy}
                        onChange={(e) =>
                            setPreferences({
                                ...preferences,
                                other_allergy: e.target.value,
                            })
                        }
                        className="
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
            "
                        placeholder=""
                    />

                </div>

            </div>
            <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-xl font-bold mb-6">
                    Dietary Preference
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {DIETS.map((diet) => (

                        <label
                            key={diet}
                            className="flex items-center gap-3"
                        >

                            <input
                                type="radio"
                                name="dietary_preference"
                                value={diet}
                                checked={preferences.dietary_preference === diet}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        dietary_preference: e.target.value,
                                    })
                                }
                            />

                            {diet}

                        </label>

                    ))}

                </div>

            </div>
            <div className="mt-8 bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-xl font-bold mb-6">
                    Medical Conditions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {CONDITIONS.map((condition) => (

                        <label
                            key={condition}
                            className="flex items-center gap-3"
                        >

                            <input
                                type="checkbox"
                                checked={preferences.medical_conditions.includes(condition)}
                                onChange={(e) => {

                                    if (e.target.checked) {

                                        setPreferences({
                                            ...preferences,
                                            medical_conditions: [
                                                ...preferences.medical_conditions,
                                                condition,
                                            ],
                                        });

                                    } else {

                                        setPreferences({
                                            ...preferences,
                                            medical_conditions:
                                                preferences.medical_conditions.filter(
                                                    (item) => item !== condition
                                                ),
                                        });

                                    }

                                }}
                            />

                            {condition}

                        </label>

                    ))}

                </div>

                <div className="mt-6">

                    <label className="block text-sm text-slate-500 mb-2">
                        Other Medical Condition (Optional)
                    </label>

                    <input
                        type="text"
                        value={preferences.other_medical_condition}
                        onChange={(e) =>
                            setPreferences({
                                ...preferences,
                                other_medical_condition: e.target.value,
                            })
                        }
                        className="
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
            "
                        placeholder=""
                    />

                </div>


            </div>
            <div className="mt-8">

                <button
                    onClick={handleSave}
                    className="
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-6
            py-3
            rounded-lg
            transition
        "
                >
                    Save Preferences
                </button>

            </div>
        </div>

    );
}

export default HealthPreferences;