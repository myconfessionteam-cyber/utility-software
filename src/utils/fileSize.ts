export interface FormatFileSizeOptions {
  /** Number of decimal places. If undefined, uses intelligent adaptive precision:
   *  - Bytes: 0 decimals (e.g. 450 B)
   *  - KB: 1 decimal (e.g. 24.5 KB)
   *  - MB: 1-2 decimals (e.g. 1.85 MB)
   *  - GB+: 2 decimals (e.g. 2.45 GB)
   */
  decimals?: number;
  /** Binary (1024 base - standard in OS and file systems) or Decimal (1000 base - SI). Default: 'binary' */
  standard?: 'binary' | 'decimal';
  /** Whether to include a space between the number and the unit. Default: true */
  space?: boolean;
  /** Whether to prefix positive numbers with '+' (useful for size diffs). Default: false */
  showSign?: boolean;
  /** Custom fallback string when bytes is 0, null, or undefined. Default: '0 B' */
  zeroText?: string;
  /** Whether to trim trailing zeros after decimals (e.g. '12.0 KB' -> '12 KB'). Default: true */
  stripTrailingZeros?: boolean;
}

const BINARY_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const DECIMAL_UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];

/**
 * Robustly formats a raw byte count into a human-readable file size string.
 * Handles edge cases like 0, negative values, NaN, and infinity safely.
 */
export function formatFileSize(
  bytes: number | null | undefined,
  options?: FormatFileSizeOptions
): string {
  const zeroFallback = options?.zeroText ?? '0 B';

  if (bytes === null || bytes === undefined || isNaN(bytes) || !isFinite(bytes) || bytes === 0) {
    return zeroFallback;
  }

  const isNegative = bytes < 0;
  const absBytes = Math.abs(bytes);
  const base = options?.standard === 'decimal' ? 1000 : 1024;
  const units = options?.standard === 'decimal' ? DECIMAL_UNITS : BINARY_UNITS;

  if (absBytes < base) {
    const unit = units[0];
    const space = options?.space !== false ? ' ' : '';
    const sign = isNegative ? '-' : options?.showSign ? '+' : '';
    return `${sign}${Math.round(absBytes)}${space}${unit}`;
  }

  const exponent = Math.min(Math.floor(Math.log(absBytes) / Math.log(base)), units.length - 1);
  const value = absBytes / Math.pow(base, exponent);
  const unit = units[exponent];

  // Adaptive decimals if not specified
  let precision = options?.decimals;
  if (precision === undefined) {
    if (exponent === 1) {
      // KB: 1 decimal for sub-100KB, 0 for >= 100KB unless fractional
      precision = value < 100 ? 1 : 0;
    } else if (exponent === 2) {
      // MB: 1 decimal for >= 10MB, 2 decimals for < 10MB
      precision = value < 10 ? 2 : 1;
    } else {
      // GB, TB
      precision = 2;
    }
  }

  let formattedValue = value.toFixed(precision);

  if (options?.stripTrailingZeros !== false && formattedValue.includes('.')) {
    formattedValue = formattedValue.replace(/\.?0+$/, '');
  }

  const space = options?.space !== false ? ' ' : '';
  const sign = isNegative ? '-' : options?.showSign ? '+' : '';

  return `${sign}${formattedValue}${space}${unit}`;
}

/**
 * Returns structured metrics for a byte count.
 */
export function parseFileSize(
  bytes: number | null | undefined,
  options?: FormatFileSizeOptions
): {
  value: number;
  unit: string;
  rawBytes: number;
  formatted: string;
  exactString: string;
} {
  const rawBytes = bytes && !isNaN(bytes) && isFinite(bytes) ? bytes : 0;
  const formatted = formatFileSize(rawBytes, options);
  const base = options?.standard === 'decimal' ? 1000 : 1024;
  const units = options?.standard === 'decimal' ? DECIMAL_UNITS : BINARY_UNITS;

  const abs = Math.abs(rawBytes);
  const exponent = abs === 0 ? 0 : Math.min(Math.floor(Math.log(abs) / Math.log(base)), units.length - 1);
  const value = exponent === 0 ? abs : abs / Math.pow(base, exponent);
  const unit = units[exponent];

  return {
    value,
    unit,
    rawBytes,
    formatted,
    exactString: `${rawBytes.toLocaleString()} bytes`,
  };
}

export interface SizeSavingsMetrics {
  originalBytes: number;
  newBytes: number;
  differenceBytes: number;
  savedBytes: number;
  percent: number;
  percentRounded: number;
  isSmaller: boolean;
  isEqual: boolean;
  isLarger: boolean;
  formattedOriginal: string;
  formattedNew: string;
  formattedDifference: string;
  formattedSavings: string;
}

/**
 * Calculates compression savings and comparison stats between original and processed file sizes.
 */
export function calculateSizeSavings(
  originalBytes: number,
  newBytes: number,
  options?: FormatFileSizeOptions
): SizeSavingsMetrics {
  const orig = Math.max(0, originalBytes || 0);
  const compressed = Math.max(0, newBytes || 0);
  const diff = orig - compressed;
  const savedBytes = Math.max(0, diff);

  const rawPercent = orig > 0 ? (diff / orig) * 100 : 0;
  const percent = Number(rawPercent.toFixed(1));
  const percentRounded = Math.round(rawPercent);

  const isSmaller = compressed < orig;
  const isEqual = compressed === orig;
  const isLarger = compressed > orig;

  return {
    originalBytes: orig,
    newBytes: compressed,
    differenceBytes: diff,
    savedBytes,
    percent,
    percentRounded,
    isSmaller,
    isEqual,
    isLarger,
    formattedOriginal: formatFileSize(orig, options),
    formattedNew: formatFileSize(compressed, options),
    formattedDifference: formatFileSize(diff, { ...options, showSign: true }),
    formattedSavings: formatFileSize(savedBytes, options),
  };
}

/**
 * Parses a human-readable file size string (e.g. "2.5 MB", "500kb", "1.2 GB") back to bytes.
 */
export function parseBytesFromString(input: string): number | null {
  if (!input || typeof input !== 'string') return null;
  const match = input.trim().match(/^([+-]?\d+(?:\.\d+)?)\s*([a-zA-Z]+)?$/);
  if (!match) return null;

  const num = parseFloat(match[1]);
  if (isNaN(num)) return null;

  const unit = (match[2] || 'B').toUpperCase();
  const multipliers: Record<string, number> = {
    B: 1,
    BYTE: 1,
    BYTES: 1,
    KB: 1024,
    KIB: 1024,
    K: 1024,
    MB: 1024 * 1024,
    MIB: 1024 * 1024,
    M: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    GIB: 1024 * 1024 * 1024,
    G: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
    TIB: 1024 * 1024 * 1024 * 1024,
    T: 1024 * 1024 * 1024 * 1024,
  };

  const multiplier = multipliers[unit];
  if (!multiplier) return null;

  return Math.round(num * multiplier);
}
