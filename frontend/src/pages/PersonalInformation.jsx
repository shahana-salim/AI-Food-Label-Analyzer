import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

import api from "../services/api";

function PersonalInformation() {
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
    });
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await api.get("profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfile(response.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile.username) {
        return <p className="p-8">Loading...</p>;
    }
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("access_token");

            const response = await api.put("profile/", profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(response.data);

            alert("Profile updated successfully!");

        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        }
    };
    return (
        <div className="p-8">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Profile", path: "/profile" },
                    { label: "Personal Information" },
                ]}
            />
            <h1 className="text-3xl font-bold mb-8">
                Personal Information
            </h1>

            <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

                <div>
                    <p className="text-sm text-slate-500">
                        First Name
                    </p>

                    <input
                        type="text"
                        value={profile.first_name}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                first_name: e.target.value,
                            })
                        }
                        className="
                            mt-2
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            px-4
                            py-2
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-500
                        "
                    />
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Last Name
                    </p>

                    <input
                        type="text"
                        value={profile.last_name}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                last_name: e.target.value,
                            })
                        }
                        className="
                            mt-2
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            px-4
                            py-2
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-500
                        "
                    />
                </div>
                <div className="pt-4">
                    <button onClick={handleSave}
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
                        Save Changes
                    </button>
                </div>
                <hr className="my-8 border-slate-200" />
                <div>

                    <p className="text-sm text-slate-500">
                        Email
                    </p>

                    <p className="text-lg font-semibold mt-2">
                        {profile.email}
                    </p>

                    <button
                        onClick={() => alert("Change Email feature coming soon")}
                        className="
            mt-5
            border
            border-emerald-600
            text-emerald-600
            hover:bg-emerald-50
            px-5
            py-2
            rounded-lg
            transition
        "
                    >
                        Change Email
                    </button>

                </div>

            </div>

        </div>
    );
}

export default PersonalInformation;