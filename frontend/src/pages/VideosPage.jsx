import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import KanbanBoard from '../components/KanbanBoard';
import Modal from '../components/Modal';
import { LoadingState, ErrorState } from '../components/EmptyState';
import { Video, Filter, Plus } from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urgencyFilter, setUrgencyFilter] = useState('');

  // Selected Video Details Modal State
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      let query = '';
      if (urgencyFilter) query = `?urgency=${urgencyFilter}`;
      const res = await api.get(`/videos${query}`);
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video production board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [urgencyFilter]);

  const handleStatusChange = async (videoId, newStatus) => {
    try {
      const res = await api.patch(`/videos/${videoId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchVideos();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update video stage');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-100 flex items-center space-x-2">
            <Video className="w-5 h-5 text-amber-500" />
            <span>Video Production Pipeline Kanban</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Linear, state-enforced 9-stage video production pipeline from Script Approved to Final Delivery.
          </p>
        </div>

        {/* Editor Urgency Filter */}
        <div className="flex items-center space-x-2 bg-[#111111] p-1.5 rounded-xl border border-zinc-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2" />
          <span className="text-zinc-400 font-semibold">Urgency:</span>
          {['', 'Overdue', 'Due Today', 'Due Tomorrow', 'Completed'].map((urg) => (
            <button
              key={urg}
              onClick={() => setUrgencyFilter(urg)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                urgencyFilter === urg
                  ? 'bg-amber-500 text-black'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              {urg === '' ? 'All Videos' : urg}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading 9-stage video production board..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchVideos} />
      ) : (
        <KanbanBoard
          videos={videos}
          onStatusChange={handleStatusChange}
          onOpenDetails={(v) => setSelectedVideo(v)}
        />
      )}

      {/* Video Details Modal */}
      {selectedVideo && (
        <Modal isOpen={!!selectedVideo} onClose={() => setSelectedVideo(null)} title={selectedVideo.title}>
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between">
              <div>
                <span className="text-zinc-500">Client:</span>
                <span className="font-bold text-zinc-100 ml-2">{selectedVideo.client?.companyName}</span>
              </div>
              <div>
                <span className="text-zinc-500">Current Stage:</span>
                <span className="font-bold text-amber-400 ml-2">{selectedVideo.status}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-200 mb-2">Timestamped Feedback Log</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedVideo.feedbackLog?.length === 0 ? (
                  <p className="text-zinc-500 text-center py-2">No feedback logged yet.</p>
                ) : (
                  selectedVideo.feedbackLog?.map((fb, idx) => (
                    <div key={idx} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-bold text-amber-400">{fb.user} ({fb.userRole})</span>
                        <span className="text-zinc-500">{new Date(fb.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-zinc-300 font-mono text-[11px]">{fb.feedback}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
