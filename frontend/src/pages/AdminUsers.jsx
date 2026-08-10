import { useEffect, useState } from "react";

import {
    FaUsers,
    FaEnvelope,
    FaCalendarAlt,
    FaClipboardList,
} from "react-icons/fa";

import api from "../services/api";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchUsers = async () => {

            try {

                const token = localStorage.getItem("access_token");

                const response = await api.get(
                    "admin/users/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUsers(response.data.users);

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load users."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchUsers();

    }, []);

    return (
        <div className="p-8">

            {/* Header */}

            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <FaUsers className="text-emerald-600 text-3xl" />

                    <h1 className="text-3xl font-bold text-slate-800">
                        User Management
                    </h1>

                </div>

                <p className="text-slate-500 mt-2">
                    View registered users and their analysis activity.
                </p>

            </div>

            {/* Loading */}

            {loading && (

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <p className="text-slate-500">
                        Loading users...
                    </p>

                </div>

            )}

            {/* Error */}

            {!loading && error && (

                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error}
                </div>

            )}

            {/* Users */}

            {!loading && !error && (

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {users.length > 0 ? (

                        <div className="divide-y divide-slate-100">

                            {users.map((user) => (

                                <div
                                    key={user.id}
                                    className="
                                        p-5
                                        hover:bg-slate-50
                                        transition
                                    "
                                >

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                        {/* User Information */}

                                        <div className="min-w-0">

                                            <h2 className="text-lg font-semibold text-slate-800">

                                                {user.first_name || user.last_name
                                                    ? `${user.first_name} ${user.last_name}`.trim()
                                                    : "No name provided"
                                                }

                                            </h2>

                                            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

                                                <FaEnvelope />

                                                <span className="break-all">
                                                    {user.email}
                                                </span>

                                            </div>

                                        </div>

                                        {/* User Statistics */}

                                        <div className="flex flex-wrap gap-6">

                                            <div className="flex items-center gap-2">

                                                <FaClipboardList className="text-blue-500" />

                                                <div>

                                                    <p className="text-xs text-slate-400">
                                                        Analyses
                                                    </p>

                                                    <p className="font-semibold text-slate-700">
                                                        {user.analysis_count}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <FaCalendarAlt className="text-emerald-500" />

                                                <div>

                                                    <p className="text-xs text-slate-400">
                                                        Joined
                                                    </p>

                                                    <p className="font-semibold text-slate-700">
                                                       {new Date(user.date_joined).toLocaleDateString("en-GB")}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="p-8 text-center">

                            <FaUsers className="mx-auto text-slate-300 text-4xl mb-3" />

                            <p className="text-slate-500">
                                No registered users found.
                            </p>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}

export default AdminUsers;