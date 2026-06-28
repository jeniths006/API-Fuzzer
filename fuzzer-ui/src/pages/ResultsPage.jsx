import { useEffect, useState } from "react";
import { getResults, getScanResults } from "../services/ApiService.js";
import {useNavigate} from "react-router-dom";
import ResultsTable from "../components/ResultsTable.jsx";

export default function ResultsPage() {
    const [results, setResults] = useState([]);
    const [scanId, setScanId] = useState("");


    const navigate = useNavigate();

    const fetchData = async () => {
        const res = await getResults();
        setResults(res.data);
    };

    const viewScanResults = async () => {
        if (!scanId.trim()) return;

        navigate(`/results/${scanId}`);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-300">
                        Scan Output
                    </p>
                    <h2 className="text-3xl font-semibold text-zinc-50">
                        Results
                    </h2>
                </div>

                <div className="rounded-md border border-zinc-700 bg-[#242424] px-4 py-2 text-sm">
                    Rows: {results.length}
                </div>
            </div>

            {/* INPUT */}
            <div className="flex gap-3 rounded-md border border-zinc-700 bg-[#242424] p-4">
                <input
                    className="flex-1 rounded-md border border-zinc-600 bg-[#111] px-4 py-2 font-mono text-sm"
                    placeholder="Enter Scan ID..."
                    onChange={(e) => setScanId(e.target.value)}
                />

                <button
                    /*onClick={fetchScanResults}*/
                    onClick={viewScanResults}
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-black"
                >
                    Load
                </button>
            </div>

            {/* TABLE */}
            <ResultsTable results={results} />
        </div>
    );
}