
export default function ResultsTable({ results, selectedResultId, onSelectResult }) {
    const getStatusStyle = (status) => {
        if (status === -1) {
            return "bg-purple-950/30 text-purple-400 border border-purple-500/30 dark:bg-purple-950/30 dark:text-purple-400 light:bg-purple-50 light:text-purple-700 light:border-purple-300";
        }
        if (status >= 200 && status < 300) {
            return "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-300";
        }
        if (status >= 300 && status < 400) {
            return "bg-amber-950/30 text-amber-400 border border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-400 light:bg-amber-50 light:text-amber-700 light:border-amber-300";
        }
        return "bg-rose-950/30 text-rose-400 border border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-400 light:bg-rose-50 light:text-rose-700 light:border-rose-300";
    };

    return (
        <div className="overflow-hidden rounded border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#242424] dark:bg-[#242424] light:bg-[#ffffff]">
            <div className="overflow-x-auto max-h-[350px]">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                    <thead className="sticky top-0 bg-[#303030] border-b border-zinc-700 text-zinc-300 uppercase tracking-wider text-[10px] dark:bg-[#303030] dark:border-zinc-700 light:bg-[#e5e7eb] light:border-zinc-300 light:text-zinc-700 select-none z-10">
                        <tr>
                            <th className="px-3 py-2 font-semibold">ID</th>
                            <th className="px-3 py-2 font-semibold">Method</th>
                            <th className="px-3 py-2 font-semibold">Status</th>
                            <th className="px-3 py-2 font-semibold">URL</th>
                            <th className="px-3 py-2 font-semibold">Payload</th>
                            <th className="px-3 py-2 font-semibold">Time (ms)</th>
                            <th className="px-3 py-2 font-semibold">Length (B)</th>
                            <th className="px-3 py-2 text-right font-semibold">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700/60 dark:divide-zinc-700/60 light:divide-zinc-300 select-none">
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-zinc-500 italic">
                                    No records available to display in HTTP History.
                                </td>
                            </tr>
                        ) : (
                            results.map((r) => {
                                const isSelected = selectedResultId === r.id;
                                return (
                                    <tr
                                        key={r.id}
                                        onClick={() => onSelectResult(r)}
                                        className={`cursor-pointer transition-colors duration-100 ${
                                            isSelected
                                                ? "bg-orange-500/20 hover:bg-orange-500/25 dark:bg-orange-500/20 light:bg-orange-100"
                                                : "hover:bg-[#2b2b2b]/30 dark:hover:bg-[#2b2b2b]/30 light:hover:bg-zinc-100 dark:text-zinc-200 light:text-zinc-950"
                                        }`}
                                    >
                                        <td className="px-3 py-1 text-zinc-400 light:text-zinc-500">{r.id}</td>
                                        <td className="px-3 py-1 font-bold text-orange-400 dark:text-orange-400 light:text-orange-700">{r.httpMethod}</td>
                                        <td className="px-3 py-1">
                                            <span className={`inline-block px-1.5 py-0.2 rounded-sm text-[10px] font-bold ${getStatusStyle(r.statusCode)}`}>
                                                {r.statusCode === -1 ? "ERR" : r.statusCode}
                                            </span>
                                        </td>
                                        <td className="px-3 py-1 truncate max-w-[200px] text-zinc-300 light:text-zinc-800" title={r.targetUrl}>
                                            {r.targetUrl}
                                        </td>
                                        <td className="px-3 py-1 truncate max-w-[180px] text-zinc-400 light:text-zinc-500 font-semibold" title={r.payloadContent}>
                                            {r.payloadContent}
                                        </td>
                                        <td className="px-3 py-1 text-zinc-300 light:text-zinc-800">{r.responseTime}</td>
                                        <td className="px-3 py-1 text-zinc-300 light:text-zinc-800">{r.responseSize}</td>
                                        <td className="px-3 py-1 text-right text-zinc-400 light:text-zinc-500">
                                            {new Date(r.timestamp).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}