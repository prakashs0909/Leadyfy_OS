import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { LoadingState, ErrorState, EmptyState } from '../components/EmptyState';
import { History } from 'lucide-react';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/activity');
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activity audit trail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-500" />
            <span>System Audit Trail & Activity Logs</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            System-wide audit trail recording user actions, entity mutations, and operational timestamps.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading audit trail stream..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLogs} />
      ) : logs.length === 0 ? (
        <EmptyState title="No activity recorded" description="Actions logged in the system will appear here." />
      ) : (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-zinc-900/50 transition">
                  <td className="py-3 px-4 font-bold text-amber-400">{log.userName || 'System'} ({log.userRole})</td>
                  <td className="py-3 px-4 text-zinc-200">{log.action}</td>
                  <td className="py-3 px-4 text-purple-400">{log.entity}</td>
                  <td className="py-3 px-4 text-zinc-300 font-sans">{log.details}</td>
                  <td className="py-3 px-4 text-zinc-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
