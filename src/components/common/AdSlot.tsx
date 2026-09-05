import React from 'react';

interface AdSlotProps {
  placement?: 'tool-top' | 'tool-bottom' | 'sidebar' | 'footer-banner';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement = 'tool-bottom', className = '' }) => {
  return (
    <div
      id={`ad-slot-${placement}`}
      className={`relative my-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 p-4 text-center text-xs text-slate-400 dark:text-slate-500 overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Advertisement</span>
        <span className="text-[10px] text-slate-400">Support Free Tools</span>
      </div>
      <div className="h-16 sm:h-20 flex flex-col items-center justify-center gap-1 rounded-lg bg-slate-200/40 dark:bg-slate-800/40 px-4">
        <span className="font-semibold text-slate-700 dark:text-slate-300">ToolNova Sponsor Space</span>
        <span className="text-[11px] text-slate-500">Reserved for ethical, non-tracking developer and productivity tools.</span>
      </div>
    </div>
  );
};
