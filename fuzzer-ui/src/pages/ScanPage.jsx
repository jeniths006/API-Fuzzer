import { useState } from "react";
import { fuzzPayload } from "../services/ApiService.js";

export default function ScanPage() {
    const [targetUrl, setTargetUrl] = useState("");
    const [message, setMessage] = useState("");

    const startScan = async () => {
        if (!targetUrl.trim()) {
            setMessage("Please enter a valid URL");
            return;
        }

        try {
            await fuzzPayload(targetUrl);
            setMessage("Scan started successfully");
        } catch {
            setMessage("Error starting scan");
        }
    };

    return (
        <div className="flex min-h-full items-start justify-center pt-10">

            <section className="w-full max-w-4xl">

                <div className="mb-8 text-center">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-300">
                        New Assessment
                    </p>

                    <h2 className="text-4xl font-semibold tracking-tight text-zinc-50">
                        Launch an API fuzzing scan
                    </h2>

                    <p className="mt-4 text-zinc-300">
                        Target endpoint intake for payload-based security testing.
                    </p>
                </div>

                <div className="rounded-md border border-zinc-700 bg-[#242424] shadow-xl">

                    <div className="border-b border-zinc-700 bg-[#303030] px-6 py-4">
                        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-100">
                            Target Configuration
                        </h3>
                    </div>

                    <div className="p-6">

                        <input
                            type="url"
                            placeholder="https://api.example.com"
                            className="w-full rounded-md border border-zinc-600 bg-[#111] px-4 py-3 font-mono text-sm text-zinc-50 outline-none focus:border-orange-400"
                            onChange={(e) => setTargetUrl(e.target.value)}
                        />

                        <button
                            onClick={startScan}
                            className="mt-4 rounded-md bg-orange-500 px-6 py-3 text-sm font-bold text-black hover:bg-orange-400"
                        >
                            Start Scan
                        </button>

                        {message && (
                            <div className="mt-4 text-sm text-zinc-300">
                                {message}
                            </div>
                        )}

                    </div>
                </div>

            </section>
        </div>
    );
}