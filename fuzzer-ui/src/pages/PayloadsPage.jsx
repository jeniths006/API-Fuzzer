import { useState, useEffect } from "react";
import { getPayloads, createPayload, deletePayload } from "../services/ApiService.js";

export default function PayloadsPage({ theme }) {
    const [payloads, setPayloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("SQL");

    const categories = [
        { value: "SQL", label: "SQL Injection" },
        { value: "XSS", label: "Cross-Site Scripting (XSS)" },
        { value: "SQLi", label: "SQLi Advanced" },
        { value: "Command Injection", label: "Command Injection" },
        { value: "Path Traversal", label: "Path Traversal" },
        { value: "SSRF", label: "Server-Side Request Forgery" },
        { value: "Custom", label: "Custom Threat Vectors" }
    ];

    const fetchPayloadList = async () => {
        try {
            setLoading(true);
            const data = await getPayloads();
            setPayloads(data);
        } catch (err) {
            console.error("Error loading payloads:", err);
            setError("Failed to download active payload collection from security node.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayloadList();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!name.trim() || !content.trim()) {
            setError("Name and Payload Content fields are required.");
            return;
        }

        try {
            const newPayload = await createPayload({ name, content, category });
            setPayloads((prev) => [...prev, newPayload]);
            setName("");
            setContent("");
            setSuccessMessage("Attack payload registered successfully!");
            // Auto hide success message
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (err) {
            console.error("Error adding payload:", err);
            setError(err.response?.data?.message || "Failed to commit payload to security database.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to purge this threat vector payload?")) return;
        setError("");
        setSuccessMessage("");

        try {
            await deletePayload(id);
            setPayloads((prev) => prev.filter((p) => p.id !== id));
            setSuccessMessage("Threat vector deleted successfully.");
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (err) {
            console.error("Error deleting payload:", err);
            setError("Failed to delete the requested payload.");
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto font-sans">
            {/* Header */}
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-400 dark:text-orange-400 light:text-orange-600">
                    Attack Signature Library
                </p>
                <h2 className="text-2xl font-bold tracking-tight dark:text-zinc-50 light:text-zinc-900">
                    Intruder Payloads
                </h2>
                <p className="text-xs dark:text-zinc-400 light:text-zinc-600 mt-1">
                    Manage vulnerability signatures used for automated request fuzzing parameters.
                </p>
            </div>

            {/* Split layout: Payloads list & payload creator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Payloads List (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff] overflow-hidden">
                        <div className="border-b border-zinc-700 bg-[#303030] dark:border-zinc-700 dark:bg-[#303030] light:border-zinc-300 light:bg-[#e5e7eb] px-4 py-2 flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-800">
                                Active Threat Vectors
                            </h3>
                            <span className="text-[10px] font-mono bg-orange-400/25 px-2 py-0.5 rounded text-orange-400 dark:text-orange-400 light:text-orange-600">
                                Count: {payloads.length}
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                                Loading payloads...
                            </div>
                        ) : error && payloads.length === 0 ? (
                            <div className="p-8 text-center text-xs text-rose-400 font-mono">
                                {error}
                            </div>
                        ) : payloads.length === 0 ? (
                            <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                                No attack signatures found in the library. Use the console on the right to append some.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-[#1b1b1b] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-700 dark:bg-[#1b1b1b] dark:border-zinc-700 light:bg-[#f9fafb] light:border-zinc-300 light:text-zinc-600">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold">ID</th>
                                            <th className="px-4 py-2 font-semibold">Name</th>
                                            <th className="px-4 py-2 font-semibold">Category</th>
                                            <th className="px-4 py-2 font-semibold">Content</th>
                                            <th className="px-4 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-700/60 dark:divide-zinc-700/60 light:divide-zinc-300">
                                        {payloads.map((p) => (
                                            <tr key={p.id} className="hover:bg-[#2b2b2b]/30 dark:hover:bg-[#2b2b2b]/30 light:hover:bg-zinc-50">
                                                <td className="px-4 py-2.5 font-mono text-[11px] text-zinc-400 light:text-zinc-500">{p.id}</td>
                                                <td className="px-4 py-2.5 font-semibold text-zinc-200 light:text-zinc-800">{p.name}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className="rounded bg-[#ff6600]/10 border border-[#ff6600]/30 px-2 py-0.5 text-[10px] font-mono text-orange-400 dark:text-orange-400 light:text-orange-700">
                                                        {p.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-zinc-300 light:text-zinc-700 break-all select-all">
                                                    {p.content}
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="rounded bg-rose-600/10 border border-rose-500/25 px-2 py-1 text-[10px] font-bold uppercase text-rose-400 hover:bg-rose-600/30 hover:text-white transition active:scale-95 cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payload Creator (Right 1 col) */}
                <div className="space-y-4">
                    <div className="rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff] overflow-hidden">
                        <div className="border-b border-zinc-700 bg-[#303030] dark:border-zinc-700 dark:bg-[#303030] light:border-zinc-300 light:bg-[#e5e7eb] px-4 py-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-800">
                                Configure New Payload
                            </h3>
                        </div>

                        <form onSubmit={handleCreate} className="p-4 space-y-4 text-xs">
                            {successMessage && (
                                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500 text-emerald-400 light:bg-emerald-50 light:text-emerald-800 font-mono">
                                    {successMessage}
                                </div>
                            )}
                            {error && (
                                <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500 text-rose-400 light:bg-rose-50 light:text-rose-800 font-mono">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 light:text-zinc-500">
                                    Payload Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="SQLi Sleep Bypass"
                                    className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 light:text-zinc-500">
                                    Vulnerability Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value} className="bg-[#242424] text-zinc-200">
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 light:text-zinc-500">
                                    Payload Content
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="e.g. ' OR 1=1 --"
                                    className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded bg-[#ff6600] hover:bg-[#e05a00] py-2 text-xs font-bold uppercase tracking-widest text-black transition active:scale-[0.98] cursor-pointer"
                            >
                                Register Signature
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
