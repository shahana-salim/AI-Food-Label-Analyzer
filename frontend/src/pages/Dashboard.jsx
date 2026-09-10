import Sidebar from "../components/Sidebar";
import HeroCard from "../components/HeroCard";
import StatCard from "../components/StatCard";
import UploadCard from "../components/UploadCard";


import { useEffect, useState } from "react";

import api from "../services/api";

import {
    FaFlask,
    FaBalanceScale,
} from "react-icons/fa";

function Dashboard() {
    const isLoggedIn = !!localStorage.getItem("access_token");

    const [totalAnalyses, setTotalAnalyses] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
    };
    useEffect(() => {

        const fetchAnalysisCount = async () => {

            if (!isLoggedIn) {
                return;
            }

            try {

                const token = localStorage.getItem("access_token");

                const response = await api.get(
                    "my-analysis-count/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTotalAnalyses(
                    response.data.total_analyses
                );

            } catch (error) {

                console.error(
                    "Failed to fetch analysis count:",
                    error
                );

            }

        };

        fetchAnalysisCount();

    }, [isLoggedIn]);

    return (

        <div className="min-h-screen flex bg-slate-100">

            <Sidebar handleLogout={handleLogout} />

            <main className="flex-1 p-8">

                <HeroCard />

                <UploadCard />
                <div className="mt-8">

                    <div className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-5
    ">

                        <div className="flex items-start gap-4">

                            <div className="
                w-12
                h-12
                rounded-xl
                bg-violet-100
                flex
                items-center
                justify-center
                flex-shrink-0
            ">
                                <FaBalanceScale className="
                    text-violet-600
                    text-xl
                " />
                            </div>

                            <div>

                                <h2 className="
                    text-xl
                    font-bold
                    text-slate-800
                ">
                                    Compare Products
                                </h2>

                                <p className="
                    text-slate-500
                    mt-1
                    text-sm
                    max-w-xl
                ">
                                    Compare two food products and find
                                    which one is more suitable for you
                                    based on your health and dietary
                                    preferences.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = "/compare";
                            }}
                            className="
                bg-violet-600
                hover:bg-violet-700
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition
                whitespace-nowrap
            "
                        >
                            Compare Products →
                        </button>

                    </div>

                </div>

                {isLoggedIn && (
                    <div className="mt-8">

                        <StatCard
                            title="Total Analyses"
                            value={totalAnalyses}
                            subtitle="Completed analyses"
                            icon={
                                <FaFlask className="text-blue-600" />
                            }
                        />

                    </div>
                )}

            </main>

        </div>

    );
}

export default Dashboard;