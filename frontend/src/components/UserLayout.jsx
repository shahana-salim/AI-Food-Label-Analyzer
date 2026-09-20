import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function UserLayout() {

    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/";

    };

    return (

        <div className="min-h-screen bg-slate-100">

            <Sidebar handleLogout={handleLogout} />

            <main className="w-full">

                <Outlet />

            </main>

        </div>

    );
}

export default UserLayout;