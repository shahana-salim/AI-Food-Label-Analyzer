
import {
    FaHome,
    FaHistory,
    FaUserCircle,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaBalanceScale,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import api from "../services/api";

function Sidebar({ handleLogout }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path;
    };

    useEffect(() => {

        const checkAuth = async () => {

            const token = localStorage.getItem("access_token");

            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {

                await api.get("profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setIsLoggedIn(true);

            } catch (error) {

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                setIsLoggedIn(false);

            }

        };

        checkAuth();

    }, []);

    return (

        <header className="w-full bg-emerald-700 text-white shadow-md">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}

                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/")}
                >

                    <div className="text-2xl">
                        🌿
                    </div>

                    <div>

                        <h1 className="text-xl font-bold">
                            AI Food Label Analyzer
                        </h1>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="flex items-center gap-2">

                    {/* Dashboard */}

                    <button
                        onClick={() => navigate("/")}
                        className={`
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-lg
    transition
    ${isActive("/")
                                ? "bg-emerald-600"
                                : "hover:bg-emerald-600"
                            }
`}
                    >

                        <FaHome />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {!isLoggedIn ? (

                        <>

                            {/* Login */}

                            <button
                                onClick={() => navigate("/login")}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-lg
                                    hover:bg-emerald-600
                                    transition
                                "
                            >

                                <FaSignInAlt />

                                <span>
                                    Login
                                </span>

                            </button>


                            {/* Sign Up */}

                            <button
                                onClick={() => navigate("/register")}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-lg
                                    hover:bg-emerald-600
                                    transition
                                "
                            >

                                <FaUserPlus />

                                <span>
                                    Sign Up
                                </span>

                            </button>

                        </>

                    ) : (

                        <>

                            {/* History */}

                            <button
                                onClick={() => navigate("/history")}
                                className={`
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-lg
    transition
    ${isActive("/history")
                                        ? "bg-emerald-600"
                                        : "hover:bg-emerald-600"
                                    }
`}
                            >

                                <FaHistory />

                                <span>
                                    History
                                </span>

                            </button>

                            {/* Compare */}

                            <button
                                onClick={() => navigate("/compare")}
                                className={`
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-lg
    transition
    ${isActive("/compare")
                                        ? "bg-emerald-600"
                                        : "hover:bg-emerald-600"
                                    }
`}
                            >
                                <FaBalanceScale />

                                <span>
                                    Compare
                                </span>
                            </button>


                            {/* Profile */}

                            <button
                                onClick={() => navigate("/profile")}
                                className={`
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-lg
    transition
    ${location.pathname.startsWith("/profile")
                                        ? "bg-emerald-600"
                                        : "hover:bg-emerald-600"
                                    }
`}
                            >

                                <FaUserCircle />

                                <span>
                                    Profile
                                </span>

                            </button>


                            {/* Logout */}

                            <button
                                onClick={handleLogout}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-lg
                                    hover:bg-red-600
                                    transition
                                    ml-2
                                "
                            >

                                <FaSignOutAlt />

                                <span>
                                    Logout
                                </span>

                            </button>

                        </>

                    )}

                </nav>

            </div>

        </header>

    );
}

export default Sidebar;