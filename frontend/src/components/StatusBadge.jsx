import React from 'react';

const statusStyles = {
  // Client Statuses
  Lead: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  New: 'bg-blue-950/70 text-blue-400 border-blue-800',
  Onboarding: 'bg-purple-950/70 text-purple-400 border-purple-800',
  Active: 'bg-emerald-950/70 text-emerald-400 border-emerald-800',
  'On Hold': 'bg-amber-950/70 text-amber-400 border-amber-800',
  Completed: 'bg-emerald-950/70 text-emerald-400 border-emerald-800',
  Inactive: 'bg-red-950/70 text-red-400 border-red-800',

  // Order Statuses
  'In Production': 'bg-amber-950/70 text-amber-400 border-amber-800',
  'Partially Delivered': 'bg-sky-950/70 text-sky-400 border-sky-800',
  Cancelled: 'bg-red-950/70 text-red-400 border-red-800',

  // Script Statuses
  Draft: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  Assigned: 'bg-blue-950/70 text-blue-400 border-blue-800',
  'In Review': 'bg-purple-950/70 text-purple-400 border-purple-800',
  'Sent to Client': 'bg-sky-950/70 text-sky-400 border-sky-800',
  'Revision Required': 'bg-rose-950/70 text-rose-400 border-rose-800',
  Approved: 'bg-emerald-950/70 text-emerald-400 border-emerald-800',
  'Ready for Shoot': 'bg-amber-950/70 text-amber-400 border-amber-800',

  // Shoot Statuses
  Scheduled: 'bg-blue-950/70 text-blue-400 border-blue-800',
  Confirmed: 'bg-purple-950/70 text-purple-400 border-purple-800',
  'In Progress': 'bg-amber-950/70 text-amber-400 border-amber-800',
  'Reshoot Required': 'bg-rose-950/70 text-rose-400 border-rose-800',

  // Video Pipeline 9 Stages
  'Script Approved': 'bg-indigo-950/70 text-indigo-400 border-indigo-800',
  'Shoot Pending': 'bg-blue-950/70 text-blue-400 border-blue-800',
  'Raw Footage Received': 'bg-teal-950/70 text-teal-400 border-teal-800',
  'Video Editing': 'bg-amber-950/70 text-amber-400 border-amber-800',
  'Internal QA': 'bg-purple-950/70 text-purple-400 border-purple-800',
  'Client Review': 'bg-sky-950/70 text-sky-400 border-sky-800',
  Revision: 'bg-rose-950/70 text-rose-400 border-rose-800',
  'Final Approved': 'bg-emerald-950/70 text-emerald-400 border-emerald-800',
  Delivered: 'bg-emerald-950/70 text-emerald-400 border-emerald-800',

  // Payments / Payouts
  Paid: 'bg-emerald-950/70 text-emerald-400 border-emerald-800',
  'Partially Paid': 'bg-amber-950/70 text-amber-400 border-amber-800',
  Unpaid: 'bg-red-950/70 text-red-400 border-red-800',
  Overdue: 'bg-rose-950/70 text-rose-400 border-rose-800',
  Pending: 'bg-zinc-800 text-zinc-300 border-zinc-700',

  // Priority
  Urgent: 'bg-rose-950/80 text-rose-400 border-rose-700 font-bold animate-pulse',
  High: 'bg-amber-950/70 text-amber-400 border-amber-800',
  Medium: 'bg-blue-950/70 text-blue-400 border-blue-800',
  Low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

export default function StatusBadge({ status, className = '' }) {
  const badgeStyle = statusStyles[status] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
}
