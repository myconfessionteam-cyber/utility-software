import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Calculator, Calendar, Percent, DollarSign, Activity, ArrowRightLeft, Sparkles, Tag, Clock, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CalculatorToolProps {
  toolSlug: string;
}

export const CalculatorTools: React.FC<CalculatorToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();

  // ==================== 1. GPA CALCULATOR ====================
  const [courses, setCourses] = useState<Array<{ id: string; name: string; credits: number; grade: number }>>([
    { id: '1', name: 'Computer Science 101', credits: 3, grade: 4.0 },
    { id: '2', name: 'Calculus II', credits: 4, grade: 3.7 },
    { id: '3', name: 'Physics Mechanics', credits: 4, grade: 3.3 },
    { id: '4', name: 'Academic Writing', credits: 3, grade: 4.0 },
  ]);

  const gradeOptions = [
    { label: 'A+ (4.0)', val: 4.0 },
    { label: 'A (4.0)', val: 4.0 },
    { label: 'A- (3.7)', val: 3.7 },
    { label: 'B+ (3.3)', val: 3.3 },
    { label: 'B (3.0)', val: 3.0 },
    { label: 'B- (2.7)', val: 2.7 },
    { label: 'C+ (2.3)', val: 2.3 },
    { label: 'C (2.0)', val: 2.0 },
    { label: 'D (1.0)', val: 1.0 },
    { label: 'F (0.0)', val: 0.0 },
  ];

  const gpaStats = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      totalPoints += c.credits * c.grade;
      totalCredits += c.credits;
    });
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return {
      gpa: gpa.toFixed(2),
      totalCredits,
      totalPoints: totalPoints.toFixed(1),
    };
  }, [courses]);

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 7), name: `Course ${prev.length + 1}`, credits: 3, grade: 4.0 },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // ==================== 2. AGE CALCULATOR ====================
  const [dob, setDob] = useState<string>('2000-01-15');

  const ageStats = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    if (birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      daysToNext,
    };
  }, [dob]);

  // ==================== 3. PERCENTAGE CALCULATOR ====================
  const [p1Num, setP1Num] = useState<number>(20);
  const [p1Total, setP1Total] = useState<number>(150);
  const p1Result = useMemo(() => ((p1Num / 100) * p1Total).toFixed(2), [p1Num, p1Total]);

  const [p2Part, setP2Part] = useState<number>(45);
  const [p2Whole, setP2Whole] = useState<number>(180);
  const p2Result = useMemo(() => (p2Whole > 0 ? ((p2Part / p2Whole) * 100).toFixed(2) : '0'), [p2Part, p2Whole]);

  const [p3From, setP3From] = useState<number>(50);
  const [p3To, setP3To] = useState<number>(75);
  const p3Diff = useMemo(() => (p3From !== 0 ? (((p3To - p3From) / p3From) * 100).toFixed(2) : '0'), [p3From, p3To]);

  // ==================== 4. DISCOUNT CALCULATOR ====================
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [extraDiscount, setExtraDiscount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(5);

  const discountStats = useMemo(() => {
    const primaryDiscountAmount = (originalPrice * discountPercent) / 100;
    const priceAfterPrimary = originalPrice - primaryDiscountAmount;
    const extraDiscountAmount = (priceAfterPrimary * extraDiscount) / 100;
    const priceAfterDiscounts = priceAfterPrimary - extraDiscountAmount;
    const totalSavings = originalPrice - priceAfterDiscounts;
    const taxAmount = (priceAfterDiscounts * taxPercent) / 100;
    const finalPayable = priceAfterDiscounts + taxAmount;
    const effectivePercent = originalPrice > 0 ? ((totalSavings / originalPrice) * 100).toFixed(1) : '0';

    return {
      primaryDiscountAmount: primaryDiscountAmount.toFixed(2),
      totalSavings: totalSavings.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      finalPayable: finalPayable.toFixed(2),
      effectivePercent,
    };
  }, [originalPrice, discountPercent, extraDiscount, taxPercent]);

  // ==================== 5. DATE DIFFERENCE CALCULATOR ====================
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(true);

  const dateDiffStats = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const earlier = start < end ? start : end;
    const later = start < end ? end : start;
    const isReversed = start > end;

    let totalDays = Math.round((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));
    if (includeEndDay) totalDays += 1;

    // Calculate working days (Mon-Fri)
    let workDays = 0;
    let weekendDays = 0;
    const cur = new Date(earlier);
    const stopTime = later.getTime();

    while (cur.getTime() <= stopTime) {
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        workDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    if (!includeEndDay && totalDays > 0) {
      const lastDay = later.getDay();
      if (lastDay === 0 || lastDay === 6) {
        weekendDays = Math.max(0, weekendDays - 1);
      } else {
        workDays = Math.max(0, workDays - 1);
      }
    }

    // Exact years, months, days
    let y = later.getFullYear() - earlier.getFullYear();
    let m = later.getMonth() - earlier.getMonth();
    let d = later.getDate() - earlier.getDate();
    if (d < 0) {
      m--;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    if (includeEndDay) d += 1;

    const totalWeeks = (totalDays / 7).toFixed(1);
    const totalHours = totalDays * 24;

    return {
      isReversed,
      totalDays,
      workDays,
      weekendDays,
      years: y,
      months: m,
      days: d,
      totalWeeks,
      totalHours,
    };
  }, [startDate, endDate, includeEndDay]);

  // ==================== 6. EMI LOAN CALCULATOR ====================
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const emiStats = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / (12 * 100);
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return { emi: '0', totalInterest: '0', totalPayment: '0' };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
  }, [loanAmount, interestRate, tenureYears]);

  // ==================== 7. TIMEZONE CONVERTER ====================
  const [tzTime, setTzTime] = useState<string>('14:30');
  const [tzDate, setTzDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [baseTimezone, setBaseTimezone] = useState<string>('Asia/Dhaka');

  const timezoneList = [
    { label: 'Dhaka (BST, GMT+6)', tz: 'Asia/Dhaka', offset: '+06:00' },
    { label: 'UTC / GMT (Coordinated Universal Time)', tz: 'UTC', offset: '+00:00' },
    { label: 'London (GMT/BST)', tz: 'Europe/London', offset: '+00:00' },
    { label: 'New York (EDT/EST)', tz: 'America/New_York', offset: '-04:00' },
    { label: 'Tokyo (JST, GMT+9)', tz: 'Asia/Tokyo', offset: '+09:00' },
    { label: 'Dubai (GST, GMT+4)', tz: 'Asia/Dubai', offset: '+04:00' },
    { label: 'Singapore (SGT, GMT+8)', tz: 'Asia/Singapore', offset: '+08:00' },
    { label: 'Los Angeles (PDT/PST)', tz: 'America/Los_Angeles', offset: '-07:00' },
    { label: 'Sydney (AEST/AEDT)', tz: 'Australia/Sydney', offset: '+10:00' },
  ];

  const convertedTimezones = useMemo(() => {
    try {
      const [hours, minutes] = tzTime.split(':').map(Number);
      const [year, month, day] = tzDate.split('-').map(Number);
      // Create a reference date
      const d = new Date(Date.UTC(year, month - 1, day, hours, minutes));

      return timezoneList.map(item => {
        try {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: item.tz,
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          const time24 = new Intl.DateTimeFormat('en-US', {
            timeZone: item.tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(d);

          return {
            ...item,
            formatted12: formatter.format(d),
            formatted24: time24,
          };
        } catch {
          return { ...item, formatted12: 'N/A', formatted24: 'N/A' };
        }
      });
    } catch {
      return [];
    }
  }, [tzTime, tzDate, baseTimezone]);

  // ==================== 8. UNIT CONVERTER ====================
  const [unitType, setUnitType] = useState<'length' | 'weight' | 'temperature' | 'storage' | 'area'>('length');
  const [unitInputVal, setUnitInputVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const unitResult = useMemo(() => {
    const val = unitInputVal;
    if (unitType === 'length') {
      const toMeters: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        mi: 1609.34,
        yd: 0.9144,
        ft: 0.3048,
        in: 0.0254,
      };
      const inMeters = val * (toMeters[fromUnit] || 1);
      const res = inMeters / (toMeters[toUnit] || 1);
      return res.toFixed(4);
    } else if (unitType === 'weight') {
      const toKg: Record<string, number> = {
        kg: 1,
        g: 0.001,
        lb: 0.453592,
        oz: 0.0283495,
      };
      const inKg = val * (toKg[fromUnit] || 1);
      const res = inKg / (toKg[toUnit] || 1);
      return res.toFixed(4);
    } else if (unitType === 'temperature') {
      let celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * (5 / 9);
      if (fromUnit === 'K') celsius = val - 273.15;

      let target = celsius;
      if (toUnit === 'F') target = celsius * (9 / 5) + 32;
      if (toUnit === 'K') target = celsius + 273.15;
      return target.toFixed(2);
    } else if (unitType === 'storage') {
      const toBytes: Record<string, number> = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
        TB: 1024 * 1024 * 1024 * 1024,
      };
      const inBytes = val * (toBytes[fromUnit] || 1);
      const res = inBytes / (toBytes[toUnit] || 1);
      return res.toFixed(4);
    } else if (unitType === 'area') {
      const toSqMeters: Record<string, number> = {
        sqm: 1,
        sqft: 0.092903,
        sqyd: 0.836127,
        acre: 4046.86,
        hectare: 10000,
      };
      const inSqm = val * (toSqMeters[fromUnit] || 1);
      const res = inSqm / (toSqMeters[toUnit] || 1);
      return res.toFixed(4);
    }
    return '0';
  }, [unitType, unitInputVal, fromUnit, toUnit]);

  return (
    <div id="calculator-tool-container" className="space-y-6">
      {/* 1. GPA CALCULATOR */}
      {toolSlug === 'gpa-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/40 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Cumulative GPA</span>
              <p className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{gpaStats.gpa}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Credits</span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{gpaStats.totalCredits}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Standing</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {parseFloat(gpaStats.gpa) >= 3.8
                  ? 'Summa Cum Laude'
                  : parseFloat(gpaStats.gpa) >= 3.5
                  ? 'Magna Cum Laude'
                  : parseFloat(gpaStats.gpa) >= 3.0
                  ? 'Good Standing'
                  : 'Passing'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Course List ({courses.length})</h3>
              <button
                onClick={addCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 p-4 space-y-3">
              {courses.map((course, idx) => (
                <div key={course.id} className="pt-3 first:pt-0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-6">
                    <label className="text-[11px] text-slate-400 block mb-1">Course Title</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={e => {
                        const next = [...courses];
                        next[idx].name = e.target.value;
                        setCourses(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={course.credits}
                      onChange={e => {
                        const next = [...courses];
                        next[idx].credits = parseInt(e.target.value) || 1;
                        setCourses(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-center"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[11px] text-slate-400 block mb-1">Grade</label>
                    <select
                      value={course.grade}
                      onChange={e => {
                        const next = [...courses];
                        next[idx].grade = parseFloat(e.target.value);
                        setCourses(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium"
                    >
                      {gradeOptions.map(g => (
                        <option key={g.label} value={g.val}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length <= 1}
                      className="p-2 text-slate-400 hover:text-rose-500 disabled:opacity-20 transition"
                      title="Remove course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. AGE CALCULATOR */}
      {toolSlug === 'age-calculator' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Select Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-semibold"
              />
            </div>
          </div>

          {ageStats && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center">
                  <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-300">Years</span>
                  <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{ageStats.years}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs uppercase font-bold text-slate-500">Months</span>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{ageStats.months}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs uppercase font-bold text-slate-500">Days</span>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{ageStats.days}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 block">Total Days</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{ageStats.totalDays.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 block">Total Hours</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{ageStats.totalHours.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 block">Total Minutes</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{ageStats.totalMinutes.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 block">Next Birthday</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">in {ageStats.daysToNext} days</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. PERCENTAGE CALCULATOR */}
      {toolSlug === 'percentage-calculator' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
              <span>What is</span>
              <input
                type="number"
                value={p1Num}
                onChange={e => setP1Num(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
              />
              <span>% of</span>
              <input
                type="number"
                value={p1Total}
                onChange={e => setP1Total(parseFloat(e.target.value) || 0)}
                className="w-24 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
              />
              <span>?</span>
            </div>
            <div className="text-right sm:border-l border-slate-100 dark:border-slate-800 sm:pl-4">
              <span className="text-xs text-slate-400 block">Result</span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{p1Result}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
              <input
                type="number"
                value={p2Part}
                onChange={e => setP2Part(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
              />
              <span>is what % of</span>
              <input
                type="number"
                value={p2Whole}
                onChange={e => setP2Whole(parseFloat(e.target.value) || 0)}
                className="w-24 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
              />
              <span>?</span>
            </div>
            <div className="text-right sm:border-l border-slate-100 dark:border-slate-800 sm:pl-4">
              <span className="text-xs text-slate-400 block">Percentage</span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{p2Result}%</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
              <span>Change from</span>
              <input
                type="number"
                value={p3From}
                onChange={e => setP3From(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
              />
              <span>to</span>
              <input
                type="number"
                value={p3To}
                onChange={e => setP3To(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold"
              />
            </div>
            <div className="text-right sm:border-l border-slate-100 dark:border-slate-800 sm:pl-4">
              <span className="text-xs text-slate-400 block">Difference</span>
              <span className={`text-2xl font-extrabold ${parseFloat(p3Diff) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {parseFloat(p3Diff) >= 0 ? `+${p3Diff}%` : `${p3Diff}%`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. DISCOUNT CALCULATOR */}
      {toolSlug === 'discount-calculator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" /> Price & Discount Inputs
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Original Price ($)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={e => setOriginalPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-base"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Discount ({discountPercent}%)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(parseInt(e.target.value) || 0)}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-xs font-bold w-12 text-right">{discountPercent}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Extra Coupon (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={extraDiscount}
                  onChange={e => setExtraDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Sales Tax (%)
                </label>
                <input
                  type="number"
                  min="0"
                  value={taxPercent}
                  onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center shadow-xs">
              <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-300">Final Sale Price</span>
              <p className="text-4xl sm:text-5xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
                ${discountStats.finalPayable}
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                You Save: ${discountStats.totalSavings} ({discountStats.effectivePercent}%)
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Original Price</span>
                <span className="font-bold">${originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Total Discount</span>
                <span className="font-bold">-${discountStats.totalSavings}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Sales Tax ({taxPercent}%)</span>
                <span className="font-bold">+${discountStats.taxAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DATE DIFFERENCE CALCULATOR */}
      {toolSlug === 'date-difference-calculator' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="includeEndDayCheck"
                checked={includeEndDay}
                onChange={e => setIncludeEndDay(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600"
              />
              <label htmlFor="includeEndDayCheck" className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                Include end date in total day count (adds 1 day)
              </label>
            </div>
          </div>

          {dateDiffStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 shadow-xs">
                  <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300">Total Days</span>
                  <p className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{dateDiffStats.totalDays}</p>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 shadow-xs">
                  <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">Business / Working Days</span>
                  <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{dateDiffStats.workDays}</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-xs font-bold uppercase text-slate-500">Weekend Days</span>
                  <p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{dateDiffStats.weekendDays}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div>
                  <span className="text-slate-400 block">Years, Months, Days</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                    {dateDiffStats.years}y {dateDiffStats.months}m {dateDiffStats.days}d
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Weeks</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">{dateDiffStats.totalWeeks} wks</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Hours</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">{dateDiffStats.totalHours.toLocaleString()} hrs</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Direction</span>
                  <span className="text-sm font-bold text-amber-600 mt-1 block">
                    {dateDiffStats.isReversed ? 'Backwards' : 'Forwards'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. EMI LOAN CALCULATOR */}
      {(toolSlug === 'loan-emi-calculator' || toolSlug === 'emi-calculator') && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Loan Principal Amount ($)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={e => setLoanAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={e => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Loan Tenure ({tenureYears} Years / {tenureYears * 12} Months)
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={tenureYears}
                  onChange={e => setTenureYears(parseInt(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center shadow-xs">
                <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-300">Monthly EMI Payment</span>
                <p className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">${emiStats.emi}</p>
                <span className="text-xs text-slate-400 block mt-1">payable each month</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Interest</span>
                  <p className="text-xl font-bold text-rose-500 mt-1">${emiStats.totalInterest}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Payable</span>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">${emiStats.totalPayment}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TIMEZONE CONVERTER */}
      {toolSlug === 'timezone-converter' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" /> Convert Time Across Cities & Countries
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Select Base Date</label>
                <input
                  type="date"
                  value={tzDate}
                  onChange={e => setTzDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Select Time (24-Hour)</label>
                <input
                  type="time"
                  value={tzTime}
                  onChange={e => setTzTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Timezone Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {convertedTimezones.map(item => (
              <div
                key={item.tz}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 block">{item.label}</span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {item.formatted12}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
                  <span>24h: {item.formatted24}</span>
                  <span>{item.tz}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. UNIT CONVERTER */}
      {toolSlug === 'unit-converter' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {(['length', 'weight', 'temperature', 'storage', 'area'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  setUnitType(type);
                  if (type === 'length') {
                    setFromUnit('m');
                    setToUnit('ft');
                  } else if (type === 'weight') {
                    setFromUnit('kg');
                    setToUnit('lb');
                  } else if (type === 'storage') {
                    setFromUnit('GB');
                    setToUnit('MB');
                  } else if (type === 'area') {
                    setFromUnit('sqm');
                    setToUnit('sqft');
                  } else {
                    setFromUnit('C');
                    setToUnit('F');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  unitType === type
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">From</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={unitInputVal}
                    onChange={e => setUnitInputVal(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-base"
                  />
                  <select
                    value={fromUnit}
                    onChange={e => setFromUnit(e.target.value)}
                    className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs"
                  >
                    {unitType === 'length' && (
                      <>
                        <option value="m">Meter (m)</option>
                        <option value="km">Kilometer (km)</option>
                        <option value="cm">Centimeter (cm)</option>
                        <option value="mm">Millimeter (mm)</option>
                        <option value="mi">Mile (mi)</option>
                        <option value="yd">Yard (yd)</option>
                        <option value="ft">Foot (ft)</option>
                        <option value="in">Inch (in)</option>
                      </>
                    )}
                    {unitType === 'weight' && (
                      <>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="lb">Pound (lb)</option>
                        <option value="oz">Ounce (oz)</option>
                      </>
                    )}
                    {unitType === 'temperature' && (
                      <>
                        <option value="C">Celsius (°C)</option>
                        <option value="F">Fahrenheit (°F)</option>
                        <option value="K">Kelvin (K)</option>
                      </>
                    )}
                    {unitType === 'storage' && (
                      <>
                        <option value="B">Bytes (B)</option>
                        <option value="KB">Kilobytes (KB)</option>
                        <option value="MB">Megabytes (MB)</option>
                        <option value="GB">Gigabytes (GB)</option>
                        <option value="TB">Terabytes (TB)</option>
                      </>
                    )}
                    {unitType === 'area' && (
                      <>
                        <option value="sqm">Square Meter (m²)</option>
                        <option value="sqft">Square Foot (ft²)</option>
                        <option value="sqyd">Square Yard (yd²)</option>
                        <option value="acre">Acre</option>
                        <option value="hectare">Hectare</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">To</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    type="text"
                    value={unitResult}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold text-base"
                  />
                  <select
                    value={toUnit}
                    onChange={e => setToUnit(e.target.value)}
                    className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs"
                  >
                    {unitType === 'length' && (
                      <>
                        <option value="ft">Foot (ft)</option>
                        <option value="m">Meter (m)</option>
                        <option value="km">Kilometer (km)</option>
                        <option value="cm">Centimeter (cm)</option>
                        <option value="mm">Millimeter (mm)</option>
                        <option value="mi">Mile (mi)</option>
                        <option value="yd">Yard (yd)</option>
                        <option value="in">Inch (in)</option>
                      </>
                    )}
                    {unitType === 'weight' && (
                      <>
                        <option value="lb">Pound (lb)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="oz">Ounce (oz)</option>
                      </>
                    )}
                    {unitType === 'temperature' && (
                      <>
                        <option value="F">Fahrenheit (°F)</option>
                        <option value="C">Celsius (°C)</option>
                        <option value="K">Kelvin (K)</option>
                      </>
                    )}
                    {unitType === 'storage' && (
                      <>
                        <option value="MB">Megabytes (MB)</option>
                        <option value="GB">Gigabytes (GB)</option>
                        <option value="TB">Terabytes (TB)</option>
                        <option value="KB">Kilobytes (KB)</option>
                        <option value="B">Bytes (B)</option>
                      </>
                    )}
                    {unitType === 'area' && (
                      <>
                        <option value="sqft">Square Foot (ft²)</option>
                        <option value="sqm">Square Meter (m²)</option>
                        <option value="sqyd">Square Yard (yd²)</option>
                        <option value="acre">Acre</option>
                        <option value="hectare">Hectare</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
