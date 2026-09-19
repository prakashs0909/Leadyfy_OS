import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { EmptyState, LoadingState, ErrorState } from '../components/EmptyState';
import { Users, Plus, Search, Filter, Mail, Phone, Building, ExternalLink, Edit, Trash2 } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State - strictly uses companyName!
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    whatsApp: '',
    businessName: '',
    industry: 'Beauty & Cosmetics',
    gstTaxId: '',
    source: 'Inbound Direct',
    status: 'Onboarding',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      let query = `?search=${search}`;
      if (statusFilter) query += `&status=${statusFilter}`;
      const res = await api.get(`/clients${query}`);
      if (res.data.success) {
        setClients(res.data.clients);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load client database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, statusFilter]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await api.post('/clients', formData);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setFormData({
          clientName: '',
          companyName: '',
          email: '',
          phone: '',
          whatsApp: '',
          businessName: '',
          industry: 'Beauty & Cosmetics',
          gstTaxId: '',
          source: 'Inbound Direct',
          status: 'Onboarding',
          notes: '',
        });
        fetchClients();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create client');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Client Management Directory</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized client accounts feeding down into orders, scripts, shoots, and billing.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-[#111111] border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search client name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 text-xs text-zinc-300 border border-zinc-800 rounded-lg px-3 py-2 outline-none focus:border-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="Lead">Lead</option>
            <option value="New">New</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Client Grid / Table */}
      {loading ? (
        <LoadingState message="Loading client accounts..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchClients} />
      ) : clients.length === 0 ? (
        <EmptyState title="No clients found" description="Create your first client account to launch orders." />
      ) : (
        <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Client / Brand</th>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Industry</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-zinc-900/50 transition">
                    <td className="py-3.5 px-4 font-bold text-zinc-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                          {client.clientName.charAt(0)}
                        </div>
                        <div>
                          <div>{client.clientName}</div>
                          <div className="text-[10px] text-zinc-500 font-normal">
                            {client.businessName || 'Brand Kit Attached'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-zinc-200">{client.companyName}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-zinc-300 flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="text-[10px] text-zinc-500 flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{client.industry || 'General Agency'}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/clients/${client._id}`)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-amber-400 text-xs font-semibold inline-flex items-center space-x-1 transition"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Onboard New Client Account">
        {formError && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Client Contact Name *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
                placeholder="e.g. Sophia Sterling"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Company Name * (schema verified)</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
                placeholder="e.g. Aura Beauty Labs LLC"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
                placeholder="client@brand.com"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
                placeholder="+1 (555) 000-1122"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
                placeholder="e.g. Beauty & Cosmetics"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
              >
                <option value="Lead">Lead</option>
                <option value="New">New</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Creating Client...' : 'Save Client Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
