import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import Breadcrumb from "../components/Breadcrumb";
import api from "../services/api";

function Security() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChangePassword = async () => {
        setError("");
        setSuccess("");

        // Frontend validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All password fields are required.");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setError(
                "New password must be different from your current password."
            );
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            await api.post(
                "change-password/",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(
                "Password changed successfully. Please log in again."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Remove tokens
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(error);

            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError(
                    "Failed to change password. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Profile", path: "/profile" },
                    { label: "Security" },
                ]}
            />

            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Security
            </h1>

            <div className="w-full bg-white rounded-2xl shadow-md p-8">

                <div className="flex items-center gap-3 mb-6">

                    <FaLock className="text-emerald-600 text-2xl" />

                    <h2 className="text-2xl font-semibold text-slate-800">
                        Change Password
                    </h2>

                </div>

                <p className="text-slate-500 mb-6">
                    Update your password to keep your account secure.
                </p>

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Current Password
                        </label>

                        <div className="relative">

                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="
            w-full
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            pr-12
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
        "
                                placeholder="Enter current password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                }
                                className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-gray-600
        "
                            >
                                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            New Password
                        </label>

                        <div className="relative">

                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                className="
            w-full
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            pr-12
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
        "
                                placeholder="Enter new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-gray-600
        "
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm New Password
                        </label>

                        <div className="relative">

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="
            w-full
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            pr-12
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
        "
                                placeholder="Confirm new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-gray-600
        "
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-3 text-sm">
                            {success}
                        </div>
                    )}

                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="
                            w-full
                            bg-emerald-600
                            hover:bg-emerald-700
                            disabled:bg-emerald-400
                            text-white
                            font-semibold
                            py-3
                            rounded-xl
                            transition
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Changing Password..." : "Change Password"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Security;