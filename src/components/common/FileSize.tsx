import React from 'react';
import {
  formatFileSize,
  parseFileSize,
  calculateSizeSavings,
  FormatFileSizeOptions,
  SizeSavingsMetrics,
} from '../../utils/fileSize';
import { ArrowRight, CheckCircle2, TrendingDown } from 'lucide-react';

export interface FileSizeProps {
  /** The size in bytes */
  bytes: number | null | undefined;
  /** Formatting configuration (decimals, standard, etc.) */
  options?: FormatFileSizeOptions;
  /** Whether to show a badge container around the size */
  showBadge?: boolean;
  /** Badge color variant */
  variant?: 'neutral' | 'indigo' | 'emerald' | 'amber';
  /** Show the exact byte count on hover tooltip. Default: true */
  showExactTooltip?: boolean;
  /** Custom extra CSS classes */
  className?: string;
  /** Optional prefix (e.g. '+', '-', '~') */
  prefix?: string;
  /** Optional suffix */
  suffix?: string;
}

/**
 * Standardized component for rendering file sizes consistently across the application.
 */
export const FileSize: React.FC<FileSizeProps> = ({
  bytes,
  options,
  showBadge = false,
  variant = 'neutral',
  showExactTooltip = true,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const { formatted, exactString } = parseFileSize(bytes, options);
  const displayText = `${prefix}${formatted}${suffix ? ' ' + suffix : ''}`;

  const variantStyles = {
    neutral:
      'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700/60',
    indigo:
      'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    emerald:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    amber:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };

  if (showBadge) {
    return (
      <span
        title={showExactTooltip ? exactString : undefined}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
      >
        {displayText}
      </span>
    );
  }

  return (
    <span
      title={showExactTooltip ? exactString : undefined}
      className={`font-medium ${className}`}
    >
      {displayText}
    </span>
  );
};

export interface FileSizeComparisonProps {
  originalBytes: number;
  newBytes: number;
  options?: FormatFileSizeOptions;
  layout?: 'compact' | 'inline' | 'card';
  className?: string;
}

/**
 * Standardized component for comparing original vs compressed/processed file sizes.
 */
export const FileSizeComparison: React.FC<FileSizeComparisonProps> = ({
  originalBytes,
  newBytes,
  options,
  layout = 'inline',
  className = '',
}) => {
  const metrics: SizeSavingsMetrics = calculateSizeSavings(originalBytes, newBytes, options);

  if (layout === 'card') {
    return (
      <div
        className={`p-4 rounded-xl border transition ${
          metrics.isSmaller
            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
            : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
        } ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {metrics.isSmaller ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-neutral-500" />
              )}
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {metrics.isSmaller ? 'Size Reduced Successfully' : 'Processed Size'}
              </span>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
              <span>Original:</span>
              <FileSize bytes={metrics.originalBytes} className="font-semibold text-neutral-900 dark:text-white" />
              <ArrowRight className="w-3 h-3 text-neutral-400" />
              <span>Result:</span>
              <FileSize
                bytes={metrics.newBytes}
                className={`font-semibold ${
                  metrics.isSmaller ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {metrics.isSmaller ? (
              <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1">
                <span>-{metrics.percentRounded}%</span>
                <span className="text-[11px] font-normal">({metrics.formattedSavings} saved)</span>
              </span>
            ) : metrics.isEqual ? (
              <span className="px-2.5 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium">
                Identical size
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-medium">
                +{metrics.formattedDifference}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
        <FileSize bytes={metrics.originalBytes} className="text-neutral-500 line-through" />
        <ArrowRight className="w-3 h-3 text-neutral-400" />
        <FileSize bytes={metrics.newBytes} className="font-bold text-neutral-900 dark:text-white" />
        {metrics.isSmaller && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            -{metrics.percentRounded}%
          </span>
        )}
      </div>
    );
  }

  // Default: inline
  return (
    <div className={`flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300 ${className}`}>
      <span>Original:</span>
      <FileSize bytes={metrics.originalBytes} className="font-semibold text-neutral-900 dark:text-white" />
      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
      <span>Compressed:</span>
      <FileSize
        bytes={metrics.newBytes}
        className={`font-semibold ${
          metrics.isSmaller ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-900 dark:text-white'
        }`}
      />
      {metrics.isSmaller && (
        <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          -{metrics.percentRounded}% ({metrics.formattedSavings} saved)
        </span>
      )}
    </div>
  );
};

// Re-export core utilities for convenient single-import usage
export { formatFileSize, parseFileSize, calculateSizeSavings, type FormatFileSizeOptions, type SizeSavingsMetrics };
export default FileSize;
