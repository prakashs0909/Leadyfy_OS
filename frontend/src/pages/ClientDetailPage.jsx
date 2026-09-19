import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { LoadingState, ErrorState } from '../components/EmptyState';
import {
  Building,
  Mail,
  Phone,
  Edit,
  Package,
  FileText,
  Clapperboard,
  Video,
  CreditCard,
  HelpCircle,
  History,
  Plus,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  // Edit Client Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  // New Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    packageName: '10 UGC Growth Bundle',
    contractedVideoCount: 10,
    pricing: 3500,
    gstTax: 350,
  });

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/clients/${id}`);
      if (res.data.success) {
        setClientData(res.data);
        setEditFormData(res.data.client);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put(`/clients/${id}`, editFormData);
      if (res.data.success) {
        setIsEditModalOpen(false);
        fetchClientDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update client');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/orders', {
        client: id,
        ...orderFormData,
      });
      if (res.data.success) {
        setIsOrderModalOpen(false);
        fetchClientDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create order');
    }
  };

  if (loading) return <LoadingState message="Loading client centralized profile..." />;
  if (error) return <ErrorState message={error} onRetry={fetchClientDetails} />;

  const { client, relatedData } = clientData;

  const tabs = ['Overview', 'Orders', 'Scripts', 'Shoots', 'Videos', 'Invoices', 'Support', 'Activity'];

  return (
    <div className="space-y-6">
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Client Directory</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-700 hover:border-amber-500 rounded-xl text-xs text-zinc-200 font-semibold flex items-center space-x-1.5 transition"
          >
            <Edit className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase rounded-xl flex items-center space-x-1.5 shadow-lg shadow-amber-500/10 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Associated Order</span>
          </button>
        </div>
      </div>

      {/* Client Profile Header Banner */}
      <div className="p-6 bg-[#111111] border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-2xl shadow-inner">
            {client.clientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-zinc-100">{client.companyName}</h1>
              <StatusBadge status={client.status} />
            </div>
            <p className="text-xs text-amber-400/90 font-medium mt-0.5">Contact: {client.clientName}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-2">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{client.email}</span>
              </span>
              {client.phone && (
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{client.phone}</span>
                </span>
              )}
              <span className="flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-zinc-500" />
                <span>{client.industry || 'Beauty'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Centralized Hub Tabs */}
      <div className="border-b border-zinc-800 flex items-center space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition shrink-0 ${
              activeTab === tab
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#111111] border border-zinc-800 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Account Specifications</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Company Name:</span>
                <span className="font-semibold text-zinc-200">{client.companyName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Tax / GST ID:</span>
                <span className="font-mono text-zinc-300">{client.gstTaxId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Lead Source:</span>
                <span className="text-zinc-300">{client.source}</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#111111] border border-zinc-800 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Active Campaigns Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Total Package Orders:</span>
                <span className="font-bold text-zinc-100">{relatedData.orders.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Total Videos in Pipeline:</span>
                <span className="font-bold text-amber-400">{relatedData.videos.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Orders' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-300">Client Orders</h3>
          {relatedData.orders.map((ord) => (
            <div key={ord._id} className="p-4 bg-[#111111] border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-zinc-100 text-sm">{ord.packageName}</div>
                <div className="text-zinc-400 mt-0.5">Quota: {ord.contractedVideoCount} contracted videos</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-400">${ord.totalInvoiceAmount}</div>
                <StatusBadge status={ord.status} className="mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Videos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedData.videos.map((vid) => (
            <div key={vid._id} className="p-4 bg-[#111111] border border-zinc-800 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-zinc-100">{vid.title}</div>
              <StatusBadge status={vid.status} />
              {vid.finalDeliveryLink && (
                <a href={vid.finalDeliveryLink} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center space-x-1 mt-2">
                  <span>View Delivery Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Client Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Client Profile">
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={editFormData.companyName || ''}
              onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Client Contact Name *</label>
            <input
              type="text"
              required
              value={editFormData.clientName || ''}
              onChange={(e) => setEditFormData({ ...editFormData, clientName: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={updating} className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Create Order Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={`Create Order for ${client.companyName}`}>
        <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Package Name *</label>
            <input
              type="text"
              required
              value={orderFormData.packageName}
              onChange={(e) => setOrderFormData({ ...orderFormData, packageName: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Contracted Video Count *</label>
              <input
                type="number"
                required
                value={orderFormData.contractedVideoCount}
                onChange={(e) => setOrderFormData({ ...orderFormData, contractedVideoCount: Number(e.target.value) })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Package Price ($) *</label>
              <input
                type="number"
                required
                value={orderFormData.pricing}
                onChange={(e) => setOrderFormData({ ...orderFormData, pricing: Number(e.target.value) })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsOrderModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Create Order Package</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
