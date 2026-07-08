import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ScanPage from "./pages/ScanPage.jsx";
import ScanResultsPage from "./pages/ScanResultsPage.jsx";
import PayloadsPage from "./pages/PayloadsPage.jsx";
import ScanHistoryPage from "./pages/ScanHistoryPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { getCurrentUser, setToken, getToken, removeToken } from "./services/ApiService.js";

// Inner component to access react-router-dom hooks
function MainAppContent({ theme, toggleTheme, user, setUser, handleLogout }) {
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);

    const isActive = (path) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            {/* Burp Suite style Top Main Tab Bar */}
            <header className="flex h-12 w-full items-center justify-between border-b border-zinc-700 bg-[#2b2b2b] px-4 shadow-md dark:border-zinc-700 dark:bg-[#2b2b2b] light:border-zinc-300 light:bg-[#e5e7eb] shrink-0 font-sans">
                {/* Logo and App Info */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded bg-[#3a2a1d] text-[10px] font-black text-orange-400 border border-orange-400/40">
                            AF
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider dark:text-zinc-50 light:text-zinc-900">
                                API Fuzzer
                            </span>
                        </div>
                    </div>

                    {/* Top Navigation Tabs */}
                    <nav className="flex h-full items-end gap-1 self-end">
                        <Link
                            to="/"
                            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-t border-t border-x transition-colors duration-150 ${
                                isActive("/")
                                    ? "bg-[#1f1f1f] text-[#ff6600] border-zinc-700 dark:bg-[#1f1f1f] light:bg-[#ffffff] light:border-zinc-300"
                                    : "border-transparent text-zinc-400 hover:text-zinc-200 dark:text-zinc-400 light:text-zinc-600 light:hover:text-zinc-800"
                            }`}
                        >
                            Target Console
                        </Link>
                        <Link
                            to="/payloads"
                            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-t border-t border-x transition-colors duration-150 ${
                                isActive("/payloads")
                                    ? "bg-[#1f1f1f] text-[#ff6600] border-zinc-700 dark:bg-[#1f1f1f] light:bg-[#ffffff] light:border-zinc-300"
                                    : "border-transparent text-zinc-400 hover:text-zinc-200 dark:text-zinc-400 light:text-zinc-600 light:hover:text-zinc-800"
                            }`}
                        >
                            Payloads
                        </Link>
                        <Link
                            to="/scans"
                            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-t border-t border-x transition-colors duration-150 ${
                                isActive("/scans")
                                    ? "bg-[#1f1f1f] text-[#ff6600] border-zinc-700 dark:bg-[#1f1f1f] light:bg-[#ffffff] light:border-zinc-300"
                                    : "border-transparent text-zinc-400 hover:text-zinc-200 dark:text-zinc-400 light:text-zinc-600 light:hover:text-zinc-800"
                            }`}
                        >
                            Scan History
                        </Link>

                    </nav>
                </div>

                {/* Right controls: Theme, User status, Logout */}
                <div className="flex items-center gap-4 text-xs">
                    {/* Light/Dark Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="rounded border border-zinc-600 px-2 py-1 hover:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-700 light:border-zinc-400 light:hover:bg-zinc-200 dark:text-zinc-300 light:text-zinc-700 font-medium transition cursor-pointer active:scale-95"
                    >
                        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>

                    {/* User profile card & Logout */}
                    {user && (
                        <div className="flex items-center gap-3 border-l border-zinc-700 pl-3 dark:border-zinc-700 light:border-zinc-300">
                            <button
                                onClick={() => setShowProfile(true)}
                                className="font-semibold text-orange-400 dark:text-orange-400 light:text-orange-600 hover:underline cursor-pointer active:scale-95 transition font-sans text-xs"
                                title="View Profile Details"
                            >
                                🧑‍💻 {user.username}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="rounded bg-rose-600/20 hover:bg-rose-600/35 border border-rose-500/30 px-2 py-1 text-rose-400 hover:text-rose-300 transition cursor-pointer active:scale-95 text-[11px] font-bold uppercase tracking-wider font-sans"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main view container */}
            <main className="flex-1 overflow-hidden relative bg-[#1f1f1f] dark:bg-[#1f1f1f] light:bg-[#ffffff]">
                {/* background grids/glows for premium feel */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,102,0,0.03),transparent_350px)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-75 dark:opacity-75 light:opacity-10" />

                <div className="relative h-full w-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<ScanPage theme={theme} user={user} />} />
                        <Route path="/payloads" element={<PayloadsPage theme={theme} />} />
                        <Route path="/scans" element={<ScanHistoryPage theme={theme} />} />
                        <Route path="/results/:scanId" element={<ScanResultsPage theme={theme} />} />
                    </Routes>
                </div>
            </main>

            {/* Profile Detail Inspector Modal overlay */}
            {showProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="w-full max-w-xs rounded border border-zinc-700 bg-[#242424] shadow-2xl dark:border-zinc-700 dark:bg-[#242424] light:border-zinc-300 light:bg-[#ffffff] light:text-zinc-900 overflow-hidden font-sans">
                        
                        <div className="flex items-center justify-between border-b border-zinc-700 bg-[#2e2e2e] px-4 py-2 dark:border-zinc-700 dark:bg-[#2e2e2e] light:border-zinc-300 light:bg-[#e5e7eb]">
                            <span className="text-[10px] font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-900">
                                User Profile details
                            </span>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="text-zinc-400 hover:text-zinc-200 light:text-zinc-500 light:hover:text-zinc-800 text-xs font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 space-y-3.5 text-[11px] font-mono">
                            <div className="flex justify-between border-b border-zinc-700/40 pb-1.5 dark:border-zinc-700/40 light:border-zinc-200">
                                <span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400 uppercase text-[9px] font-bold">User ID:</span>
                                <span className="text-zinc-200 light:text-zinc-950 font-bold">{user.id}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-700/40 pb-1.5 dark:border-zinc-700/40 light:border-zinc-200">
                                <span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400 uppercase text-[9px] font-bold">Username:</span>
                                <span className="text-orange-400 dark:text-orange-400 light:text-orange-700 font-bold">{user.username}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-700/40 pb-1.5 dark:border-zinc-700/40 light:border-zinc-200">
                                <span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400 uppercase text-[9px] font-bold">Full Name:</span>
                                <span className="text-zinc-200 light:text-zinc-950 font-bold">{user.name}</span>
                            </div>
                            <div className="flex justify-between pb-0.5">
                                <span className="text-zinc-500 dark:text-zinc-500 light:text-zinc-400 uppercase text-[9px] font-bold">Email:</span>
                                <span className="text-zinc-200 light:text-zinc-950 font-bold select-all break-all">{user.email}</span>
                            </div>
                        </div>

                        <div className="border-t border-zinc-700/60 dark:border-zinc-700/60 light:border-zinc-200 bg-[#2b2b2b] dark:bg-[#2b2b2b] light:bg-[#f9fafb] p-2.5 text-right">
                            <button
                                onClick={() => setShowProfile(false)}
                                className="rounded bg-[#ff6600] hover:bg-[#e05a00] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black transition active:scale-95 cursor-pointer font-sans"
                            >
                                Close Panel
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    const [token, setTokenState] = useState(getToken());
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    // Sync theme on class list
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    // Load user details if token exists
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (err) {
                console.error("Failed to load user profile:", err);
                // Clear state on invalid/expired token
                removeToken();
                setTokenState(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleLoginSuccess = (newToken, username) => {
        setLoading(true);
        setToken(newToken);
        setTokenState(newToken);
    };

    const handleLogout = () => {
        removeToken();
        setTokenState(null);
        setUser(null);
    };

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#151515] text-zinc-300 font-mono">
                <div className="text-center space-y-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-400 border-t-transparent mx-auto"></div>
                    <p className="text-xs uppercase tracking-widest text-zinc-500">Intializing Security Console...</p>
                </div>
            </div>
        );
    }

    // Redirect to AuthPage if user is unauthenticated
    if (!token || !user) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <BrowserRouter>
            <MainAppContent
                theme={theme}
                toggleTheme={toggleTheme}
                user={user}
                setUser={setUser}
                handleLogout={handleLogout}
            />
        </BrowserRouter>
    );
}

export default App;