import React, { useState, useEffect } from 'react';
import {fuzzPayload, getResults, getScanResults} from './services/ApiService';

function App() {
  const [results, setResults] = useState([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [message, setMessage] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [scanId, setScanId] = useState("");

  const fetchData = async () => {
    try {
      const response = await getResults();
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const fetchScanResults = async () => {
    if (!scanId.trim() || scanId == null) {
      setMessage("Please enter a valid scan ID");
      return;
    }

    try {
      const response = await getScanResults(scanId);
      setResults(response.data);
    } catch (error) {
      setMessage("Error fetching scan results");
    }
  }


  const startScan = async () => {
    if (!targetUrl.trim() || targetUrl == null) {
      setMessage("Please enter a valid URL");
      return;
    }

    try {
      await fuzzPayload(targetUrl);
      setMessage("Scan started successfully");
    } catch (error) {
      setMessage("Error starting scan");
    }
  };



  const getRowColor = (res) => {
      if (res.statusCode >= 500) return "bg-red-900/30";
      if (res.responseTime > 500) return "bg-yellow-900/20";
      return "";
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-900/40 border border-gray-800 rounded-xl p-6 shadow-lg">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            API Fuzzer
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Security testing dashboard for payload-based API fuzzing
          </p>
        </div>

        {/* INPUT ROW */}
        <div className="flex gap-3 items-center mb-6 p-3 bg-gray-900 rounded-lg border border-gray-800">
          <input
            type="url"
            placeholder="Enter target URL..."
            className="flex-1 p-2 rounded bg-gray-950 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
            onChange={(e) => setTargetUrl(e.target.value)}
          />

          <button
            onClick={startScan}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold text-sm transition"
          >
            Start Scan
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 p-3 rounded-lg bg-gray-950 border border-gray-800 text-sm text-gray-300">
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Enter Scan ID..."
          className="flex-1 p-2 rounded bg-gray-950 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
          onChange={(e) => setScanId(e.target.value)}
         />

        <button
          onClick={fetchScanResults}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold text-sm transition"
         >
          Show Scan Results
        </button>

        {/* TABLE */}
        <div className="rounded-xl overflow-hidden border border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Target URL</th>
                <th className="p-3">Payload</th>
                <th className="p-3">Status</th>
                <th className="p-3">Method</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {results.map((res) => (
                <tr
                    key={res.id}
                    onClick={() => setSelectedResult(res)}
                    className={`border-t border-gray-800 hover:bg-gray-900/60 transition cursor-pointer ${getRowColor(res)}`}
                >
                  <td className="p-3">{res.id}</td>

                  <td className="p-3 font-mono text-xs text-blue-300">
                    {res.targetUrl}
                  </td>

                  <td className="p-3">
                    {res.payloadContent}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        res.statusCode === 200
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {res.statusCode}
                    </span>
                  </td>
                  <td>{res.httpMethod}</td>
                  <td>{new Date(res.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
