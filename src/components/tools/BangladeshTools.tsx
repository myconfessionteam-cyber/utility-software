import React, { useState, useMemo, useRef } from 'react';
import { Copy, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Calculator, Globe, Languages, MapPin, Briefcase, UserSquare, Upload, Download, Check, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileSize } from '../common/FileSize';

interface BangladeshToolProps {
  toolSlug: string;
}

// Phonetic English to Bangla dictionary mapping (Avro style)
function phoneticEnglishToBangla(text: string): string {
  if (!text) return '';

  const words = text.split(' ');
  const wordMap: Record<string, string> = {
    ami: 'আমি',
    amra: 'আমরা',
    tumi: 'তুমি',
    apni: 'আপনি',
    kemon: 'কেমন',
    acho: 'আছো',
    achen: 'আছেন',
    bhalo: 'ভালো',
    bangla: 'বাংলা',
    bangladesh: 'বাংলাদেশ',
    dhaka: 'ঢাকা',
    dhonnobad: 'ধন্যবাদ',
    shuvo: 'শুভ',
    shokal: 'সকাল',
    raat: 'রাত',
    somoy: 'সময়',
    desh: 'দেশ',
    manush: 'মানুষ',
    bondhu: 'বন্ধু',
    kaaj: 'কাজ',
    naam: 'নাম',
    bari: 'বাড়ি',
    ki: 'কী',
    keno: 'কেন',
    kothay: 'কোথায়',
    kokhon: 'কখন',
    haan: 'হ্যাঁ',
    na: 'না',
    shundor: 'সুন্দর',
    notun: 'নতুন',
  };

  return words
    .map(w => {
      const lower = w.toLowerCase();
      if (wordMap[lower]) {
        return wordMap[lower];
      }

      // Basic character by character transliteration fallback
      let res = '';
      let i = 0;
      while (i < w.length) {
        const sub2 = w.substring(i, i + 2).toLowerCase();
        const sub3 = w.substring(i, i + 3).toLowerCase();
        const char = w[i].toLowerCase();

        if (sub3 === 'kkh') { res += 'ক্ষ'; i += 3; }
        else if (sub2 === 'sh') { res += 'শ'; i += 2; }
        else if (sub2 === 'ch') { res += 'চ'; i += 2; }
        else if (sub2 === 'kh') { res += 'খ'; i += 2; }
        else if (sub2 === 'gh') { res += 'ঘ'; i += 2; }
        else if (sub2 === 'th') { res += 'থ'; i += 2; }
        else if (sub2 === 'dh') { res += 'ধ'; i += 2; }
        else if (sub2 === 'ph') { res += 'ফ'; i += 2; }
        else if (sub2 === 'bh') { res += 'ভ'; i += 2; }
        else if (sub2 === 'ng') { res += 'ং'; i += 2; }
        else if (char === 'k') { res += 'ক'; i++; }
        else if (char === 'g') { res += 'গ'; i++; }
        else if (char === 'j') { res += 'জ'; i++; }
        else if (char === 't') { res += 'ট'; i++; }
        else if (char === 'd') { res += 'ড'; i++; }
        else if (char === 'n') { res += 'ন'; i++; }
        else if (char === 'p') { res += 'প'; i++; }
        else if (char === 'f') { res += 'ফ'; i++; }
        else if (char === 'b') { res += 'ব'; i++; }
        else if (char === 'm') { res += 'ম'; i++; }
        else if (char === 'r') { res += 'র'; i++; }
        else if (char === 'l') { res += 'ল'; i++; }
        else if (char === 's') { res += 'স'; i++; }
        else if (char === 'h') { res += 'হ'; i++; }
        else if (char === 'a') { res += res.length === 0 ? 'আ' : 'া'; i++; }
        else if (char === 'i') { res += res.length === 0 ? 'ই' : 'ি'; i++; }
        else if (char === 'u') { res += res.length === 0 ? 'উ' : 'ু'; i++; }
        else if (char === 'e') { res += res.length === 0 ? 'এ' : 'ে'; i++; }
        else if (char === 'o') { res += res.length === 0 ? 'ও' : 'ো'; i++; }
        else { res += w[i]; i++; }
      }
      return res;
    })
    .join(' ');
}

export const BangladeshTools: React.FC<BangladeshToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();

  // ==================== 1. BANGLA ENGLISH TYPING ====================
  const [typingInput, setTypingInput] = useState<string>('ami banglay gan gai, bangladesh amar desh');
  const [copiedBangla, setCopiedBangla] = useState(false);

  const convertedBanglaText = useMemo(() => {
    return phoneticEnglishToBangla(typingInput);
  }, [typingInput]);

  const copyBangla = () => {
    if (!convertedBanglaText) return;
    navigator.clipboard.writeText(convertedBanglaText);
    setCopiedBangla(true);
    showToast('Bangla text copied to clipboard!');
    setTimeout(() => setCopiedBangla(false), 2000);
  };

  // ==================== 2. BANGLADESH LAND CONVERTER ====================
  const [landValue, setLandValue] = useState<number>(1);
  const [landUnit, setLandUnit] = useState<string>('shotok');

  // Survey base formulas: 1 shotok (shotaongsho / decimal) = 435.6 sq ft
  const landConversions = useMemo(() => {
    const val = Math.max(0, landValue);
    let totalSqFt = 0;

    switch (landUnit) {
      case 'shotok': totalSqFt = val * 435.6; break;
      case 'katha': totalSqFt = val * 720; break;
      case 'bigha': totalSqFt = val * 14400; break;
      case 'acre': totalSqFt = val * 43560; break;
      case 'chotak': totalSqFt = val * 45; break;
      case 'sqft': totalSqFt = val; break;
      case 'sqm': totalSqFt = val * 10.7639; break;
      default: totalSqFt = val * 435.6;
    }

    return {
      shotok: (totalSqFt / 435.6).toFixed(4),
      katha: (totalSqFt / 720).toFixed(4),
      bigha: (totalSqFt / 14400).toFixed(4),
      acre: (totalSqFt / 43560).toFixed(4),
      chotak: (totalSqFt / 45).toFixed(2),
      sqft: totalSqFt.toFixed(2),
      sqm: (totalSqFt / 10.7639).toFixed(2),
      hectare: (totalSqFt / 107639).toFixed(4),
    };
  }, [landValue, landUnit]);

  // ==================== 3. BANGLADESH GOVT JOB AGE CALCULATOR ====================
  const [candidateDob, setCandidateDob] = useState<string>('1997-06-15');
  const [circularDate, setCircularDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1); // 1st of current month
    return d.toISOString().slice(0, 10);
  });
  const [quotaType, setQuotaType] = useState<'general' | 'freedom_fighter' | 'departmental'>('general');

  const govtJobAge = useMemo(() => {
    if (!candidateDob || !circularDate) return null;
    const birth = new Date(candidateDob);
    const circular = new Date(circularDate);

    if (birth > circular) return { eligible: false, error: 'Date of birth cannot be after circular date' };

    let y = circular.getFullYear() - birth.getFullYear();
    let m = circular.getMonth() - birth.getMonth();
    let d = circular.getDate() - birth.getDate();

    if (d < 0) {
      m--;
      const prevMonth = new Date(circular.getFullYear(), circular.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    const maxAge = quotaType === 'general' ? 30 : quotaType === 'freedom_fighter' ? 32 : 35;
    const eligible = y < maxAge || (y === maxAge && m === 0 && d === 0);

    return {
      years: y,
      months: m,
      days: d,
      maxAge,
      eligible,
    };
  }, [candidateDob, circularDate, quotaType]);

  // ==================== 4. PASSPORT & NID PHOTO RESIZER ====================
  const [selectedPreset, setSelectedPreset] = useState<'photo300' | 'signature300' | 'passport55' | 'nid300'>('photo300');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presets = {
    photo300: { name: 'BD Job / Teletalk Photo', width: 300, height: 300, maxKb: 100 },
    signature300: { name: 'BD Job Signature', width: 300, height: 80, maxKb: 60 },
    passport55: { name: 'Bangladesh E-Passport (55x45mm)', width: 650, height: 531, maxKb: 300 },
    nid300: { name: 'Smart NID Photo', width: 300, height: 300, maxKb: 100 },
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const imgData = evt.target?.result as string;
      setUploadedImage(imgData);
      processImage(imgData, selectedPreset);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (imgSrc: string, presetKey: keyof typeof presets) => {
    const target = presets[presetKey];
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = target.width;
      canvas.height = target.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw and scale to fit
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, target.width, target.height);

      // Center crop or fit
      const scale = Math.max(target.width / img.width, target.height / img.height);
      const x = (target.width - img.width * scale) / 2;
      const y = (target.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Compress to JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setResizedImageUrl(dataUrl);

      // Estimate file size in bytes
      const head = 'data:image/jpeg;base64,';
      const sizeBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      setFileSizeBytes(sizeBytes);
      showToast(`Image resized to ${target.width}x${target.height}px`);
    };
  };

  const downloadResizedImage = () => {
    if (!resizedImageUrl) return;
    const a = document.createElement('a');
    a.href = resizedImageUrl;
    a.download = `bd-${selectedPreset}-resized.jpg`;
    a.click();
    showToast('Photo downloaded successfully!');
  };

  // ==================== 5. NID VALIDATOR & PARSER ====================
  const [nidInput, setNidInput] = useState<string>('19942692512345678');

  const nidDetails = useMemo(() => {
    const clean = nidInput.replace(/[^0-9]/g, '');
    const len = clean.length;

    if (len === 10) {
      return {
        valid: true,
        type: 'Smart National ID (10 Digits)',
        district: 'Valid 10-digit Smart NID sequence',
        birthYear: 'Embedded securely in chip',
        notes: 'Smart NID cards utilize high-security cryptographic microchips.',
      };
    } else if (len === 17) {
      const birthYear = clean.substring(0, 4);
      const districtCode = clean.substring(4, 6);
      const rmo = clean.substring(6, 7);
      return {
        valid: true,
        type: 'Legacy 17-digit NID',
        birthYear,
        district: `District Code: ${districtCode}`,
        notes: `RMO Code: ${rmo}. Individual Sequence: ${clean.substring(7)}`,
      };
    } else if (len === 13) {
      const districtCode = clean.substring(0, 2);
      return {
        valid: true,
        type: 'Old 13-digit NID (Missing Birth Year Prefix)',
        district: `District Code: ${districtCode}`,
        birthYear: 'Requires 4-digit Birth Year prefix (e.g. 1990...) to form 17-digit format',
        notes: 'Can be converted to 17-digit format by prefixing your 4-digit birth year.',
      };
    } else {
      return {
        valid: false,
        error: `Invalid NID length: ${len} digits. A valid Bangladeshi NID is 10 digits (Smart Card), 13 digits (Old), or 17 digits (Full).`,
      };
    }
  }, [nidInput]);

  return (
    <div id="bangladesh-tools-container" className="space-y-6">
      {/* 1. BANGLA ENGLISH TYPING */}
      {(toolSlug === 'bangla-english-typing' || !toolSlug) && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <Languages className="w-4 h-4 text-emerald-600" />
              <strong>Phonetic English to Bangla (Avro style):</strong> Type English pronunciation to write natural Bengali Unicode text.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Type Phonetic English
              </label>
              <textarea
                rows={6}
                value={typingInput}
                onChange={e => setTypingInput(e.target.value)}
                placeholder="Type here e.g.: ami banglay gan gai..."
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium shadow-xs"
              />
              <div className="flex gap-2 flex-wrap">
                {['dhaka', 'bangladesh', 'kemon acho', 'dhonnobad', 'shuvo shokal'].map(ph => (
                  <button
                    key={ph}
                    onClick={() => setTypingInput(prev => (prev ? `${prev} ${ph}` : ph))}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    +{ph}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Bangla Unicode Output (বাংলা)
                </label>
                <button
                  onClick={copyBangla}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                >
                  {copiedBangla ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBangla ? 'Copied' : 'Copy Bangla'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-900 dark:text-white text-base min-h-[160px] font-normal leading-relaxed whitespace-pre-wrap">
                {convertedBanglaText || <span className="text-slate-400 italic">বাংলা লেখা এখানে প্রদর্শিত হবে...</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BANGLADESH LAND CONVERTER */}
      {toolSlug === 'bangladesh-land-converter' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> বাংলাদেশ জমি পরিমাপ কনভার্টার (শতাংশ, কাঠা, বিঘা, একর)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Enter Quantity</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={landValue}
                  onChange={e => setLandValue(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-base"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Select Measurement Unit</label>
                <select
                  value={landUnit}
                  onChange={e => setLandUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-sm"
                >
                  <option value="shotok">শতাংশ / শতক / ডেসিমেল (Decimal)</option>
                  <option value="katha">কাঠা (Katha)</option>
                  <option value="bigha">বিঘা (Bigha)</option>
                  <option value="acre">একর (Acre)</option>
                  <option value="chotak">ছটাক (Chotak)</option>
                  <option value="sqft">বর্গফুট (Square Feet)</option>
                  <option value="sqm">বর্গমিটার (Square Meter)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 text-center">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">শতাংশ / শতক</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{landConversions.shotok}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-500 block">কাঠা</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{landConversions.katha}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-500 block">বিঘা</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{landConversions.bigha}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-500 block">একর</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{landConversions.acre}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-500 block">ছটাক</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{landConversions.chotak}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-500 block">বর্গফুট (Sq Ft)</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{landConversions.sqft}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-500 block">বর্গমিটার (Sq M)</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{landConversions.sqm}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold text-slate-500 block">হেক্টর (Hectare)</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{landConversions.hectare}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. BANGLADESH GOVT JOB AGE CALCULATOR */}
      {toolSlug === 'bangladesh-age-calculator' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" /> সরকারি চাকরির নিয়োগ বিজ্ঞপ্তির বয়স গণনা ও যোগ্যতা
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">প্রার্থীর জন্ম তারিখ (Date of Birth)</label>
                <input
                  type="date"
                  value={candidateDob}
                  onChange={e => setCandidateDob(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">বিজ্ঞপ্তিতে উল্লেখিত কাটঅফ তারিখ (Cutoff Date)</label>
                <input
                  type="date"
                  value={circularDate}
                  onChange={e => setCircularDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">কোটা ও প্রার্থী ক্যাটাগরি (Quota)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'general', label: 'সাধারণ প্রার্থী (সর্বোচ্চ ৩০ বছর)' },
                  { id: 'freedom_fighter', label: 'মুক্তিযোদ্ধা / প্রতিবন্ধী (৩২ বছর)' },
                  { id: 'departmental', label: 'বিভাগীয় প্রার্থী (৩৫ বছর)' },
                ].map(q => (
                  <button
                    key={q.id}
                    onClick={() => setQuotaType(q.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition text-left ${
                      quotaType === q.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {govtJobAge && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                <span className="text-xs uppercase font-bold text-slate-400">নির্ধারিত তারিখে প্রার্থীর বয়স</span>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {govtJobAge.years} বছর, {govtJobAge.months} মাস, {govtJobAge.days} দিন
                </p>

                <div className="mt-4">
                  {govtJobAge.eligible ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4" /> আবেদনযোগ্য (Eligible for this post)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                      <AlertCircle className="w-4 h-4" /> বয়স উত্তীর্ণ (Age Limit Exceeded for {govtJobAge.maxAge} years)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. PASSPORT & NID PHOTO RESIZER */}
      {toolSlug === 'passport-photo-resizer' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <UserSquare className="w-4 h-4 text-emerald-600" /> সরকারি চাকরি, পাসপোর্ট ও NID ছবি রিসাইজার
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(presets).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedPreset(key as any);
                    if (uploadedImage) processImage(uploadedImage, key as any);
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                    selectedPreset === key
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block font-bold">{val.name}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{val.width}x{val.height}px (&lt;{val.maxKb}KB)</span>
                </button>
              ))}
            </div>

            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-800/30">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="photo-upload-input"
                className="hidden"
              />
              <label
                htmlFor="photo-upload-input"
                className="cursor-pointer inline-flex flex-col items-center gap-2"
              >
                <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xs">
                  <Upload className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Click to choose a photo or signature
                </span>
                <span className="text-xs text-slate-400">Supports JPG, PNG, WebP</span>
              </label>
            </div>
          </div>

          {resizedImageUrl && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                <img
                  src={resizedImageUrl}
                  alt="Resized output"
                  className="max-h-32 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase">Ready For Download</span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {presets[selectedPreset].width} x {presets[selectedPreset].height} px
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <span>Estimated size:</span>
                    <FileSize
                      bytes={fileSizeBytes}
                      showBadge
                      variant={fileSizeBytes / 1024 <= presets[selectedPreset].maxKb ? 'emerald' : 'amber'}
                    />
                    <span className="text-[11px] text-slate-400">
                      (Limit: ≤{presets[selectedPreset].maxKb} KB)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadResizedImage}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
              >
                <Download className="w-4 h-4" /> Download Resized Photo
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. NID VALIDATOR & PARSER */}
      {toolSlug === 'bd-nid-validator' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Enter National ID Number (NID)
              </label>
              <input
                type="text"
                value={nidInput}
                onChange={e => setNidInput(e.target.value)}
                placeholder="10, 13, or 17 digit NID number"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-bold tracking-wider"
              />
            </div>
          </div>

          {nidDetails && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {nidDetails.valid ? nidDetails.type : 'NID Validation Notice'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {nidDetails.valid ? nidDetails.notes : nidDetails.error}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
