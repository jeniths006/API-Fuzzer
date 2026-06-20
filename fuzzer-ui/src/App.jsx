import React, { useState, useEffect } from 'react';
import {fuzzPayload, getResults} from './services/ApiService';

function App() {
  const [results, setResults] = useState([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await getResults();
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

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

  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
      <div className="min-h-screen bg-gray-900 p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fuzzer Dashboard</h1>
          <button onClick={fetchData} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
            Refresh Data
          </button>
        </div>

        <label>
          Target Url: <input type="url" name="targetUrlInput" onChange={e => setTargetUrl(e.target.value)}/>
        </label>
        <p>Current URl: {targetUrl}</p>
          <button onClick={startScan}>
              Start Scan
          </button>
          <p>{message}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
            <tr className="border-b border-gray-700 bg-gray-800 text-gray-400">
              <th className="p-4">ID</th>
              <th className="p-4">Target URL</th>
              <th className="p-4">Payload</th>
              <th className="p-4">Status</th>
            </tr>
            </thead>
            <tbody>
            {results.map((res) => (
                <tr key={res.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-4">{res.id}</td>
                  <td className="p-4 text-blue-400 font-mono text-sm">{res.targetUrl}</td>
                  <td className="p-4">{res.payloadContent}</td>
                  <td className={`p-4 font-bold ${res.statusCode === 200 ? 'text-green-500' : 'text-red-500'}`}>
                    {res.statusCode}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default App;