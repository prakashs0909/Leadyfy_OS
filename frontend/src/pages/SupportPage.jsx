import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/EmptyState';
import { HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/support');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, status) => {
    try {
      const res = await api.put(`/support/${ticketId}`, { status });
      if (res.data.success) fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>Client Support Ticketing System</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            In-portal ticketing system for client queries, issues, and operational resolution tracking.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading support tickets..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTickets} />
      ) : tickets.length === 0 ? (
        <EmptyState title="No support tickets open" description="Support tickets submitted by clients will appear here." />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t._id} className="p-4 bg-[#111111] border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-zinc-100 text-sm">{t.subject}</span>
                  <StatusBadge status={t.priority} />
                </div>
                <p className="text-zinc-400">{t.description}</p>
                <div className="text-[10px] text-zinc-500">
                  Client: {t.client?.companyName} | Date: {new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <StatusBadge status={t.status} />
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t._id, e.target.value)}
                  className="bg-zinc-950 text-xs text-zinc-200 border border-zinc-700 rounded px-2 py-1 outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
