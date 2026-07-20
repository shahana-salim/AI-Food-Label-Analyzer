import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeroCard from "../components/HeroCard";

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

            </main>

        </div>

    );
}

export default Dashboard;