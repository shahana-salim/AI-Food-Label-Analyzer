import {
    FaHome,
    FaHistory,
    FaUserCircle,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Sidebar({ handleLogout }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();

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
        <aside className="w-64 bg-emerald-700 text-white flex flex-col">

            {/* Logo */}

            <div className="p-6 border-b border-emerald-600">

                <h1 className="text-2xl font-bold">
                    AI Food Label
                </h1>

                <p className="text-sm text-emerald-100 mt-1">
                    Analyzer
                </p>

            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">

                {/* Dashboard */}

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 w-full p-3 rounded-lg bg-emerald-600"
                >
                    <FaHome />
                    Dashboard
                </button>

                {!isLoggedIn ? (

                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-600 transition mt-2"
                        >
                            <FaSignInAlt />
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-600 transition mt-2"
                        >
                            <FaUserPlus />
                            Sign Up
                        </button>
                    </>

                ) : (

                    <>
                        <button
                            onClick={() => navigate("/history")}
                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-600 transition mt-2"
                        >
                            <FaHistory />
                            History
                        </button>

                        <button
                            onClick={() => navigate("/profile")}
                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-600 transition mt-2"
                        >
                            <FaUserCircle />
                            Profile
                        </button>
                    </>

                )}

            </nav>

            {/* Logout */}

            {isLoggedIn && (

                <div className="p-4 border-t border-emerald-600">

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>

                </div>

            )}

        </aside>
    );
}

export default Sidebar;