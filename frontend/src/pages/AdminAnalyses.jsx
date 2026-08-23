import { useEffect, useState } from "react";
import api from "../services/api";
import AnalysisResult from "../components/AnalysisResult";

function AdminAnalyses() {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [selectedUser, setSelectedUser] = useState("all");
    const [selectedDate, setSelectedDate] = useState("all");

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await api.get("admin/analyses/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAnalyses(response.data);
            } catch (error) {
                console.error(error);

                if (error.response?.status === 403) {
                    setError("You do not have permission to view these analyses.");
                } else {
                    setError("Failed to load food analyses.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyses();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const filteredAnalyses = analyses.filter((item) => {

        // User filter
        if (selectedUser !== "all") {

            if (selectedUser === "guest") {
                if (item.user_email !== "Guest") {
                    return false;
                }
            } if (selectedUser === "registered") {
                if (!item.user_email || item.user_email === "Guest") {
                    return false;
                }
            }
        }

        // Date filter
        if (selectedDate !== "all") {

            const analysisDate = new Date(item.uploaded_at);
            const now = new Date();

            if (selectedDate === "today") {

                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);

                if (analysisDate < startOfDay) {
                    return false;
                }
            }

            if (selectedDate === "week") {

                const startOfWeek = new Date();
                const day = startOfWeek.getDay();

                startOfWeek.setDate(
                    startOfWeek.getDate() - day
                );

                startOfWeek.setHours(0, 0, 0, 0);

                if (analysisDate < startOfWeek) {
                    return false;
                }
            }

            if (selectedDate === "month") {

                const startOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                );

                if (analysisDate < startOfMonth) {
                    return false;
                }
            }
        }

        return true;
    });

    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold text-slate-800">
                Food Analyses
            </h1>

            <p className="text-slate-500 mt-2 mb-8">
                View food label analyses performed by users.
            </p>

            {loading && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-slate-500">
                        Loading analyses...
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error}
                </div>
            )}

            {!loading && !error && analyses.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <div className="grid md:grid-cols-2 gap-4">

                        {/* User Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Filter by User
                            </label>

                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="
                        w-full
                        border
                        border-slate-300
                        rounded-lg
                        px-4
                        py-3
                        text-slate-700
                        bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-emerald-500
                    "
                            >
                                <option value="all">
                                    All Users
                                </option>

                                <option value="guest">
                                    Guest
                                </option>

                                <option value="registered">
                                    Registered Users
                                </option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Filter by Date
                            </label>

                            <select
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="
                        w-full
                        border
                        border-slate-300
                        rounded-lg
                        px-4
                        py-3
                        text-slate-700
                        bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-emerald-500
                    "
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>

                    </div>

                </div>
            )}

            {!loading && !error && analyses.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <p className="text-slate-500">
                        No food analyses found.
                    </p>
                </div>
            )}

            {!loading && !error && analyses.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        User
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {filteredAnalyses.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {item.user_name}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {item.user_email}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-slate-700">
                                            {item.product_name || "Unknown Product"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {formatDate(item.uploaded_at)}
                                        </td>

                                        <td className="px-6 py-4">

                                            <button
                                                onClick={() =>
                                                    setSelectedAnalysis(item)
                                                }
                                                className="
                                                    bg-emerald-600
                                                    hover:bg-emerald-700
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-lg
                                                    text-sm
                                                    transition
                                                "
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}
            {!loading && !error && filteredAnalyses.length === 0 && analyses.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <p className="text-slate-500">
                        No analyses match the selected filters.
                    </p>
                </div>
            )}

            {/* Analysis Details Modal */}

            {selectedAnalysis && (
                <div
                    className="
                        fixed
                        inset-0
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        z-50
                        p-6
                    "
                    onClick={() => setSelectedAnalysis(null)}
                >

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            shadow-xl
                            max-w-4xl
                            w-full
                            max-h-[85vh]
                            overflow-y-auto
                            p-8
                        "
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="flex justify-between items-start mb-6">

                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Analysis Details
                                </h2>

                                <p className="text-slate-500 mt-1">
                                    {selectedAnalysis.product_name ||
                                        "Unknown Product"}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedAnalysis(null)}
                                className="
                                    text-slate-400
                                    hover:text-slate-700
                                    text-2xl
                                "
                            >
                                ×
                            </button>

                        </div>

                        <div className="mb-6 bg-slate-50 rounded-xl p-4">

                            <p className="text-sm text-slate-500">
                                Analyzed By
                            </p>

                            <p className="font-semibold text-slate-800">
                                {selectedAnalysis.user_name}
                            </p>

                            <p className="text-sm text-slate-500">
                                {selectedAnalysis.user_email}
                            </p>

                            <p className="text-sm text-slate-500 mt-2">
                                {formatDate(selectedAnalysis.uploaded_at)}
                            </p>

                        </div>

                        <AnalysisResult analysis={selectedAnalysis.analysis} />

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminAnalyses;