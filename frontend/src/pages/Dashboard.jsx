import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">
                AI Food Label Analyzer
            </h1>

            <p className="mb-6 text-lg">
                Welcome! You have successfully logged in.
            </p>

            <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}

export default Dashboard;