import React from 'react';

export default function KpiCard({ title, value, icon: Icon, subtext, trend, highlight = false }) {
  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-amber-500/15 via-charcoal-900 to-charcoal-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
          : 'bg-[#111111] border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800/60 text-zinc-400'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className={`text-2xl font-bold tracking-tight ${highlight ? 'text-amber-400' : 'text-zinc-100'}`}>
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1.5 text-xs text-zinc-500">{subtext}</p>}
    </div>
  );
}
