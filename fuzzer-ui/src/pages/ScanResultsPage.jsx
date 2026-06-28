import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getResults, getScanResults} from "../services/ApiService.js";
import ResultsTable from "../components/ResultsTable.jsx";
import Sidebar from "../components/Sidebar.jsx";



export default function ScanResultsPage() {
    const {scanId} = useParams();
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const res = await getScanResults(scanId);
        setResults(res.data);
    }

    useEffect( () => {
        fetchData()
    }, [scanId])

    return (
        <div className="space-y-6">

            <button
                onClick={() => navigate(`/results/`)}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-bl"
            >
                Back
            </button>
            <div>
                <h2 className="text-3xl font-semibold">
                    Scan Results
                </h2>

                <p className="font-mono text-sm text-zinc-400">
                    {scanId}
                </p>
            </div>

            <ResultsTable results={results} />
        </div>
    );
}