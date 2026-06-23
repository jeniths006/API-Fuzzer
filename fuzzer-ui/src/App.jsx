import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScanPage from "./pages/ScanPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="flex h-screen w-screen bg-[#1f1f1f] text-zinc-100">

                <Sidebar />

                <main className="flex-1 h-full overflow-y-auto bg-[#151515]">
                    <div className="relative min-h-full">

                        {/* background layers */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,122,24,0.08),transparent_220px),linear-gradient(135deg,#181818,#101010)]" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        {/* content */}
                        <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
                            <Routes>
                                <Route path="/" element={<ScanPage />} />
                                <Route path="/results" element={<ResultsPage />} />
                            </Routes>
                        </div>

                    </div>
                </main>

            </div>
        </BrowserRouter>
    );
}

export default App;