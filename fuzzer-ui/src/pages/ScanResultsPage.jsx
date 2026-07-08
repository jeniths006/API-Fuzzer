import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getScanResults } from "../services/ApiService.js";
import ResultsTable from "../components/ResultsTable.jsx";

export default function ScanResultsPage({ theme }) {
    const { scanId } = useParams();
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getScanResults(scanId);
            // Sort by ID descending
            const sorted = data.sort((a, b) => b.id - a.id);
            setResults(sorted);
            setError("");
        } catch (err) {
            console.error("Error loading scan results:", err);
            setError("Failed to download logs for this specific scan session.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [scanId]);

    const handleSelectResult = (result) => {
        setSelectedResult(result);
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto font-sans h-[calc(100vh-80px)] flex flex-col">
            
            {/* Header controls */}
            <div className="flex items-center gap-4 shrink-0 justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/scans")}
                        className="rounded border border-zinc-700 bg-[#242424] hover:bg-[#2b2b2b]/80 px-3 py-1.5 text-xs font-bold uppercase text-[#ff6600] transition active:scale-95 cursor-pointer font-sans dark:border-zinc-700 dark:bg-[#242424] light:bg-[#ffffff] light:border-zinc-300 light:text-orange-600"
                    >
                        ◀ Back
                    </button>
                    <div>
                        <h2 className="text-xl font-bold dark:text-zinc-50 light:text-zinc-900">
                            Scan Results Inspector
                        </h2>
                        <p className="font-mono text-[10.5px] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 select-all font-semibold">
                            UUID: {scanId}
                        </p>
                    </div>
                </div>

                <div className="rounded border border-zinc-700 bg-[#242424] px-3 py-1.5 font-mono text-xs dark:border-zinc-700 dark:bg-[#242424] light:border-zinc-300 light:bg-[#ffffff] dark:text-zinc-300 light:text-zinc-800">
                    Hits: {results.length}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-500 text-rose-400 light:bg-rose-50 light:text-rose-800 font-mono text-xs shrink-0">
                    {error}
                </div>
            )}

            {/* Top Pane: Scoped Logs Grid */}
            <div className="flex-1 min-h-[200px] overflow-hidden shrink-0">
                {loading && results.length === 0 ? (
                    <div className="p-12 text-center text-xs text-zinc-500 font-mono">
                        Filtering logs...
                    </div>
                ) : (
                    <ResultsTable
                        results={results}
                        selectedResultId={selectedResult?.id}
                        onSelectResult={handleSelectResult}
                    />
                )}
            </div>

            {/* Bottom Pane: Split Details Panel */}
            <div className="h-[280px] rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff] flex flex-col overflow-hidden shrink-0">
                <div className="border-b border-zinc-700 bg-[#303030] dark:border-zinc-700 dark:bg-[#303030] light:border-zinc-300 light:bg-[#e5e7eb] px-4 py-2 flex items-center justify-between shrink-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-800">
                        Payload Handshake Inspector
                    </h3>
                    {selectedResult && (
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase">
                            Record ID: #{selectedResult.id}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-hidden p-3 min-h-0">
                    {!selectedResult ? (
                        <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-500 light:text-zinc-400 text-xs italic">
                            Select a request from the table above to inspect the HTTP handshake details.
                        </div>
                    ) : (
                        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
                            
                            {/* Parameters Metadata */}
                            <div className="border-r border-zinc-700/60 dark:border-zinc-700/60 light:border-zinc-300 pr-4 space-y-2 text-xs overflow-y-auto">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-orange-400 dark:text-orange-400 light:text-orange-600 mb-2">Parameters</h4>
                                <div className="space-y-1.5 font-mono text-[11px] text-zinc-300 light:text-zinc-800">
                                    <div className="flex justify-between border-b border-zinc-700/30 pb-0.5"><span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400">Method:</span> <span className="font-bold text-[#ff6600]">{selectedResult.httpMethod}</span></div>
                                    <div className="flex justify-between border-b border-zinc-700/30 pb-0.5"><span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400">Status:</span> <span>{selectedResult.statusCode}</span></div>
                                    <div className="flex justify-between border-b border-zinc-700/30 pb-0.5"><span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400">Duration:</span> <span>{selectedResult.responseTime} ms</span></div>
                                    <div className="flex justify-between border-b border-zinc-700/30 pb-0.5"><span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400">Length:</span> <span>{selectedResult.responseSize} B</span></div>
                                    <div className="flex justify-between border-b border-zinc-700/30 pb-0.5"><span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400">Threat:</span> <span className="font-semibold text-orange-200 dark:text-orange-200 light:text-orange-700">{selectedResult.payloadCategory}</span></div>
                                </div>
                            </div>

                            {/* Threat content & response details */}
                            <div className="md:col-span-2 flex flex-col h-full min-h-0 text-xs">
                                <div className="mb-2 shrink-0">
                                    <span className="font-bold text-[10px] uppercase text-zinc-400 dark:text-zinc-400 light:text-zinc-500 tracking-wider">Payload Content:</span>
                                    <div className="mt-1 font-mono text-[11px] p-2 bg-[#161616] dark:bg-[#161616] light:bg-[#f3f4f6] text-orange-400 border border-zinc-700/50 rounded dark:border-zinc-700/50 light:border-zinc-300 max-h-[60px] overflow-y-auto select-all">
                                        {selectedResult.payloadContent}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-h-0">
                                    <span className="font-bold text-[10px] uppercase text-zinc-400 dark:text-zinc-400 light:text-zinc-500 tracking-wider mb-1 shrink-0">Raw Response Body:</span>
                                    <pre className="flex-1 font-mono text-[10.5px] p-2 bg-[#161616] dark:bg-[#161616] light:bg-[#f3f4f6] text-zinc-300 light:text-zinc-900 border border-zinc-700/50 rounded dark:border-zinc-700/50 light:border-zinc-300 overflow-auto whitespace-pre-wrap select-text leading-tight">
                                        {selectedResult.responseBody || "[Empty Response]"}
                                    </pre>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}