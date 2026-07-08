import { useState } from "react";
import { loginUser, registerUser } from "../services/ApiService.js";

export default function AuthPage({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (isLogin) {
                const data = await loginUser(username, password);
                onLoginSuccess(data.token, data.username);
            } else {
                await registerUser(username, name, email, password);
                setSuccess("Account registered! Please sign in with your credentials.");
                setIsLogin(true);
                // Clear fields
                setName("");
                setEmail("");
                setPassword("");
            }
        } catch (err) {
            console.error("Authentication error details:", err);
            const msg = err.response?.data?.message || err.response?.data || "Request rejected. Please check connection and credentials.";
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#181818] p-6 text-zinc-300 dark:bg-[#181818] light:bg-[#f3f4f6] light:text-zinc-800 transition-colors duration-200 font-sans">
            
            {/* Desktop tool style frame - compact and flat */}
            <div className="w-full max-w-sm rounded border border-zinc-700/80 bg-[#242424] shadow-lg dark:border-zinc-700/80 dark:bg-[#242424] light:border-zinc-300 light:bg-[#ffffff] overflow-hidden">
                
                {/* Header bar (Mimics Burp Suite's frame headers) */}
                <div className="flex items-center justify-between border-b border-zinc-700 bg-[#2e2e2e] px-4 py-2.5 dark:border-zinc-700 dark:bg-[#2e2e2e] light:border-zinc-300 light:bg-[#e5e7eb]">
                    <div className="flex items-center gap-2">
                        <div className="grid h-6 w-6 place-items-center rounded bg-[#3a2a1d] text-[9px] font-black text-orange-400 border border-orange-400/40">
                            AF
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider dark:text-zinc-100 light:text-zinc-900">
                            API Fuzzer Login
                        </span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 light:text-zinc-500">
                        v1.0.0
                    </span>
                </div>

                {/* Sub-tabs with Orange highlight on active */}
                <div className="flex border-b border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-[#2b2b2b] dark:bg-[#2b2b2b] light:bg-[#f3f4f6]">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                        className={`flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider transition ${
                            isLogin
                                ? "border-b border-[#ff6600] bg-[#1f1f1f] text-[#ff6600] dark:bg-[#1f1f1f] light:bg-[#ffffff]"
                                : "text-zinc-400 hover:text-zinc-200 dark:text-zinc-400 light:text-zinc-600 light:hover:text-zinc-800"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                        className={`flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider transition ${
                            !isLogin
                                ? "border-b border-[#ff6600] bg-[#1f1f1f] text-[#ff6600] dark:bg-[#1f1f1f] light:bg-[#ffffff]"
                                : "text-zinc-400 hover:text-zinc-200 dark:text-zinc-400 light:text-zinc-600 light:hover:text-zinc-800"
                        }`}
                    >
                        New Account
                    </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
                    
                    {error && (
                        <div className="p-2 rounded border border-rose-500 bg-rose-950/20 text-rose-400 light:bg-rose-50 light:text-rose-700 font-mono text-[10.5px]">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-2 rounded border border-emerald-500 bg-emerald-950/20 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 font-mono text-[10.5px]">
                            ✅ {success}
                        </div>
                    )}

                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 light:text-zinc-500">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 light:text-zinc-500">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jane@example.com"
                                    className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 light:text-zinc-500">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                            className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 light:text-zinc-500">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            className="w-full rounded border border-zinc-700 bg-[#161616] px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-[#ff6600] dark:border-zinc-700 dark:bg-[#161616] light:border-zinc-300 light:bg-[#f9fafb] light:text-zinc-950 font-mono"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-3 rounded bg-[#ff6600] hover:bg-[#e05a00] py-2 text-xs font-bold uppercase tracking-widest text-black transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Authenticating..." : isLogin ? "Sign In" : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}
