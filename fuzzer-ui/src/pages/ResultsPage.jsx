import { useEffect, useState } from "react";
import { getResults, getScanResults } from "../services/ApiService.js";

export default function ResultsPage() {
    const [results, setResults] = useState([]);
    const [scanId, setScanId] = useState("");

    const fetchData = async () => {
        const res = await getResults();
        setResults(res.data);
    };

    const fetchScanResults = async () => {
        if (!scanId.trim()) return;

        try {
            const res = await getScanResults(scanId);
            setResults(res.data);
        } catch {}
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
                    onClick={fetchScanResults}
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-black"
                >
                    Load
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-md border border-zinc-700 bg-[#242424]">

                <table className="w-full text-sm">

                    <thead className="bg-[#303030] text-xs uppercase text-zinc-300">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">URL</th>
                        <th className="p-4">Payload</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Time</th>
                    </tr>
                    </thead>

                    <tbody>
                    {results.map((r) => (
                        <tr key={r.id} className="border-t border-zinc-700 hover:bg-[#2f2f2f]">
                            <td className="p-4 font-mono text-xs">{r.id}</td>
                            <td className="p-4 font-mono text-xs text-orange-200">{r.targetUrl}</td>
                            <td className="p-4 font-mono text-xs">{r.payloadContent}</td>
                            <td className="p-4">
                                    <span className="text-xs font-bold">
                                        {r.statusCode}
                                    </span>
                            </td>
                            <td className="p-4 font-mono text-xs">{r.httpMethod}</td>
                            <td className="p-4 text-xs">
                                {new Date(r.timestamp).toLocaleTimeString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>

            </div>
        </div>
    );
}