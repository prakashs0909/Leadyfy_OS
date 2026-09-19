import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { EmptyState, LoadingState, ErrorState } from '../components/EmptyState';
import { Package, Plus, DollarSign, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-500" />
            <span>Package & Order Management</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Commercial commitments and real-time video quota tracking across active accounts.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Calculating live video quota statistics..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders active" description="Create an order package from the client profile page." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => {
            const stats = order.quotaStats || {};
            return (
              <div
                key={order._id}
                className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl shadow-lg hover:border-amber-500/30 transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                      {order.client?.companyName || 'Agency Client'}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100 mt-0.5">{order.packageName}</h3>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Video Production Live Quota Counter */}
                <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-semibold uppercase tracking-wider">Video Production Quota</span>
                    <span className="font-bold text-amber-400">
                      {stats.deliveredVideos || 0} / {stats.orderedVideos || 10} Delivered
                    </span>
                  </div>

                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, ((stats.deliveredVideos || 0) / (stats.orderedVideos || 10)) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px]">
                    <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                      <div className="text-zinc-500">Ordered</div>
                      <div className="font-bold text-zinc-200">{stats.orderedVideos}</div>
                    </div>
                    <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                      <div className="text-zinc-500">Assigned</div>
                      <div className="font-bold text-blue-400">{stats.assignedVideos}</div>
                    </div>
                    <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                      <div className="text-zinc-500">Completed</div>
                      <div className="font-bold text-purple-400">{stats.completedVideos}</div>
                    </div>
                    <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                      <div className="text-zinc-500">Remaining</div>
                      <div className="font-bold text-amber-400">{stats.remainingQuota}</div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
                  <div>
                    <span className="text-zinc-500">Invoice Total:</span>
                    <span className="font-bold text-zinc-100 ml-1.5">${order.totalInvoiceAmount}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Outstanding:</span>
                    <span className="font-bold text-rose-400 ml-1.5">${order.outstandingBalance}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
