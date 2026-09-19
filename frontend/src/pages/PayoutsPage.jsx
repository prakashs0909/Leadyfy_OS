import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/EmptyState';
import { DollarSign, Plus } from 'lucide-react';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    creator: '',
    order: '',
    videoCount: 1,
    contractedRate: 180,
    totalPayout: 180,
    reference: '',
    status: 'Pending',
  });

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/payouts');
      if (res.data.success) {
        setPayouts(res.data.payouts);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch creator payouts ledger');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [crRes, oRes] = await Promise.all([
        api.get('/creators'),
        api.get('/orders'),
      ]);
      if (crRes.data.success) setCreators(crRes.data.creators);
      if (oRes.data.success) setOrders(oRes.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayouts();
    fetchDropdowns();
  }, []);

  const handleStatusChange = async (payoutId, status) => {
    try {
      const res = await api.patch(`/payouts/${payoutId}/status`, { status });
      if (res.data.success) {
        fetchPayouts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payout status');
    }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/payouts', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        fetchPayouts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record creator payout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            <span>Creator Payouts Ledger</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Tracks contracted rate payouts per completed shoot/video and prevents duplicate payment entries.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-amber-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Creator Payout</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading creator payout records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPayouts} />
      ) : payouts.length === 0 ? (
        <EmptyState title="No payout records" description="Creator payouts will be generated here." />
      ) : (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Creator</th>
                <th className="py-3.5 px-4">Contracted Rate</th>
                <th className="py-3.5 px-4">Video Count</th>
                <th className="py-3.5 px-4">Total Payout</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {payouts.map((p) => (
                <tr key={p._id} className="hover:bg-zinc-900/50 transition">
                  <td className="py-3.5 px-4 font-bold text-zinc-100">{p.creator?.name}</td>
                  <td className="py-3.5 px-4 text-zinc-400">${p.contractedRate}/vid</td>
                  <td className="py-3.5 px-4 font-bold text-zinc-200">{p.videoCount}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">${p.totalPayout}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-500">{p.reference || 'N/A'}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p._id, e.target.value)}
                      className="bg-zinc-950 text-xs border border-zinc-700 rounded px-2 py-1 outline-none text-zinc-200"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payout Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Creator Payout">
        <form onSubmit={handleRecordSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Select Creator *</label>
              <select
                required
                value={formData.creator}
                onChange={(e) => {
                  const selCreator = creators.find((c) => c._id === e.target.value);
                  const rate = selCreator?.rates?.perVideo || 180;
                  setFormData({
                    ...formData,
                    creator: e.target.value,
                    contractedRate: rate,
                    totalPayout: rate * formData.videoCount,
                  });
                }}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Creator --</option>
                {creators.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Select Order</label>
              <select
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Order --</option>
                {orders.map((o) => (
                  <option key={o._id} value={o._id}>{o.packageName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Video Count</label>
              <input
                type="number"
                value={formData.videoCount}
                onChange={(e) => {
                  const cnt = Number(e.target.value) || 1;
                  setFormData({
                    ...formData,
                    videoCount: cnt,
                    totalPayout: formData.contractedRate * cnt,
                  });
                }}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Rate ($/vid)</label>
              <input
                type="number"
                value={formData.contractedRate}
                onChange={(e) => {
                  const r = Number(e.target.value) || 0;
                  setFormData({
                    ...formData,
                    contractedRate: r,
                    totalPayout: r * formData.videoCount,
                  });
                }}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Total Payout ($)</label>
              <input
                type="number"
                value={formData.totalPayout}
                onChange={(e) => setFormData({ ...formData, totalPayout: Number(e.target.value) })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-amber-400 font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Payout Reference #</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              placeholder="e.g. PAYOUT-CREATOR-991"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Save Payout</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
