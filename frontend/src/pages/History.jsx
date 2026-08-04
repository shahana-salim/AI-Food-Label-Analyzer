import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

function History() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await api.get("history/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setHistory(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="p-8">
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "History" },
                ]}
            />
            <h1 className="text-3xl font-bold mb-8">
                Analysis History
            </h1>

            <div className="space-y-4">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="
                          bg-white
                            rounded-2xl
                            shadow-md
                            p-5
                            flex
                            gap-6
                            items-center
                        "
                    >
                        <img
                            src={item.image}
                            alt={item.product_name}
                            className="
                               w-32
                                h-32
                                object-cover
                                rounded-xl
                                shadow
                            "
                        />

                        <div className="flex-1">

                            <h2 className="text-2xl font-bold text-slate-800">
                                {item.product_name || "Unknown Product"}
                            </h2>

                            <p className="text-slate-500 mt-2">
                                {new Date(item.uploaded_at).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                            <button
                                onClick={() => navigate(`/history/${item.id}`)}

                                disabled={!item.analysis}
                                className="
                                    mt-5
                                    bg-emerald-600
                                    hover:bg-emerald-700
                                    disabled:bg-slate-300
                                    disabled:cursor-not-allowed
                                    text-white
                                    px-5
                                    py-2
                                     rounded-lg
                                    transition
                        "
                            >
                                View Analysis
                            </button>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;