import {
    User,
    HeartPulse,
    Shield,
    ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

function Profile() {

    const navigate = useNavigate();

    return (

        <div className="p-8">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Profile" },
                ]}
            />
            <h1 className="text-3xl font-bold mb-8">
                My Profile
            </h1>

            <div className="space-y-6">

                {/* Personal Information */}

                <div
                    onClick={() => navigate("/profile/personal")}
                    className="
                        bg-white
                        rounded-2xl
                        shadow-md
                        p-6
                        flex
                        justify-between
                        items-center
                        cursor-pointer
                        hover:shadow-lg
                        transition
                    "
                >

                    <div className="flex items-center gap-5">

                        <User
                            className="text-emerald-600"
                            size={34}
                        />

                        <div>

                            <h2 className="text-xl font-bold">
                                Personal Information
                            </h2>

                            <p className="text-slate-500">
                                View and update your personal details.
                            </p>

                        </div>

                    </div>

                    <ChevronRight />

                </div>

                {/* Health Preferences */}

                <div
                    onClick={() => navigate("/profile/health")}
                    className="
                        bg-white
                        rounded-2xl
                        shadow-md
                        p-6
                        flex
                        justify-between
                        items-center
                        cursor-pointer
                        hover:shadow-lg
                        transition
                    "
                >

                    <div className="flex items-center gap-5">

                        <HeartPulse
                            className="text-red-500"
                            size={34}
                        />

                        <div>

                            <h2 className="text-xl font-bold">
                                Health Preferences
                            </h2>

                            <p className="text-slate-500">
                                Manage allergies, dietary preferences and medical conditions.
                            </p>

                        </div>

                    </div>

                    <ChevronRight />

                </div>

                {/* Security */}

                <div
                    onClick={() => navigate("/profile/security")}
                    className="
                        bg-white
                        rounded-2xl
                        shadow-md
                        p-6
                        flex
                        justify-between
                        items-center
                        cursor-pointer
                        hover:shadow-lg
                        transition
                    "
                >

                    <div className="flex items-center gap-5">

                        <Shield
                            className="text-blue-600"
                            size={34}
                        />

                        <div>

                            <h2 className="text-xl font-bold">
                                Security
                            </h2>

                            <p className="text-slate-500">
                                Change your password.
                            </p>

                        </div>

                    </div>

                    <ChevronRight />

                </div>

            </div>

        </div>

    );
}

export default Profile;