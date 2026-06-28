
export default function ResultsTable({results}) {
    return (
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
    );
}