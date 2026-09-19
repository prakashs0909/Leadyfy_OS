import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/EmptyState';
import { Clapperboard, MapPin, Calendar, CheckSquare, Plus } from 'lucide-react';

export default function ShootsPage() {
  const [shoots, setShoots] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    order: '',
    creator: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'Studio A (Natural Light)',
    cameraman: 'In-house Tech',
    specialNotes: '',
  });

  const fetchShoots = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/shoots');
      if (res.data.success) {
        setShoots(res.data.shoots);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shoots');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [cRes, oRes, crRes] = await Promise.all([
        api.get('/clients'),
        api.get('/orders'),
        api.get('/creators'),
      ]);
      if (cRes.data.success) setClients(cRes.data.clients);
      if (oRes.data.success) setOrders(oRes.data.orders);
      if (crRes.data.success) setCreators(crRes.data.creators);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShoots();
    fetchDropdowns();
  }, []);

  const toggleChecklist = async (shootId, currentChecklist, field) => {
    try {
      const updated = { ...currentChecklist, [field]: !currentChecklist[field] };
      const res = await api.patch(`/shoots/${shootId}/checklists`, { preShootChecklist: updated });
      if (res.data.success) {
        fetchShoots();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update checklist');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/shoots', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        fetchShoots();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule shoot');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <Clapperboard className="w-5 h-5 text-amber-500" />
            <span>Shoot Scheduling & Logistics</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Tracks location logistics, creator attendance, technical staffing, pre-shoot and post-shoot verification.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Shoot</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading scheduled video shoots..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchShoots} />
      ) : shoots.length === 0 ? (
        <EmptyState title="No shoots scheduled" description="Shoots scheduled for video production will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shoots.map((shoot) => {
            const pre = shoot.preShootChecklist || {};
            return (
              <div
                key={shoot._id}
                className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl shadow-lg hover:border-amber-500/30 transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      {shoot.client?.companyName}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-zinc-100 text-sm">
                        {new Date(shoot.date).toLocaleDateString()} at {shoot.time}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={shoot.status} />
                </div>

                <div className="text-xs text-zinc-300 space-y-1 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div className="flex items-center space-x-1.5 text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold">{shoot.location}</span>
                  </div>
                  <div className="text-zinc-400 text-[11px] pt-1">
                    Creator: <span className="text-zinc-200 font-semibold">{shoot.creator?.name || 'Assigned UGC Creator'}</span> | Cameraman: <span className="text-zinc-200 font-semibold">{shoot.cameraman}</span>
                  </div>
                </div>

                {/* Pre-Shoot Operational Checklist */}
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Pre-Shoot Verification Checklist
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pre.scriptApproved || false}
                        onChange={() => toggleChecklist(shoot._id, pre, 'scriptApproved')}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950"
                      />
                      <span className={pre.scriptApproved ? 'text-zinc-200 font-medium line-through opacity-70' : 'text-zinc-400'}>
                        Script Approved
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pre.creatorConfirmed || false}
                        onChange={() => toggleChecklist(shoot._id, pre, 'creatorConfirmed')}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950"
                      />
                      <span className={pre.creatorConfirmed ? 'text-zinc-200 font-medium line-through opacity-70' : 'text-zinc-400'}>
                        Creator Confirmed
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pre.locationPermission || false}
                        onChange={() => toggleChecklist(shoot._id, pre, 'locationPermission')}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950"
                      />
                      <span className={pre.locationPermission ? 'text-zinc-200 font-medium line-through opacity-70' : 'text-zinc-400'}>
                        Location Permit
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pre.clientProductReceived || false}
                        onChange={() => toggleChecklist(shoot._id, pre, 'clientProductReceived')}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950"
                      />
                      <span className={pre.clientProductReceived ? 'text-zinc-200 font-medium line-through opacity-70' : 'text-zinc-400'}>
                        Product Received
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Shoot Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Shoot Logistics">
        <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Select Client *</label>
              <select
                required
                value={formData.client}
                onChange={(e) => {
                  const selClient = e.target.value;
                  const cOrders = orders.filter((o) => (typeof o.client === 'object' ? o.client._id === selClient : o.client === selClient));
                  setFormData({ ...formData, client: selClient, order: cOrders[0]?._id || '' });
                }}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Client --</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>{c.companyName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Select Creator *</label>
              <select
                required
                value={formData.creator}
                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Creator --</option>
                {creators.map((cr) => (
                  <option key={cr._id} value={cr._id}>{cr.name} ({cr.location})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
                placeholder="10:00 AM"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Shoot Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              placeholder="Studio A / Beachside Set / Metro Gym"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Schedule Shoot</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
