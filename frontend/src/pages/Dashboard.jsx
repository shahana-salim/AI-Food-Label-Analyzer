import Sidebar from "../components/Sidebar";
import HeroCard from "../components/HeroCard";
import StatCard from "../components/StatCard";
import UploadCard from "../components/UploadCard";


import { useEffect, useState } from "react";

import api from "../services/api";

import {
    FaFlask,
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