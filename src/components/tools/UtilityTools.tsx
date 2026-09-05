import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import { Copy, Download, RefreshCw, Play, Pause, RotateCcw, ShieldCheck, Check, Sparkles, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UtilityToolProps {
  toolSlug: string;
}

export const UtilityTools: React.FC<UtilityToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();

  // ==================== 1. QR CODE GENERATOR ====================
  const [qrText, setQrText] = useState('https://toolnova.dev');
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrErrorCorrection, setQrErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (toolSlug === 'qr-code-generator') {
      QRCode.toDataURL(
        qrText || ' ',
        {
          width: 500,
          margin: 2,
          color: {
            dark: qrFgColor,
            light: qrBgColor,
          },
          errorCorrectionLevel: qrErrorCorrection,
        },
        (err, url) => {
          if (!err && url) setQrDataUrl(url);
        }
      );
    }
  }, [qrText, qrFgColor, qrBgColor, qrErrorCorrection, toolSlug]);

  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'toolnova-qrcode.png';
    a.click();
    showToast('QR code downloaded!');
    trackEvent('download_qr', 'QR');
  };

  // ==================== 2. PASSWORD GENERATOR ====================
  const [passLength, setPassLength] = useState<number>(16);
  const [incUpper, setIncUpper] = useState<boolean>(true);
  const [incLower, setIncLower] = useState<boolean>(true);
  const [incNumbers, setIncNumbers] = useState<boolean>(true);
  const [incSymbols, setIncSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(true);
  const [generatedPass, setGeneratedPass] = useState<string>('');

  const generatePassword = () => {
    let chars = '';
    if (incLower) chars += avoidAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (incUpper) chars += avoidAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incNumbers) chars += avoidAmbiguous ? '23456789' : '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let pass = '';
    const array = new Uint32Array(passLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      pass += chars[array[i] % chars.length];
    }
    setGeneratedPass(pass);
  };

  useEffect(() => {
    if (toolSlug === 'password-generator') {
      generatePassword();
    }
  }, [passLength, incUpper, incLower, incNumbers, incSymbols, avoidAmbiguous, toolSlug]);

  const passwordStrength = useMemo(() => {
    if (!generatedPass) return { score: 0, label: 'Weak', color: 'text-rose-500' };
    let score = 0;
    if (generatedPass.length >= 12) score += 25;
    if (generatedPass.length >= 16) score += 25;
    if (/[A-Z]/.test(generatedPass) && /[a-z]/.test(generatedPass)) score += 25;
    if (/[0-9]/.test(generatedPass) && /[^A-Za-z0-9]/.test(generatedPass)) score += 25;

    let label = 'Weak';
    let color = 'text-rose-500';
    if (score >= 100) {
      label = 'Very Strong';
      color = 'text-emerald-500';
    } else if (score >= 75) {
      label = 'Strong';
      color = 'text-emerald-400';
    } else if (score >= 50) {
      label = 'Moderate';
      color = 'text-amber-500';
    }
    return { score, label, color };
  }, [generatedPass]);

  // ==================== 3. STOPWATCH & TIMER ====================
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchMs(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const formatTimer = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
  };

  return (
    <div id="utility-tool-container" className="space-y-6">
      {/* 1. QR CODE GENERATOR */}
      {toolSlug === 'qr-code-generator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Content or Website URL
              </label>
              <textarea
                rows={3}
                value={qrText}
                onChange={e => setQrText(e.target.value)}
                placeholder="https://yourwebsite.com or text"
                className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={e => setQrFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono">{qrFgColor}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={e => setQrBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono">{qrBgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'L', label: 'L (7%)' },
                  { id: 'M', label: 'M (15%)' },
                  { id: 'Q', label: 'Q (25%)' },
                  { id: 'H', label: 'H (30%)' },
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setQrErrorCorrection(lvl.id as any)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                      qrErrorCorrection === lvl.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center text-center space-y-4">
            {qrDataUrl && (
              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm">
                <img src={qrDataUrl} alt="Generated QR Code" className="w-56 h-56 object-contain" />
              </div>
            )}

            <button
              onClick={downloadQrCode}
              className="w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res QR Code</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PASSWORD GENERATOR */}
      {toolSlug === 'password-generator' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            {/* Generated Password Result Bar */}
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-mono text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              <span className="truncate">{generatedPass}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={generatePassword}
                  className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition"
                  title="Generate new"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPass);
                    showToast('Password copied to clipboard!');
                    trackEvent('copy_pass', 'Security');
                  }}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
                  title="Copy password"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Strength indicator */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                <span>Strength: <span className={passwordStrength.color}>{passwordStrength.label}</span></span>
                <span>{passwordStrength.score}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength.score >= 75 ? 'bg-emerald-500' : passwordStrength.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
            </div>

            {/* Length slider */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span>Password Length</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">{passLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={passLength}
                onChange={e => setPassLength(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Character switches */}
            <div className="grid grid-cols-2 gap-3 text-xs font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={incUpper} onChange={e => setIncUpper(e.target.checked)} className="rounded text-indigo-600" />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={incLower} onChange={e => setIncLower(e.target.checked)} className="rounded text-indigo-600" />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={incNumbers} onChange={e => setIncNumbers(e.target.checked)} className="rounded text-indigo-600" />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={incSymbols} onChange={e => setIncSymbols(e.target.checked)} className="rounded text-indigo-600" />
                <span>Symbols (!@#$%^&*)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer col-span-2">
                <input type="checkbox" checked={avoidAmbiguous} onChange={e => setAvoidAmbiguous(e.target.checked)} className="rounded text-indigo-600" />
                <span>Avoid Ambiguous Characters (e.g. 0, O, l, 1)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 3. STOPWATCH */}
      {toolSlug === 'stopwatch' && (
        <div className="max-w-md mx-auto space-y-6 text-center">
          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <p className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {formatTimer(stopwatchMs)}
            </p>

            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition ${
                  stopwatchRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {stopwatchRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{stopwatchRunning ? 'Pause' : 'Start'}</span>
              </button>

              {stopwatchRunning && (
                <button
                  onClick={() => setLaps(prev => [stopwatchMs, ...prev])}
                  className="px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Lap
                </button>
              )}

              <button
                onClick={() => {
                  setStopwatchRunning(false);
                  setStopwatchMs(0);
                  setLaps([]);
                }}
                className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-rose-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {laps.length > 0 && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 max-h-48 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800">
              {laps.map((lap, idx) => (
                <div key={idx} className="flex justify-between py-2 text-xs font-mono">
                  <span className="text-neutral-400">Lap {laps.length - idx}</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{formatTimer(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
