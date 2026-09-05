import React, { useState, useMemo } from 'react';
import { Copy, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Calculator, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BangladeshToolProps {
  toolSlug: string;
}

export const BangladeshTools: React.FC<BangladeshToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();

  // ==================== 1. NID VALIDATOR & PARSER ====================
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

  // ==================== 2. BANGLA DATE CONVERTER ====================
  const [gregorianDate, setGregorianDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const banglaDate = useMemo(() => {
    const d = new Date(gregorianDate);
    if (isNaN(d.getTime())) return null;

    const day = d.getDate();
    const month = d.getMonth() + 1; // 1-12
    const year = d.getFullYear();

    // Bengali months in revised Bangladesh calendar (Pohela Boishakh on April 14)
    // Boishakh to Ashwin (first 6 months) have 31 days
    // Kartik to Magh (next 4 months) have 30 days
    // Falgun has 29 or 30 days (leap year)
    // Choitro has 30 days
    const banglaMonths = [
      'বৈশাখ (Boishakh)',
      'জ্যৈষ্ঠ (Joishtho)',
      'আষাঢ় (Asharh)',
      'শ্রাবণ (Shrabon)',
      'ভাদ্র (Bhadro)',
      'আশ্বিন (Ashwin)',
      'কার্তিক (Kartik)',
      'অগ্রহায়ণ (Agrahayan)',
      'পৌষ (Poush)',
      'মাঘ (Magh)',
      'ফাল্গুন (Falgun)',
      'চৈত্র (Choitro)',
    ];

    const seasons = ['গ্রীষ্ম (Summer)', 'বর্ষা (Monsoon)', 'শরৎ (Autumn)', 'হেমন্ত (Late Autumn)', 'শীত (Winter)', 'বসন্ত (Spring)'];

    // Approximate calculation from April 14 (Day 1 of Boishakh)
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const april14 = new Date(year, 3, 14);

    let bYear = year - 593;
    let bMonthIndex = 0;
    let bDay = 1;

    if (d < april14) {
      bYear -= 1;
    }

    // Days since April 14 of current Bangla year
    const startOfBanglaYear = d >= april14 ? april14 : new Date(year - 1, 3, 14);
    const dayDiff = Math.floor((d.getTime() - startOfBanglaYear.getTime()) / (1000 * 60 * 60 * 24));

    const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeapYear ? 30 : 29, 30];
    let accum = 0;

    for (let i = 0; i < 12; i++) {
      if (dayDiff < accum + monthLengths[i]) {
        bMonthIndex = i;
        bDay = dayDiff - accum + 1;
        break;
      }
      accum += monthLengths[i];
    }

    const enToBnDigits = (num: number | string) => {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return num.toString().replace(/\d/g, d => bnDigits[parseInt(d)]);
    };

    return {
      banglaYear: enToBnDigits(bYear),
      banglaDay: enToBnDigits(bDay),
      banglaMonth: banglaMonths[bMonthIndex],
      season: seasons[Math.floor(bMonthIndex / 2)],
      formattedBangla: `${enToBnDigits(bDay)} ${banglaMonths[bMonthIndex].split(' ')[0]}, ${enToBnDigits(bYear)} বঙ্গাব্দ`,
    };
  }, [gregorianDate]);

  // ==================== 3. BANGLA NUMBER & WORDS CONVERTER ====================
  const [numInput, setNumInput] = useState<string>('১২৩৪৫৬৭৮৯০');

  const convertedNumbers = useMemo(() => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let toEnglish = '';
    for (const char of numInput) {
      const idx = bnDigits.indexOf(char);
      if (idx !== -1) toEnglish += enDigits[idx];
      else toEnglish += char;
    }

    let toBangla = '';
    for (const char of toEnglish) {
      const idx = enDigits.indexOf(char);
      if (idx !== -1) toBangla += bnDigits[idx];
      else toBangla += char;
    }

    return {
      toEnglish,
      toBangla,
    };
  }, [numInput]);

  // ==================== 4. BD TAX CALCULATOR ====================
  const [annualSalary, setAnnualSalary] = useState<number>(600000);
  const [genderCategory, setGenderCategory] = useState<'male' | 'female' | 'senior'>('male');

  const taxStats = useMemo(() => {
    const gross = annualSalary;
    // BD Tax Exempt Limits
    const exemptionLimit = genderCategory === 'male' ? 350000 : 400000;
    let taxable = Math.max(0, gross - exemptionLimit);
    let totalTax = 0;

    // Slabs:
    // 1st 100,000 at 5%
    // Next 300,000 at 10%
    // Next 400,000 at 15%
    // Next 500,000 at 20%
    // Remaining at 25%

    const slabs = [
      { cap: 100000, rate: 0.05 },
      { cap: 300000, rate: 0.10 },
      { cap: 400000, rate: 0.15 },
      { cap: 500000, rate: 0.20 },
      { cap: Infinity, rate: 0.25 },
    ];

    let rem = taxable;
    for (const slab of slabs) {
      if (rem <= 0) break;
      const take = Math.min(rem, slab.cap);
      totalTax += take * slab.rate;
      rem -= take;
    }

    // Min tax for Dhaka/Chittagong City Corp if taxable > 0 is 5,000 BDT
    if (taxable > 0 && totalTax < 5000) {
      totalTax = 5000;
    }

    const netAnnual = gross - totalTax;
    const monthlyNet = netAnnual / 12;

    return {
      gross,
      exemptionLimit,
      taxable,
      totalTax,
      netAnnual,
      monthlyNet: monthlyNet.toFixed(0),
      effectiveRate: gross > 0 ? ((totalTax / gross) * 100).toFixed(1) : '0',
    };
  }, [annualSalary, genderCategory]);

  return (
    <div id="bangladesh-tool-container" className="space-y-6">
      {/* 1. NID VALIDATOR & PARSER */}
      {toolSlug === 'bd-nid-validator' && (
        <div className="space-y-5 max-w-xl mx-auto">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Enter Bangladeshi National ID (NID) Number
            </label>
            <input
              type="text"
              value={nidInput}
              onChange={e => setNidInput(e.target.value)}
              placeholder="e.g. 19902692512345678 or 10-digit Smart Card ID"
              className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-base font-mono font-bold"
            />
            <p className="text-xs text-neutral-400">
              Supports 10-digit Smart Cards, 13-digit legacy cards, and 17-digit official format.
            </p>
          </div>

          {nidDetails.valid ? (
            <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Format Verified: {nidDetails.type}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-100 dark:border-emerald-800">
                  <span className="text-neutral-400 block mb-0.5">Birth Year:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{nidDetails.birthYear}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-100 dark:border-emerald-800">
                  <span className="text-neutral-400 block mb-0.5">Regional District:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{nidDetails.district}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                {nidDetails.notes}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {nidDetails.error}
            </div>
          )}
        </div>
      )}

      {/* 2. BANGLA DATE CONVERTER */}
      {toolSlug === 'bangla-date-converter' && (
        <div className="space-y-6 max-w-lg mx-auto">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Choose Gregorian (English) Date
            </label>
            <input
              type="date"
              value={gregorianDate}
              onChange={e => setGregorianDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-base font-bold"
            />
          </div>

          {banglaDate && (
            <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/40 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Official Bengali Calendar (বঙ্গাব্দ)
              </span>
              <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                {banglaDate.formattedBangla}
              </p>
              <div className="flex justify-center gap-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
                <span>ঋতু: {banglaDate.season}</span>
                <span>বছর: {banglaDate.banglaYear} বঙ্গাব্দ</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BANGLA NUMBER CONVERTER */}
      {toolSlug === 'bangla-number-converter' && (
        <div className="space-y-5 max-w-xl mx-auto">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Type or Paste Numbers (Bangla or English)
            </label>
            <input
              type="text"
              value={numInput}
              onChange={e => setNumInput(e.target.value)}
              placeholder="e.g. ১২৩৪৫ or 12345"
              className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-neutral-500">
                <span>English Numbers (Western)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(convertedNumbers.toEnglish);
                    showToast('Copied English digits!');
                  }}
                  className="hover:text-indigo-600"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
                {convertedNumbers.toEnglish}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-neutral-500">
                <span>Bangla Numbers (বাংলা)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(convertedNumbers.toBangla);
                    showToast('Copied Bangla digits!');
                  }}
                  className="hover:text-indigo-600"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {convertedNumbers.toBangla}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. BD TAX CALCULATOR */}
      {toolSlug === 'bd-tax-calculator' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Annual Gross Income (৳ BDT)
              </label>
              <input
                type="number"
                value={annualSalary}
                onChange={e => setAnnualSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-lg font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Taxpayer Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'male', label: 'General / Male (3.5L Limit)' },
                  { id: 'female', label: 'Female (4.0L Limit)' },
                  { id: 'senior', label: 'Senior Citizen (65+)' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setGenderCategory(cat.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                      genderCategory === cat.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-center">
              <span className="text-xs uppercase font-bold text-indigo-700 dark:text-indigo-300">
                Total Annual Tax Payable (NBR Slabs)
              </span>
              <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                ৳ {taxStats.totalTax.toLocaleString()}
              </p>
              <span className="text-xs text-neutral-500 block mt-1">
                Effective Tax Rate: {taxStats.effectiveRate}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <span className="text-neutral-400 block">Exempted Amount</span>
                <span className="text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                  ৳ {taxStats.exemptionLimit.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <span className="text-neutral-400 block">Net Monthly In-Hand</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                  ৳ {parseInt(taxStats.monthlyNet).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
