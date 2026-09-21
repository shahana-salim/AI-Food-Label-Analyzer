import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

import api from "../services/api";

function PersonalInformation() {

    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailSuccess, setEmailSuccess] = useState("");
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
    });

    const [savedProfile, setSavedProfile] = useState({
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
                setSavedProfile(response.data);

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
        const nameRegex = /^[A-Za-z ]+$/;

        if (!profile.first_name.trim()) {
            alert("First name is required.");
            setProfile(savedProfile);
            return;
        }

        if (!nameRegex.test(profile.first_name.trim())) {
            alert("First name can contain only alphabets and spaces.");
            setProfile(savedProfile);
            return;
        }

        if (!profile.last_name.trim()) {
            alert("Last name is required.");
            setProfile(savedProfile);
            return;
        }

        if (!nameRegex.test(profile.last_name.trim())) {
            alert("Last name can contain only alphabets and spaces.");
            setProfile(savedProfile);
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            const response = await api.put("profile/", profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(response.data);
            setSavedProfile(response.data);

            alert("Profile updated successfully!");

        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
            setProfile(savedProfile);
        }
    };
    const handleChangeEmail = async () => {

        setEmailError("");
        setEmailSuccess("");

        if (!newEmail.trim()) {
            setEmailError("New email is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        if (!currentPassword) {
            setEmailError("Current password is required.");
            return;
        }

        try {

            const token = localStorage.getItem("access_token");

            const response = await api.put(
                "change-email/",
                {
                    email: newEmail.trim(),
                    current_password: currentPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile({
                ...profile,
                email: response.data.email,
            });

            setSavedProfile({
                ...savedProfile,
                email: response.data.email,
            });

            setEmailSuccess(
                "Email updated successfully!"
            );

            setNewEmail("");
            setCurrentPassword("");

            setTimeout(() => {
                setShowChangeEmail(false);
                setEmailSuccess("");
            }, 1500);

        } catch (error) {

            console.error(
                error.response?.data || error.message
            );

            setEmailError(
                error.response?.data?.error ||
                "Failed to update email."
            );
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

                    {!showChangeEmail && (

                        <button
                            onClick={() => {
                                setShowChangeEmail(true);
                                setEmailError("");
                                setEmailSuccess("");
                            }}
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

                    )}

                    {showChangeEmail && (

                        <div className="mt-5 space-y-4">

                            <input
                                type="email"
                                placeholder="New Email Address"
                                value={newEmail}
                                onChange={(e) =>
                                    setNewEmail(e.target.value)
                                }
                                className="
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

                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="
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

                            {emailError && (

                                <div className="
                bg-red-100
                border
                border-red-300
                text-red-700
                rounded-lg
                p-3
                text-sm
            ">
                                    {emailError}
                                </div>

                            )}

                            {emailSuccess && (

                                <div className="
                bg-green-100
                border
                border-green-300
                text-green-700
                rounded-lg
                p-3
                text-sm
            ">
                                    {emailSuccess}
                                </div>

                            )}

                            <div className="flex gap-3">

                                <button
                                    onClick={handleChangeEmail}
                                    className="
                    bg-emerald-600
                    hover:bg-emerald-700
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    transition
                "
                                >
                                    Update Email
                                </button>

                                <button
                                    onClick={() => {
                                        setShowChangeEmail(false);
                                        setNewEmail("");
                                        setCurrentPassword("");
                                        setEmailError("");
                                        setEmailSuccess("");
                                    }}
                                    className="
                    border
                    border-slate-300
                    text-slate-600
                    hover:bg-slate-50
                    px-5
                    py-2
                    rounded-lg
                    transition
                "
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default PersonalInformation;