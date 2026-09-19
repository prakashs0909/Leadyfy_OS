import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../components/EmptyState';
import { LayoutDashboard, CheckCircle2, MessageSquare, ExternalLink, HelpCircle, FileText, Video, Send } from 'lucide-react';

export default function ClientPortalPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Script Revision Modal
  const [selectedScript, setSelectedScript] = useState(null);
  const [scriptComment, setScriptComment] = useState('');

  // Video Revision Modal
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFeedback, setVideoFeedback] = useState('');
  const [feedbackPriority, setFeedbackPriority] = useState('Medium');

  // Support Ticket Modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const fetchClientPortal = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard');
      if (res.data.success) {
        setDashboard(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load client portal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientPortal();
  }, []);

  // Script Actions
  const handleApproveScript = async (scriptId) => {
    try {
      const res = await api.patch(`/scripts/${scriptId}/status`, { status: 'Approved', comment: 'Approved by client' });
      if (res.data.success) fetchClientPortal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve script');
    }
  };

  const handleRequestScriptRevision = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/scripts/${selectedScript._id}/status`, {
        status: 'Revision Required',
        comment: scriptComment,
      });
      if (res.data.success) {
        setSelectedScript(null);
        setScriptComment('');
        fetchClientPortal();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit revision');
    }
  };

  // Video Actions
  const handleApproveVideo = async (videoId) => {
    try {
      const res = await api.post(`/videos/${videoId}/approve`, {});
      if (res.data.success) fetchClientPortal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve video');
    }
  };

  const handleRequestVideoRevision = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/videos/${selectedVideo._id}/feedback`, {
        feedback: videoFeedback,
        priority: feedbackPriority,
      });
      if (res.data.success) {
        setSelectedVideo(null);
        setVideoFeedback('');
        fetchClientPortal();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  // Ticket Submission
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/support', {
        subject: ticketSubject,
        description: ticketDesc,
      });
      if (res.data.success) {
        setIsTicketModalOpen(false);
        setTicketSubject('');
        setTicketDesc('');
        fetchClientPortal();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit ticket');
    }
  };

  if (loading) return <LoadingState message="Loading client portal..." />;
  if (error) return <ErrorState message={error} onRetry={fetchClientPortal} />;

  const { clientProfile, kpis, orders, scripts, videos } = dashboard;

  return (
    <div className="space-y-6">
      {/* Client Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-charcoal-900 to-[#111111] border border-emerald-800/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/50">
            Isolated Client Portal
          </span>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-2">
            Welcome back, {clientProfile?.clientName || 'Client Partner'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review active scripts, approve draft videos, request edits, and access final deliverables.
          </p>
        </div>

        <button
          onClick={() => setIsTicketModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Submit Support Ticket</span>
        </button>
      </div>

      {/* Client KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111111] border border-zinc-800 rounded-xl">
          <div className="text-xs text-zinc-400">Active Orders</div>
          <div className="text-xl font-bold text-zinc-100 mt-1">{kpis.activeOrders}</div>
        </div>
        <div className="p-4 bg-[#111111] border border-zinc-800 rounded-xl">
          <div className="text-xs text-zinc-400">Videos Delivered</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{kpis.videosDelivered}</div>
        </div>
        <div className="p-4 bg-[#111111] border border-zinc-800 rounded-xl">
          <div className="text-xs text-zinc-400">Pending Approvals</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{kpis.pendingApprovals}</div>
        </div>
        <div className="p-4 bg-[#111111] border border-zinc-800 rounded-xl">
          <div className="text-xs text-zinc-400">Total Ordered Quota</div>
          <div className="text-xl font-bold text-zinc-100 mt-1">{kpis.totalVideosOrdered} vids</div>
        </div>
      </div>

      {/* Video Approval Section */}
      <div className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
          <Video className="w-4 h-4 text-amber-500" />
          <span>Video Review & Approval Portal</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((vid) => (
            <div key={vid._id} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">Video #{vid.videoNumber}</span>
                  <h4 className="font-bold text-zinc-100 text-sm">{vid.title}</h4>
                </div>
                <StatusBadge status={vid.status} />
              </div>

              {vid.driveLink && (
                <a
                  href={vid.finalDeliveryLink || vid.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-400 font-semibold hover:border-amber-500/50 transition"
                >
                  <span>{vid.status === 'Delivered' ? 'Open Final Delivery File' : 'Watch Draft Video Link'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Approval / Revision Actions */}
              {vid.status === 'Client Review' && (
                <div className="pt-2 flex items-center space-x-2 border-t border-zinc-800">
                  <button
                    onClick={() => handleApproveVideo(vid._id)}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition"
                  >
                    Approve Video
                  </button>
                  <button
                    onClick={() => setSelectedVideo(vid)}
                    className="flex-1 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold rounded-lg transition"
                  >
                    Request Revision
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Script Approval Section */}
      <div className="p-5 bg-[#111111] border border-zinc-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Script Approvals</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scripts.map((sc) => (
            <div key={sc._id} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-zinc-100 text-sm">{sc.title}</h4>
                <StatusBadge status={sc.status} />
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg text-zinc-300 font-mono line-clamp-3">
                "{sc.scriptText}"
              </div>

              {sc.status === 'Sent to Client' && (
                <div className="flex items-center space-x-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => handleApproveScript(sc._id)}
                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition"
                  >
                    Approve Script
                  </button>
                  <button
                    onClick={() => setSelectedScript(sc)}
                    className="flex-1 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold rounded-lg transition"
                  >
                    Request Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Script Revision Modal */}
      {selectedScript && (
        <Modal isOpen={!!selectedScript} onClose={() => setSelectedScript(null)} title="Request Script Revision">
          <form onSubmit={handleRequestScriptRevision} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Feedback Comments for Writer *</label>
              <textarea
                required
                rows={4}
                value={scriptComment}
                onChange={(e) => setScriptComment(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:border-amber-500 outline-none"
                placeholder="Specify what changes are required..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setSelectedScript(null)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-rose-600 text-white font-bold rounded-lg">Send Feedback</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Video Revision Modal */}
      {selectedVideo && (
        <Modal isOpen={!!selectedVideo} onClose={() => setSelectedVideo(null)} title={`Request Edits: ${selectedVideo.title}`}>
          <form onSubmit={handleRequestVideoRevision} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Timestamped Edit Instructions *</label>
              <textarea
                required
                rows={4}
                value={videoFeedback}
                onChange={(e) => setVideoFeedback(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:border-amber-500 outline-none"
                placeholder="e.g. 0:04 Trim silence, 0:12 fix color grade..."
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Priority</label>
              <select
                value={feedbackPriority}
                onChange={(e) => setFeedbackPriority(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setSelectedVideo(null)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-rose-600 text-white font-bold rounded-lg">Submit Edit Request</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Ticket Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Submit Client Support Query">
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Subject *</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
              placeholder="e.g. Question about order deliverables"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:border-amber-500 outline-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsTicketModalOpen(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-lg">Send Ticket</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
