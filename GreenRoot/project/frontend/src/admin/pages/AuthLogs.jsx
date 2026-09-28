import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import BackButton from "../components/BackButton";
import { ShieldCheck, RefreshCw, Filter } from "lucide-react";

const API_URL = "http://localhost:3000/api/admin/auth-logs";

const AuthLogs = () => {
  useAuth("admin");

  const [logs, setLogs] = useState([]);
  const [event, setEvent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    const params = {};
    if (event) params.event = event;
    if (success) params.success = success;

    axios
      .get(API_URL, { params, withCredentials: true })
      .then((res) => {
        setLogs(res.data.data || []);
        setError("");
      })
      .catch(() => setError("Failed to load authentication logs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [event, success]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-20 p-8">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Authentication Logs</h1>
                <p className="text-sm text-gray-500">Real-time authentication events, status badges, and IP tracking</p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition duration-150 cursor-pointer"
                title="Refresh logs"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold">Filter:</span>
            </div>

            <div>
              <label htmlFor="event-filter" className="sr-only">Event Filter</label>
              <select
                id="event-filter"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none shadow-sm"
              >
                <option value="">All events</option>
                <option value="password_login">Password login</option>
                <option value="google_login">Google login</option>
              </select>
            </div>

            <div>
              <label htmlFor="result-filter" className="sr-only">Result Filter</label>
              <select
                id="result-filter"
                value={success}
                onChange={(e) => setSuccess(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none shadow-sm"
              >
                <option value="">All results</option>
                <option value="true">Success</option>
                <option value="false">Failed</option>
              </select>
            </div>

            <div className="text-sm text-gray-500 ml-auto">
              Showing <span className="font-semibold text-gray-800">{logs.length}</span> latest records
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Time</th>
                  <th className="px-4 py-3.5">Event</th>
                  <th className="px-4 py-3.5">Result</th>
                  <th className="px-4 py-3.5">Reason</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        {log.event}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          log.success
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {log.reason ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                          {log.reason}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-900 font-medium whitespace-nowrap">
                      {log.email || <span className="text-gray-400 font-normal">-</span>}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {log.ip ? (
                        <code className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-mono border border-gray-200">
                          {log.ip}
                        </code>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 font-medium">
                      No authentication logs found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogs;
