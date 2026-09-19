import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/EmptyState';
import { Receipt, Plus } from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Studio',
    amount: 500,
    notes: '',
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/expenses');
      if (res.data.success) {
        setExpenses(res.data.expenses);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/expenses', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        fetchExpenses();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <span>Agency Expenses Ledger</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Operational overhead categories: Salaries, Office, Studio, Equipment, Fuel, Payouts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-amber-500/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading expense ledger..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchExpenses} />
      ) : (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Recorded By</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-zinc-900/50 transition">
                  <td className="py-3.5 px-4 font-bold text-amber-400">{exp.category}</td>
                  <td className="py-3.5 px-4 font-bold text-zinc-100">${exp.amount}</td>
                  <td className="py-3.5 px-4 text-zinc-300">{exp.userName || exp.user?.name || 'System'}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">{exp.notes || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Agency Expense">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
            >
              <option value="Salaries">Salaries</option>
              <option value="Office">Office</option>
              <option value="Studio">Studio</option>
              <option value="Equipment">Equipment</option>
              <option value="Fuel">Fuel</option>
              <option value="Payouts">Payouts</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Amount ($) *</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
              placeholder="e.g. Gear rental invoice ref #9921"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg">Save Expense</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
