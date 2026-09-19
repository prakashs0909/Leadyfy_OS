import React from 'react';
import { Inbox, AlertCircle, Loader2 } from 'lucide-react';

export function EmptyState({ title = 'No data found', description = 'There are no items matching your criteria.', action }) {
  return (
    <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
      <Inbox className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
      <h4 className="text-sm font-semibold text-zinc-300">{title}</h4>
      <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ message = 'Loading dataset...' }) {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
      <p className="text-xs text-zinc-400 font-medium">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'An error occurred while loading data.', onRetry }) {
  return (
    <div className="p-8 border border-rose-900/50 bg-rose-950/20 rounded-xl text-center">
      <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
      <p className="text-xs text-rose-300 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 px-3 py-1.5 rounded-lg border border-rose-700/50 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
