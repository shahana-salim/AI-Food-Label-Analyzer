import { useEffect, useState } from "react";

import {
    FaUsers,
    FaClipboardList,
    FaUserClock,
    FaUserCheck,
} from "react-icons/fa";

import api from "../services/api";

function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                const token = localStorage.getItem("access_token");

                const response = await api.get(
                    "admin/dashboard/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setStats(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load dashboard statistics."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboardStats();

    }, []);

    if (loading) {
        return (
            <div className="p-8">

                <h1 className="text-3xl font-bold text-slate-800">
                    Admin Dashboard
                </h1>

                <p className="text-slate-500 mt-4">
                    Loading dashboard...
                </p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">

                <h1 className="text-3xl font-bold text-slate-800">
                    Admin Dashboard
                </h1>

                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="p-8">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-800">
                    Admin Dashboard
                </h1>

                <p className="text-slate-500 mt-2">
                    Monitor your AI Food Label Analyzer.
                </p>

            </div>

            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {/* Total Users */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Users
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {stats.total_users}
                            </h2>

                        </div>

                        <div className="bg-emerald-100 text-emerald-600 p-4 rounded-xl">

                            <FaUsers size={24} />

                        </div>

                    </div>

                </div>

                {/* Total Analyses */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Analyses
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {stats.total_analyses}
                            </h2>

                        </div>

                        <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">

                            <FaClipboardList size={24} />

                        </div>

                    </div>

                </div>

                {/* Guest Analyses */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Guest Analyses
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {stats.guest_analyses}
                            </h2>

                        </div>

                        <div className="bg-orange-100 text-orange-600 p-4 rounded-xl">

                            <FaUserClock size={24} />

                        </div>

                    </div>

                </div>

                {/* Registered Analyses */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Registered Analyses
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                {stats.registered_analyses}
                            </h2>

                        </div>

                        <div className="bg-purple-100 text-purple-600 p-4 rounded-xl">

                            <FaUserCheck size={24} />

                        </div>

                    </div>

                </div>

            </div>
            {/* Recent Analyses */}

            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                <div className="mb-6">

                    <h2 className="text-xl font-semibold text-slate-800">
                        Recent Analyses
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Latest food label analyses performed on the platform.
                    </p>

                </div>

                {stats.recent_analyses?.length > 0 ? (

                    <div className="space-y-3">

                        {stats.recent_analyses.map((item) => (

                            <div
                                key={item.id}
                                className="
                        border
                        border-slate-200
                        rounded-xl
                        p-4
                        hover:bg-slate-50
                        transition
                    "
                            >

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                                    {/* Product + User */}

                                    <div className="min-w-0">

                                        <h3 className="font-semibold text-slate-800 wrap-break-word">
                                            {item.product_name}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1 break-all">
                                            {item.user}
                                        </p>

                                    </div>

                                    {/* Date */}

                                    <span className="text-sm text-slate-500 whitespace-nowrap">
                                        {new Date(item.uploaded_at).toLocaleDateString("en-GB")}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="text-slate-500">
                        No analyses available.
                    </p>

                )}

            </div>

        </div>
    );
}

export default AdminDashboard;