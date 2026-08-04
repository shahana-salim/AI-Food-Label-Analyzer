import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Breadcrumb({ items }) {

    const navigate = useNavigate();

    return (

        <div className="mb-6 flex items-center text-sm text-slate-500">

            {items.map((item, index) => (

                <div
                    key={index}
                    className="flex items-center"
                >

                    {item.path ? (

                        <span
                            onClick={() => navigate(item.path)}
                            className="cursor-pointer hover:text-emerald-600 transition"
                        >
                            {item.label}
                        </span>

                    ) : (

                        <span className="font-semibold text-slate-700">
                            {item.label}
                        </span>

                    )}

                    {index !== items.length - 1 && (
                        <ChevronRight
                            size={16}
                            className="mx-2 text-slate-400"
                        />
                    )}

                </div>

            ))}

        </div>

    );
}

export default Breadcrumb;