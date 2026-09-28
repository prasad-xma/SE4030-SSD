import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:3000/api/admin/auth-logs";

const AuthLogs = () => {
  useAuth("admin");

  const [logs, setLogs] = useState([]);
  const [event, setEvent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = {};
    if (event) params.event = event;
    if (success) params.success = success;

    axios
      .get(API_URL, { params, withCredentials: true })
      .then((res) => {
        setLogs(res.data.data);
        setError("");
      })
      .catch(() => setError("Failed to load authentication logs."));
  }, [event, success]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-20 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Authentication Logs</h1>
        <p className="text-gray-500 mb-6">Latest 50 login attempts</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All events</option>
            <option value="password_login">Password login</option>
            <option value="google_login">Google login</option>
          </select>

          <select
            value={success}
            onChange={(e) => setSuccess(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All results</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{log.event}</td>
                  <td className={log.success ? "px-4 py-3 text-green-600" : "px-4 py-3 text-red-600"}>
                    {log.success ? "Success" : "Failed"}
                  </td>
                  <td className="px-4 py-3">{log.reason || "-"}</td>
                  <td className="px-4 py-3">{log.email || "-"}</td>
                  <td className="px-4 py-3">{log.ip || "-"}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthLogs;
