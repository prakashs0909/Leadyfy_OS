import React from 'react';
import StatusBadge from './StatusBadge';
import { ExternalLink, MessageSquare, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

const stages = [
  'Script Approved',
  'Shoot Pending',
  'Raw Footage Received',
  'Video Editing',
  'Internal QA',
  'Client Review',
  'Revision',
  'Final Approved',
  'Delivered',
];

export default function KanbanBoard({ videos, onStatusChange, onOpenDetails, isClientView = false }) {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-6 pt-2">
      {stages.map((stage) => {
        const stageVideos = videos.filter((v) => v.status === stage);

        return (
          <div
            key={stage}
            className="w-80 shrink-0 bg-[#111111] border border-zinc-800/80 rounded-xl flex flex-col max-h-[75vh]"
          >
            {/* Column Header */}
            <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between sticky top-0 rounded-t-xl z-10">
              <span className="text-xs font-bold text-zinc-200 tracking-wide">{stage}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {stageVideos.length}
              </span>
            </div>

            {/* Column Content Cards */}
            <div className="p-3 overflow-y-auto space-y-3 flex-1">
              {stageVideos.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-600 border border-dashed border-zinc-800/60 rounded-lg">
                  No videos in stage
                </div>
              ) : (
                stageVideos.map((video) => (
                  <div
                    key={video._id}
                    className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl hover:border-amber-500/40 transition shadow-sm space-y-3 group"
                  >
                    {/* Thumbnail Preview */}
                    {video.thumbnail && (
                      <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black border border-zinc-800">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {video.urgency && video.urgency !== 'Normal' && (
                          <div className="absolute top-2 right-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                video.urgency === 'Overdue'
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : video.urgency === 'Due Today'
                                  ? 'bg-amber-500 text-black'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {video.urgency}
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                          Video #{video.videoNumber}
                        </span>
                      </div>
                    )}

                    {/* Card Title & Client */}
                    <div>
                      <h5
                        onClick={() => onOpenDetails && onOpenDetails(video)}
                        className="text-xs font-bold text-zinc-100 hover:text-amber-400 cursor-pointer line-clamp-1"
                      >
                        {video.title}
                      </h5>
                      <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                        {video.client?.companyName || video.client?.clientName || 'Agency Client'}
                      </p>
                    </div>

                    {/* Revisions & Feedback indicator */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-zinc-400" />
                        <span>{video.feedbackLog?.length || 0} feedback</span>
                      </div>

                      {video.revisionCount > 0 && (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40">
                          Rev #{video.revisionCount}
                        </span>
                      )}
                    </div>

                    {/* Drive Link / Final Delivery */}
                    {(video.finalDeliveryLink || video.driveLink) && (
                      <a
                        href={video.finalDeliveryLink || video.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/20 transition"
                      >
                        <span>{video.status === 'Delivered' ? 'Final Delivery Link' : 'Raw / Draft Link'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* Quick Stage Move Dropdown (Internal roles only) */}
                    {!isClientView && (
                      <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                        <span className="text-[10px] text-zinc-500 font-medium">Stage:</span>
                        <select
                          value={video.status}
                          onChange={(e) => onStatusChange(video._id, e.target.value)}
                          className="text-[11px] bg-zinc-950 text-zinc-200 border border-zinc-700 rounded px-2 py-1 focus:border-amber-500 outline-none"
                        >
                          {stages.map((stg) => (
                            <option key={stg} value={stg}>
                              {stg}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
