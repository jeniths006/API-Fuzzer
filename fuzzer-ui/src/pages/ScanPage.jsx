import { useState, useEffect } from "react";
import { fuzzAll, fuzzSingle, getPayloads, createProject } from "../services/ApiService.js";

export default function ScanPage({ theme, user }) {
    const [targetUrl, setTargetUrl] = useState("");
    const [scanType, setScanType] = useState("all"); // "all" or "single"
    const [selectedPayloadId, setSelectedPayloadId] = useState("");
    const [payloads, setPayloads] = useState([]);
    const [scanMessage, setScanMessage] = useState("");
    const [scanError, setScanError] = useState("");
    const [scanning, setScanning] = useState(false);

    // Project form state
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [projectSuccess, setProjectSuccess] = useState("");
    const [projectError, setProjectError] = useState("");
    const [creatingProject, setCreatingProject] = useState(false);

    useEffect(() => {
        const loadPayloads = async () => {
            try {
                const data = await getPayloads();
                setPayloads(data);
                if (data.length > 0) {
                    setSelectedPayloadId(data[0].id.toString());
                }
            } catch (err) {
                console.error("Failed to load payloads for selector:", err);
            }
        };
        loadPayloads();
    }, []);

    const startScan = async () => {
        setScanMessage("");
        setScanError("");

        if (!targetUrl.trim()) {
            setScanError("Please enter a valid target URL");
            return;
        }

        try {
            setScanning(true);
            if (scanType === "all") {
                await fuzzAll(targetUrl);
                setScanMessage(`Scan initiated! Fuzzing target URL: "${targetUrl}" with all available payloads.`);
            } else {
                if (!selectedPayloadId) {
                    setScanError("Please select a payload signature to execute.");
                    setScanning(false);
                    return;
                }
                const payloadName = payloads.find(p => p.id.toString() === selectedPayloadId)?.name || "selected payload";
                await fuzzSingle(selectedPayloadId, targetUrl);
                setScanMessage(`Scan initiated! Fuzzing target URL: "${targetUrl}" using payload: "${payloadName}".`);
            }
        } catch (err) {
            console.error("Error starting scan:", err);
            setScanError("Failed to issue execution commands. Verify if target is reachable.");
        } finally {
            setScanning(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setProjectSuccess("");
        setProjectError("");

        if (!projectName.trim()) {
            setProjectError("Project name is required.");
            return;
        }

        try {
            setCreatingProject(true);
            const res = await createProject(projectName, projectDesc);
            setProjectSuccess(`Project "${res.name}" registered successfully with ID ${res.id}!`);
            setProjectName("");
            setProjectDesc("");
        } catch (err) {
            console.error("Error creating project:", err);
            setProjectError(err.response?.data?.message || "Failed to register project on backend.");
        } finally {
            setCreatingProject(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto font-sans">
            {/* Page Header */}
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-400 dark:text-orange-400 light:text-orange-600">
                    Fuzzing Assessment Interface
                </p>
                <h2 className="text-2xl font-bold tracking-tight dark:text-zinc-50 light:text-zinc-900">
                    Scanner Console
                </h2>
                <p className="text-xs dark:text-zinc-400 light:text-zinc-600 mt-1">
                    Configure target end-points and launch payload injection queries.
                </p>
            </div>

            {/* Main Action Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Target Configuration Panel */}
                <div className="lg:col-span-2 rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff] overflow-hidden">
                    <div className="border-b border-zinc-700 bg-[#303030] dark:border-zinc-700 dark:bg-[#303030] light:border-zinc-300 light:bg-[#e5e7eb] px-4 py-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-800">
                            Configure Target & Scope
                        </h3>
                    </div>

                    <div className="p-5 space-y-4 text-xs">
                        {scanMessage && (
                            <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500 text-emerald-400 light:bg-emerald-50 light:text-emerald-800 font-mono">
                                {scanMessage}
                            </div>
                        )}
                        {scanError && (
                            <div className="p-3 rounded bg-rose-950/40 border border-rose-500 text-rose-400 light:bg-rose-50 light:text-rose-800 font-mono">
                                {scanError}
                            </div>
                        )}

                        {/* URL Target Input */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 light:text-zinc-500">
                                Target Endpoint URL (POST requests)
                            </label>
                            <input
                                type="url"
                                placeholder="http://127.0.0.1:5000/api/login"
                                className="w-full rounded border border-zinc-700 bg-[#161616] px-4 py-2.5 text-zinc-50 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono text-sm"
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                            />
                        </div>

                        {/* Scope Toggle Selection */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 light:text-zinc-500">
                                Attack Scope
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-zinc-300 light:text-zinc-700">
                                    <input
                                        type="radio"
                                        name="scanType"
                                        value="all"
                                        checked={scanType === "all"}
                                        onChange={() => setScanType("all")}
                                        className="accent-[#ff6600] h-4 w-4"
                                    />
                                    Scan with All Payloads
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-zinc-300 light:text-zinc-700">
                                    <input
                                        type="radio"
                                        name="scanType"
                                        value="single"
                                        checked={scanType === "single"}
                                        onChange={() => setScanType("single")}
                                        className="accent-[#ff6600] h-4 w-4"
                                    />
                                    Single Payload Fuzz
                                </label>
                            </div>
                        </div>

                        {/* Single Payload Dropdown (conditional) */}
                        {scanType === "single" && (
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 light:text-zinc-500">
                                    Select Attack Vector Payload
                                </label>
                                {payloads.length === 0 ? (
                                    <p className="text-zinc-500 italic">No payloads available. Configure custom payloads first.</p>
                                ) : (
                                    <select
                                        value={selectedPayloadId}
                                        onChange={(e) => setSelectedPayloadId(e.target.value)}
                                        className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                                    >
                                        {payloads.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                [{p.category}] {p.name} - ({p.content.substring(0, 30)}...)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {/* Run Scanner Button */}
                        <button
                            onClick={startScan}
                            disabled={scanning}
                            className="mt-2 rounded bg-[#ff6600] hover:bg-[#e05a00] px-6 py-2.5 font-bold uppercase tracking-wider text-black transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {scanning ? "Executing Scan..." : "🚀 Launch Scan"}
                        </button>
                    </div>
                </div>

                {/* Project Registration Panel */}
                <div className="rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff] overflow-hidden">
                    <div className="border-b border-zinc-700 bg-[#303030] dark:border-zinc-700 dark:bg-[#303030] light:border-zinc-300 light:bg-[#e5e7eb] px-4 py-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-800">
                            Register New Project
                        </h3>
                    </div>

                    <form onSubmit={handleCreateProject} className="p-4 space-y-4 text-xs">
                        {projectSuccess && (
                            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500 text-emerald-400 light:bg-emerald-50 light:text-emerald-800 font-mono">
                                {projectSuccess}
                            </div>
                        )}
                        {projectError && (
                            <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500 text-rose-400 light:bg-rose-50 light:text-rose-800 font-mono">
                                {projectError}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 light:text-zinc-500">
                                Project Name
                            </label>
                            <input
                                type="text"
                                required
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="E-Commerce Audit"
                                className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 light:text-zinc-500">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                                placeholder="Details about this assessment target..."
                                className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={creatingProject}
                            className="w-full rounded bg-[#ff6600] hover:bg-[#e05a00] py-2 text-xs font-bold uppercase tracking-widest text-black transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                            {creatingProject ? "Registering..." : "Create Project"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}