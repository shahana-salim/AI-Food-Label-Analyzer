import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeroCard from "../components/HeroCard";
import StatCard from "../components/StatCard";
import UploadCard from "../components/UploadCard";

import {
    FaUpload,
    FaFlask,
    FaLeaf,
} from "react-icons/fa";

function Dashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    return (

        <div className="min-h-screen flex bg-slate-100">

            <Sidebar handleLogout={handleLogout} />

            <main className="flex-1 p-8">

                <HeroCard />
                <UploadCard />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    <StatCard
                        title="Uploads"
                        value="0"
                        subtitle="Total uploaded labels"
                        icon={<FaUpload className="text-emerald-600" />}
                    />

                    <StatCard
                        title="Analyses"
                        value="0"
                        subtitle="Completed analyses"
                        icon={<FaFlask className="text-blue-600" />}
                    />

                    <StatCard
                        title="Safe Foods"
                        value="0"
                        subtitle="Healthy products"
                        icon={<FaLeaf className="text-green-600" />}
                    />

                </div>

            </main>

        </div>

    );
}

export default Dashboard;