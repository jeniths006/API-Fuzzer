import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="flex h-full w-72 shrink-0 flex-col border-r border-black bg-[#2b2b2b] p-5 shadow-xl shadow-black/40">

            <div className="mb-8 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-md border border-orange-400/45 bg-[#3a2a1d] text-lg font-black text-orange-200 shadow-md shadow-black/30">
                    AF
                </div>

                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
                        API Fuzzer
                    </h1>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        Security Console
                    </p>
                </div>
            </div>

            <nav className="flex flex-col gap-1.5">
                <Link
                    to="/"
                    className="group flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-[#3a3a3a] hover:text-white"
                >
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                    Scan
                </Link>

                <Link
                    to="/results"
                    className="group flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-[#3a3a3a] hover:text-white"
                >
                    <span className="h-2 w-2 rounded-full bg-zinc-400 group-hover:bg-orange-400" />
                    Results
                </Link>
            </nav>

            <div className="mt-auto rounded-md border border-black/50 bg-[#222] p-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    <span>Status</span>
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                </div>
                <p className="text-sm text-zinc-200">
                    Scanner interface ready
                </p>
            </div>
        </aside>
    );
}