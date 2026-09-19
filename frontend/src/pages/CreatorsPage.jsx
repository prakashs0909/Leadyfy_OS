import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { EmptyState, LoadingState, ErrorState } from '../components/EmptyState';
import { UserCheck, Plus, MapPin, DollarSign, ExternalLink } from 'lucide-react';

export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/creators');
      if (res.data.success) {
        setCreators(res.data.creators);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch creator directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <span>Creator Database & Workload Management</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            UGC content creators with availability tracking to eliminate double-booking.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading UGC creator profiles..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCreators} />
      ) : creators.length === 0 ? (
        <EmptyState title="No creators listed" description="Add UGC creators to match with client video shoots." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creators.map((creator) => (
            <div
              key={creator._id}
              className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl shadow-lg hover:border-amber-500/30 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={creator.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={creator.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/30"
                  />
                  <div>
                    <h3 className="font-bold text-zinc-100 text-sm">{creator.name}</h3>
                    <div className="text-[10px] text-zinc-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span>{creator.location || 'Remote US'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {creator.niches?.map((niche) => (
                    <span key={niche} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                      {niche}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  {creator.rates?.perVideo && (
                    <div className="text-[11px] text-zinc-400">
                      Rate: <span className="font-bold text-amber-400">${creator.rates.perVideo}/vid</span>
                    </div>
                  )}
                </div>
                <StatusBadge status={creator.availability} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
