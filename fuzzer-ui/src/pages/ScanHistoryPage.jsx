import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getScans } from "../services/ApiService.js";

export default function ScanHistoryPage({ theme }) {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchScans = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getScans();
            setScans(data);
        } catch (err) {
            console.error("Error loading scan summaries:", err);
            setError("Failed to fetch historical scan list from security engine.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScans();
    }, []);

    // Filter scans by search query
    const filteredScans = scans.filter((scan) => {
        if (!scan.scanId) return false;
        return scan.scanId.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-6 max-w-5xl mx-auto font-sans">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-400 dark:text-orange-400 light:text-orange-600">
                        Historical Log Archives
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight dark:text-zinc-50 light:text-zinc-900">
                        Scan History
                    </h2>
                    <p className="text-xs dark:text-zinc-400 light:text-zinc-600 mt-1">
                        Grouped listing of previous scanner execution passes and result counts.
                    </p>
                </div>

                <button
                    onClick={fetchScans}
                    className="rounded border border-zinc-600 dark:border-zinc-600 light:border-zinc-400 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-zinc-200 transition cursor-pointer"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Filter Input */}
            <div className="rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff] p-4 flex gap-4 text-xs items-center">
                <span className="font-bold text-zinc-400 dark:text-zinc-400 light:text-zinc-600 uppercase tracking-wider text-[10px]">Filter Scans:</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Scan UUID..."
                    className="flex-1 rounded border border-zinc-700 bg-[#161616] px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                />
            </div>

            {/* Scans Grid/Table */}
            <div className="rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff] overflow-hidden">
                <div className="border-b border-zinc-700 bg-[#303030] dark:border-zinc-700 dark:bg-[#303030] light:border-zinc-300 light:bg-[#e5e7eb] px-4 py-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-800">
                        Scan Summaries
                    </h3>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                        Retrieving historical runs...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-xs text-rose-400 font-mono">
                        {error}
                    </div>
                ) : filteredScans.length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                        No scan records match the query.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-[#1b1b1b] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-700 dark:bg-[#1b1b1b] dark:border-zinc-700 light:bg-[#f9fafb] light:border-zinc-300 light:text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Scan Identifier (UUID)</th>
                                    <th className="px-4 py-3 font-semibold">Logged Actions Count</th>
                                    <th className="px-4 py-3 text-right">Results Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-700/60 dark:divide-zinc-700/60 light:divide-zinc-300">
                                {filteredScans.map((scan) => (
                                    <tr key={scan.scanId} className="hover:bg-[#2b2b2b]/30 dark:hover:bg-[#2b2b2b]/30 light:hover:bg-zinc-50">
                                        <td className="px-4 py-3.5 font-mono text-[12px] text-orange-400 dark:text-orange-400 light:text-orange-700 select-all font-semibold">
                                            {scan.scanId}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="rounded bg-[#ff6600]/10 border border-[#ff6600]/25 px-2 py-0.5 text-[11px] font-mono text-zinc-200 dark:text-zinc-200 light:text-zinc-800">
                                                {scan.count} request logs
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link
                                                to={`/results/${scan.scanId}`}
                                                className="rounded bg-[#ff6600] hover:bg-[#e05a00] px-3 py-1.5 text-[10px] font-bold uppercase text-black transition active:scale-95 inline-block cursor-pointer font-sans"
                                            >
                                                Inspect Logs
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
