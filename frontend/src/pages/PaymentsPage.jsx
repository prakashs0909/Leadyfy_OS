import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/EmptyState';
import { CreditCard, Plus } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    order: '',
    invoiceAmount: 3850,
    amountReceived: 3850,
    method: 'Bank Transfer',
    transactionRef: '',
    notes: '',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/payments');
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payments ledger');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [cRes, oRes] = await Promise.all([
        api.get('/clients'),
        api.get('/orders'),
      ]);
      if (cRes.data.success) setClients(cRes.data.clients);
      if (oRes.data.success) setOrders(oRes.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchDropdowns();
  }, []);

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/payments', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <span>Client Receivables & Invoices Ledger</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Tracks client payments, outstanding balances, payment methods, and transaction reference logs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-amber-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Client Payment</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading payment ledger..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPayments} />
      ) : payments.length === 0 ? (
        <EmptyState title="No payments recorded" description="Client invoice payments will appear here." />
      ) : (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Client / Company</th>
                <th className="py-3.5 px-4">Invoice Amount</th>
                <th className="py-3.5 px-4">Amount Received</th>
                <th className="py-3.5 px-4">Pending Balance</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Method & Ref</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {payments.map((pay) => (
                <tr key={pay._id} className="hover:bg-zinc-900/50 transition">
                  <td className="py-3.5 px-4 font-bold text-zinc-100">
                    {pay.client?.companyName || pay.client?.clientName}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-zinc-200">${pay.invoiceAmount}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">${pay.amountReceived}</td>
                  <td className="py-3.5 px-4 font-bold text-rose-400">${pay.pendingBalance}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">
                    {pay.method} ({pay.transactionRef || 'N/A'})
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={pay.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Client Payment">
        <form onSubmit={handleRecordSubmit} className="space-y-4 text-xs">
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
              <label className="block text-zinc-300 font-semibold mb-1">Select Order *</label>
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
                    <option key={o._id} value={o._id}>{o.packageName}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Invoice Amount ($) *</label>
              <input
                type="number"
                required
                value={formData.invoiceAmount}
                onChange={(e) => setFormData({ ...formData, invoiceAmount: Number(e.target.value) })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Amount Received ($) *</label>
              <input
                type="number"
                required
                value={formData.amountReceived}
                onChange={(e) => setFormData({ ...formData, amountReceived: Number(e.target.value) })}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Payment Method & Reference</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal</option>
              </select>
              <input
                type="text"
                value={formData.transactionRef}
                onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none"
                placeholder="Transaction Ref #..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Save Payment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
