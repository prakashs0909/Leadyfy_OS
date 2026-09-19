import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { EmptyState, LoadingState, ErrorState } from '../components/EmptyState';
import { FileText, Plus, CheckCircle, Clock, UserCheck, MessageSquare } from 'lucide-react';

export default function ScriptsPage() {
  const [scripts, setScripts] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    order: '',
    videoNumber: 1,
    title: '',
    creator: '',
    language: 'English',
    scriptText: '',
    status: 'Draft',
  });

  const fetchScripts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/scripts');
      if (res.data.success) {
        setScripts(res.data.scripts);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch scripts');
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
    fetchScripts();
    fetchDropdowns();
  }, []);

  const handleStatusChange = async (scriptId, newStatus) => {
    try {
      const res = await api.patch(`/scripts/${scriptId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchScripts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update script status');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/scripts', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({
          client: '',
          order: '',
          videoNumber: 1,
          title: '',
          creator: '',
          language: 'English',
          scriptText: '',
          status: 'Draft',
        });
        fetchScripts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create script');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>Scripting Operations & Review Hub</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manual operational drafting, writer assignments, client feedback loops, and shoot hand-off.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Draft New Script</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Fetching script repository..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchScripts} />
      ) : scripts.length === 0 ? (
        <EmptyState title="No scripts drafted" description="Scripts drafted for client campaigns will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scripts.map((script) => (
            <div
              key={script._id}
              className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl shadow-lg hover:border-amber-500/30 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                    {script.client?.companyName} • Video #{script.videoNumber}
                  </span>
                  <h3 className="text-base font-bold text-zinc-100 mt-0.5">{script.title}</h3>
                </div>
                <StatusBadge status={script.status} />
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 font-mono leading-relaxed line-clamp-3">
                "{script.scriptText}"
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
                <div className="text-zinc-400">
                  <span>Creator: </span>
                  <span className="font-semibold text-zinc-200">{script.creator?.name || 'Unassigned'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-zinc-500">Status:</span>
                  <select
                    value={script.status}
                    onChange={(e) => handleStatusChange(script._id, e.target.value)}
                    className="text-[11px] bg-zinc-950 text-zinc-200 border border-zinc-700 rounded px-2 py-1 outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Review">In Review</option>
                    <option value="Sent to Client">Sent to Client</option>
                    <option value="Revision Required">Revision Required</option>
                    <option value="Approved">Approved</option>
                    <option value="Ready for Shoot">Ready for Shoot</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Script Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Draft New Script">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Select Client *</label>
              <select
                required
                value={formData.client}
                onChange={(e) => {
                  const selectedClient = e.target.value;
                  const clientOrders = orders.filter((o) => o.client?._id === selectedClient || o.client === selectedClient);
                  setFormData({
                    ...formData,
                    client: selectedClient,
                    order: clientOrders[0]?._id || '',
                  });
                }}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Client --</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Associated Order *</label>
              <select
                required
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Order --</option>
                {orders
                  .filter((o) => (typeof o.client === 'object' ? o.client._id === formData.client : o.client === formData.client))
                  .map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.packageName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Script Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
                placeholder="e.g. Morning Skincare Hook"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Assign Creator</label>
              <select
                value={formData.creator}
                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              >
                <option value="">-- Select Creator --</option>
                {creators.map((cr) => (
                  <option key={cr._id} value={cr._id}>
                    {cr.name} ({cr.availability})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Script Text / Hook *</label>
            <textarea
              required
              rows={4}
              value={formData.scriptText}
              onChange={(e) => setFormData({ ...formData, scriptText: e.target.value })}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500 font-mono"
              placeholder="HOOK: Stop scrolling until you see this..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Save Script</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
