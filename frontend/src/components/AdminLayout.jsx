import { Outlet, useNavigate } from "react-router-dom";
import {
    FaChartPie,
    FaUsers,
    FaClipboardList,
    FaSignOutAlt,
    FaLeaf,
} from "react-icons/fa";

function AdminLayout() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");
    };

    return (
        <div className="min-h-screen flex bg-slate-100">

            {/* Sidebar */}

            <aside className="w-64 bg-emerald-800 text-white flex flex-col">

                {/* Logo */}

                <div className="p-6 border-b border-emerald-700">

                    <div className="flex items-center gap-3">

                        <FaLeaf className="text-3xl text-emerald-300" />

                        <div>
                            <h1 className="text-xl font-bold">
                                AI Food Label
                            </h1>

                            <p className="text-sm text-emerald-200">
                                Analyzer
                            </p>
                        </div>

                    </div>

                </div>

                {/* Navigation */}

                <nav className="flex-1 p-4 space-y-2">

                    <button
                        onClick={() => navigate("/admin")}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-700 transition"
                    >
                        <FaChartPie />
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-700 transition"
                    >
                        <FaUsers />
                        User Management
                    </button>

                    <button
                        onClick={() => navigate("/admin/analyses")}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-700 transition"
                    >
                        <FaClipboardList />
                        Food Analyses
                    </button>

                </nav>

                {/* Logout */}

                <div className="p-4 border-t border-emerald-700">

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Content */}

            <main className="flex-1 overflow-auto">

                <Outlet />

            </main>

        </div>
    );
}

export default AdminLayout;