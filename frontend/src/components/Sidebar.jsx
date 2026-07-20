import {
    FaHome,
    FaUpload,
    FaHistory,
    FaUserCircle,
    FaSignOutAlt,
} from "react-icons/fa";

function Sidebar({ handleLogout }) {
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

                <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-emerald-600">
                    <FaHome />
                    Dashboard
                </button>

                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-600 transition mt-2">
                    <FaUpload />
                    Upload
                </button>

                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-600 transition mt-2">
                    <FaHistory />
                    History
                </button>

                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-emerald-600 transition mt-2">
                    <FaUserCircle />
                    Profile
                </button>

            </nav>

            {/* Logout */}

            <div className="p-4 border-t border-emerald-600">

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition"
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;