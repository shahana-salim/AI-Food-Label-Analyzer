import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

import api from "../services/api";
import AnalysisResult from "../components/AnalysisResult";

function AnalysisDetails() {
    const { id } = useParams();

    const [analysis, setAnalysis] = useState(null);
    const [productName, setProductName] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await api.get(`history/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAnalysis(response.data.analysis);
                setProductName(response.data.product_name);

            } catch (error) {
                console.error(error);
            }
        };

        fetchAnalysis();
    }, [id]);

    return (
        <div className="p-8">
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "History", path: "/history" },
                    { label: productName || "Analysis Details" },
                ]}
            />

            <AnalysisResult analysis={analysis} />

        </div>
    );
}

export default AnalysisDetails;