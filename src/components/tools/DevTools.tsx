import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Trash2, Check, Download, AlertCircle, CheckCircle2, Play, RefreshCw, Code, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DevToolProps {
  toolSlug: string;
}

export const DevTools: React.FC<DevToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();

  // General text state
  const [inputVal, setInputVal] = useState<string>(() => {
    if (toolSlug.includes('json')) {
      return '{"name":"ToolNova","features":["Fast","Private","Client-Side"],"metrics":{"tools":40,"free":true}}';
    }
    if (toolSlug === 'jwt-decoder') {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIERvZSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTk3MjY3ODQwMH0.4PclnQ2ZjT4fS1bT0_0v0';
    }
    if (toolSlug === 'url-encoder') {
      return 'https://example.com/search?q=free online tools&category=developer tools&sort=popular';
    }
    if (toolSlug === 'regex-tester') {
      return 'Contact us at support@toolnova.dev or sales@domain.com for questions!';
    }
    return 'Hello, World! ToolNova Developer Utilities.';
  });

  const [outputVal, setOutputVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Copy helper
  const handleCopy = (textToCopy?: string) => {
    const val = textToCopy !== undefined ? textToCopy : outputVal || inputVal;
    navigator.clipboard.writeText(val);
    setCopied(true);
    showToast('Copied to clipboard!');
    trackEvent('copy', 'DevTools', toolSlug);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. JSON FORMATTER & VALIDATOR
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonStats, setJsonStats] = useState<{ keys: number; size: number } | null>(null);

  const formatJson = (spaces = 2) => {
    try {
      const parsed = JSON.parse(inputVal);
      const formatted = JSON.stringify(parsed, null, spaces);
      setInputVal(formatted);
      setJsonError(null);
      setJsonStats({
        keys: Object.keys(parsed).length,
        size: new Blob([formatted]).size,
      });
      showToast(`Formatted with ${spaces} spaces!`);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(inputVal);
      const minified = JSON.stringify(parsed);
      setInputVal(minified);
      setJsonError(null);
      showToast('Minified JSON successfully!');
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON');
    }
  };

  // Auto validate JSON on change
  useEffect(() => {
    if (toolSlug.includes('json')) {
      try {
        const parsed = JSON.parse(inputVal);
        setJsonError(null);
        setJsonStats({
          keys: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1,
          size: new Blob([inputVal]).size,
        });
      } catch (err: any) {
        setJsonError(err.message);
        setJsonStats(null);
      }
    }
  }, [inputVal, toolSlug]);

  // 2. BASE64 ENCODE / DECODE
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  const [urlSafeBase64, setUrlSafeBase64] = useState<boolean>(false);

  useEffect(() => {
    if (toolSlug === 'base64-encoder') {
      try {
        if (base64Mode === 'encode') {
          // UTF-8 safe encode
          const utf8 = encodeURIComponent(inputVal).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
          );
          let encoded = btoa(utf8);
          if (urlSafeBase64) {
            encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          }
          setOutputVal(encoded);
        } else {
          let str = inputVal;
          if (urlSafeBase64) {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) str += '=';
          }
          const decoded = decodeURIComponent(
            Array.prototype.map.call(atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
          );
          setOutputVal(decoded);
        }
      } catch {
        setOutputVal('Invalid Base64 input string');
      }
    }
  }, [inputVal, base64Mode, urlSafeBase64, toolSlug]);

  // 3. URL ENCODER / DECODER
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  const parsedUrlParams = useMemo(() => {
    if (toolSlug !== 'url-encoder') return [];
    try {
      const url = new URL(inputVal.startsWith('http') ? inputVal : `http://dummy.com?${inputVal}`);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      return params;
    } catch {
      return [];
    }
  }, [inputVal, toolSlug]);

  useEffect(() => {
    if (toolSlug === 'url-encoder') {
      try {
        if (urlMode === 'encode') {
          setOutputVal(encodeURIComponent(inputVal));
        } else {
          setOutputVal(decodeURIComponent(inputVal));
        }
      } catch {
        setOutputVal('Malformed URI sequence');
      }
    }
  }, [inputVal, urlMode, toolSlug]);

  // 4. UUID GENERATOR
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidUppercase, setUuidUppercase] = useState<boolean>(false);
  const [uuidHyphens, setUuidHyphens] = useState<boolean>(true);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      let u: string = crypto.randomUUID();
      if (!uuidHyphens) u = u.replace(/-/g, '');
      if (uuidUppercase) u = u.toUpperCase();
      list.push(u);
    }
    setGeneratedUuids(list);
    showToast(`Generated ${uuidCount} UUIDs!`);
  };

  useEffect(() => {
    if (toolSlug === 'uuid-generator') {
      generateUuids();
    }
  }, [toolSlug, uuidCount, uuidUppercase, uuidHyphens]);

  // 5. HASH GENERATOR
  const [hashes, setHashes] = useState<{ sha256: string; sha1: string; sha512: string }>({
    sha256: '',
    sha1: '',
    sha512: '',
  });

  useEffect(() => {
    if (toolSlug === 'hash-generator') {
      const computeHashes = async () => {
        const encoder = new TextEncoder();
        const data = encoder.encode(inputVal);

        const buf256 = await crypto.subtle.digest('SHA-256', data);
        const buf1 = await crypto.subtle.digest('SHA-1', data);
        const buf512 = await crypto.subtle.digest('SHA-512', data);

        const toHex = (buf: ArrayBuffer) =>
          Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        setHashes({
          sha256: toHex(buf256),
          sha1: toHex(buf1),
          sha512: toHex(buf512),
        });
      };
      computeHashes();
    }
  }, [inputVal, toolSlug]);

  // 6. UNIX TIMESTAMP
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (toolSlug === 'unix-timestamp-converter') {
      const timer = setInterval(() => setCurrentEpoch(Math.floor(Date.now() / 1000)), 1000);
      return () => clearInterval(timer);
    }
  }, [toolSlug]);

  const timestampResults = useMemo(() => {
    if (toolSlug !== 'unix-timestamp-converter') return null;
    const epochNum = parseInt(inputEpoch);
    if (isNaN(epochNum)) return null;

    // Support both seconds (10 digits) and ms (13 digits)
    const ms = inputEpoch.length > 11 ? epochNum : epochNum * 1000;
    const d = new Date(ms);

    return {
      utc: d.toUTCString(),
      local: d.toString(),
      iso: d.toISOString(),
      relative: getRelativeTimeString(d),
    };
  }, [inputEpoch, toolSlug]);

  // 7. JWT DECODER
  const jwtDecoded = useMemo(() => {
    if (toolSlug !== 'jwt-decoder') return null;
    try {
      const parts = inputVal.trim().split('.');
      if (parts.length < 2) throw new Error('Invalid JWT format (must have at least header and payload)');

      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      };

      const header = decodeBase64Url(parts[0]);
      const payload = decodeBase64Url(parts[1]);

      let isExpired = false;
      let expDate = null;
      if (payload.exp) {
        expDate = new Date(payload.exp * 1000);
        isExpired = expDate.getTime() < Date.now();
      }

      return {
        header,
        payload,
        signature: parts[2] || '',
        isExpired,
        expDate,
        valid: true,
      };
    } catch (err: any) {
      return { valid: false, error: err.message };
    }
  }, [inputVal, toolSlug]);

  // 8. REGEX TESTER
  const [regexPattern, setRegexPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState<{ g: boolean; i: boolean; m: boolean }>({ g: true, i: true, m: false });

  const regexResults = useMemo(() => {
    if (toolSlug !== 'regex-tester') return { matches: [], error: null };
    try {
      let flags = '';
      if (regexFlags.g) flags += 'g';
      if (regexFlags.i) flags += 'i';
      if (regexFlags.m) flags += 'm';

      const re = new RegExp(regexPattern, flags);
      const matches: { text: string; index: number }[] = [];
      let m;

      if (regexFlags.g) {
        while ((m = re.exec(inputVal)) !== null) {
          matches.push({ text: m[0], index: m.index });
          if (!m[0]) break; // avoid infinite loop on empty match
        }
      } else {
        m = re.exec(inputVal);
        if (m) matches.push({ text: m[0], index: m.index });
      }

      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [inputVal, regexPattern, regexFlags, toolSlug]);

  return (
    <div id="dev-tool-container" className="space-y-6">
      {/* 1. JSON Formatter & Validator Controls */}
      {toolSlug.includes('json') && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => formatJson(2)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 transition shadow-xs"
            >
              Format (2 Spaces)
            </button>
            <button
              onClick={() => formatJson(4)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 transition shadow-xs"
            >
              Format (4 Spaces)
            </button>
            <button
              onClick={minifyJson}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 transition shadow-xs"
            >
              Minify
            </button>
          </div>

          <div className="flex items-center gap-2">
            {jsonError ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-3.5 h-3.5" /> Invalid JSON
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Base64 Controls */}
      {toolSlug === 'base64-encoder' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBase64Mode('encode')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                base64Mode === 'encode'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700'
              }`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => setBase64Mode('decode')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                base64Mode === 'decode'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700'
              }`}
            >
              Decode from Base64
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafeBase64}
              onChange={e => setUrlSafeBase64(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span>URL-Safe Base64 (- and _)</span>
          </label>
        </div>
      )}

      {/* 3. URL Encoder / Decoder Controls */}
      {toolSlug === 'url-encoder' && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setUrlMode('encode')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              urlMode === 'encode'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700'
            }`}
          >
            URL Encode (Percent-Encoding)
          </button>
          <button
            onClick={() => setUrlMode('decode')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              urlMode === 'decode'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700'
            }`}
          >
            URL Decode
          </button>
        </div>
      )}

      {/* 4. UUID Generator Display */}
      {toolSlug === 'uuid-generator' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span>Quantity:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={uuidCount}
                  onChange={e => setUuidCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-16 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center"
                />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uuidUppercase}
                  onChange={e => setUuidUppercase(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Uppercase</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uuidHyphens}
                  onChange={e => setUuidHyphens(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Hyphens</span>
              </label>
            </div>

            <button
              onClick={generateUuids}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate New</span>
            </button>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 divide-y divide-neutral-100 dark:divide-neutral-800">
            {generatedUuids.map((uuid, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 text-xs sm:text-sm font-mono">
                <span className="text-neutral-900 dark:text-white truncate mr-2">{uuid}</span>
                <button
                  onClick={() => handleCopy(uuid)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                  title="Copy UUID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleCopy(generatedUuids.join('\n'))}
            className="w-full py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold transition"
          >
            Copy All {generatedUuids.length} UUIDs
          </button>
        </div>
      ) : toolSlug === 'hash-generator' ? (
        /* 5. Hash Generator Display */
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              Input String to Hash
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Enter text string..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono"
            />
          </div>

          <div className="space-y-3">
            {[
              { label: 'SHA-256 (256-bit)', hash: hashes.sha256 },
              { label: 'SHA-512 (512-bit)', hash: hashes.sha512 },
              { label: 'SHA-1 (160-bit)', hash: hashes.sha1 },
            ].map(item => (
              <div
                key={item.label}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
                  <span>{item.label}</span>
                  <button
                    onClick={() => handleCopy(item.hash)}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline capitalize"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-mono text-neutral-900 dark:text-neutral-100 break-all bg-neutral-50 dark:bg-neutral-800/60 p-2.5 rounded-lg">
                  {item.hash || 'Computing...'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : toolSlug === 'unix-timestamp-converter' ? (
        /* 6. Unix Timestamp Display */
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-bold text-neutral-900 dark:text-white">Current Epoch Timestamp:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                {currentEpoch}
              </span>
              <button
                onClick={() => handleCopy(currentEpoch.toString())}
                className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                Epoch Timestamp to Date
              </label>
              <input
                type="text"
                value={inputEpoch}
                onChange={e => setInputEpoch(e.target.value)}
                placeholder="1772678400"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-sm"
              />
              <button
                onClick={() => setInputEpoch(Math.floor(Date.now() / 1000).toString())}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Set to current timestamp
              </button>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                Calendar Date to Timestamp
              </label>
              <input
                type="datetime-local"
                value={inputDate}
                onChange={e => {
                  setInputDate(e.target.value);
                  const ep = Math.floor(new Date(e.target.value).getTime() / 1000);
                  setInputEpoch(ep.toString());
                }}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold"
              />
            </div>
          </div>

          {timestampResults && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Converted Formats</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-400 block mb-0.5">GMT / UTC:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white font-mono">{timestampResults.utc}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-400 block mb-0.5">Local Timezone:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white font-mono">{timestampResults.local}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 sm:col-span-2">
                  <span className="text-neutral-400 block mb-0.5">ISO 8601:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white font-mono">{timestampResults.iso}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : toolSlug === 'jwt-decoder' ? (
        /* 7. JWT Decoder Display */
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              Paste Encoded JWT Token
            </label>
            <textarea
              rows={3}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono break-all"
            />
          </div>

          {jwtDecoded?.valid ? (
            <div className="space-y-4">
              {/* Expiry Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  jwtDecoded.isExpired
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <span>{jwtDecoded.isExpired ? '⚠️ Token Expired' : '✓ Token Currently Valid'}</span>
                {jwtDecoded.expDate && <span>Expires: {jwtDecoded.expDate.toLocaleString()}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-2">
                    Header (Algorithm & Token Type)
                  </span>
                  <pre className="text-xs font-mono p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 overflow-x-auto">
                    {JSON.stringify(jwtDecoded.header, null, 2)}
                  </pre>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-500 block mb-2">
                    Payload (Data Claims)
                  </span>
                  <pre className="text-xs font-mono p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 overflow-x-auto">
                    {JSON.stringify(jwtDecoded.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {jwtDecoded?.error || 'Invalid token'}
            </div>
          )}
        </div>
      ) : toolSlug === 'regex-tester' ? (
        /* 8. Regex Tester Display */
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-mono text-neutral-400 font-bold">/</span>
              <input
                type="text"
                value={regexPattern}
                onChange={e => setRegexPattern(e.target.value)}
                placeholder="Regular expression pattern..."
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono"
              />
              <span className="text-sm font-mono text-neutral-400 font-bold">/</span>
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                {['g', 'i', 'm'].map(flag => (
                  <button
                    key={flag}
                    onClick={() => setRegexFlags(prev => ({ ...prev, [flag]: !prev[flag as 'g' | 'i' | 'm'] }))}
                    className={`px-2 py-1 rounded border transition ${
                      regexFlags[flag as 'g' | 'i' | 'm']
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Test String
              </label>
              <textarea
                rows={4}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              <span>Matches ({regexResults.matches.length})</span>
            </div>
            {regexResults.matches.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {regexResults.matches.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-mono text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                  >
                    {m.text}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">No matches found with current pattern.</p>
            )}
          </div>
        </div>
      ) : (
        /* Standard Split Input/Output Editor (JSON, Base64, URL Encoder) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Input</label>
              <button
                onClick={() => setInputVal('')}
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Clear
              </button>
            </div>
            <textarea
              rows={12}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-indigo-500 resize-y"
              placeholder="Paste input here..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Output Result</label>
              <button
                onClick={() => handleCopy()}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={outputVal || inputVal}
              className="w-full p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 resize-y"
            />
          </div>
        </div>
      )}

      {/* Query Parameters Table for URL Encoder */}
      {toolSlug === 'url-encoder' && parsedUrlParams.length > 0 && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            Parsed Query Parameters ({parsedUrlParams.length})
          </h4>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs font-mono">
            {parsedUrlParams.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{p.key}:</span>
                <span className="text-neutral-700 dark:text-neutral-300 truncate max-w-xs">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function getRelativeTimeString(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (Math.abs(diff) < 60) return 'Just now';
  if (diff > 0) {
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  } else {
    const abs = Math.abs(diff);
    if (abs < 3600) return `In ${Math.floor(abs / 60)} minutes`;
    if (abs < 86400) return `In ${Math.floor(abs / 3600)} hours`;
    return `In ${Math.floor(abs / 86400)} days`;
  }
}
