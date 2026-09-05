import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Calculator, Calendar, Percent, DollarSign, Activity, ArrowRightLeft, Sparkles } from 'lucide-react';
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
  const [p1Total, setP1Total] = useState<number>(500);

  const [p2Part, setP2Part] = useState<number>(45);
  const [p2Whole, setP2Whole] = useState<number>(180);

  const [p3From, setP3From] = useState<number>(50);
  const [p3To, setP3To] = useState<number>(75);

  const p1Result = ((p1Num / 100) * p1Total).toFixed(2);
  const p2Result = p2Whole !== 0 ? (((p2Part / p2Whole) * 100)).toFixed(2) : '0';
  const p3Diff = p3From !== 0 ? (((p3To - p3From) / p3From) * 100).toFixed(2) : '0';

  // ==================== 4. EMI LOAN CALCULATOR ====================
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const emiStats = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
  }, [loanAmount, interestRate, tenureYears]);

  // ==================== 5. BMI CALCULATOR ====================
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(154);

  const bmiStats = useMemo(() => {
    let bmi = 0;
    if (bmiUnit === 'metric') {
      const hM = heightCm / 100;
      if (hM > 0) bmi = weightKg / (hM * hM);
    } else {
      const totalInches = heightFeet * 12 + heightInches;
      if (totalInches > 0) bmi = (weightLbs / (totalInches * totalInches)) * 703;
    }

    let category = 'Normal';
    let color = 'text-emerald-500';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      color = 'text-amber-500';
    } else if (bmi >= 30) {
      category = 'Obesity';
      color = 'text-rose-500';
    }

    return {
      bmi: bmi.toFixed(1),
      category,
      color,
    };
  }, [bmiUnit, heightCm, weightKg, heightFeet, heightInches, weightLbs]);

  // ==================== 6. UNIT CONVERTER ====================
  const [unitType, setUnitType] = useState<'length' | 'weight' | 'temperature'>('length');
  const [unitInputVal, setUnitInputVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const unitResult = useMemo(() => {
    const val = unitInputVal;
    if (unitType === 'length') {
      // Base: meters
      const toMeters: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 };
      const meters = val * (toMeters[fromUnit] || 1);
      const res = meters / (toMeters[toUnit] || 1);
      return res.toFixed(4);
    } else if (unitType === 'weight') {
      // Base: kilograms
      const toKg: Record<string, number> = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 };
      const kg = val * (toKg[fromUnit] || 1);
      const res = kg / (toKg[toUnit] || 1);
      return res.toFixed(4);
    } else if (unitType === 'temperature') {
      let celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * (5 / 9);
      if (fromUnit === 'K') celsius = val - 273.15;

      let target = celsius;
      if (toUnit === 'F') target = celsius * (9 / 5) + 32;
      if (toUnit === 'K') target = celsius + 273.15;
      return target.toFixed(2);
    }
    return '0';
  }, [unitType, unitInputVal, fromUnit, toUnit]);

  return (
    <div id="calculator-tool-container" className="space-y-6">
      {/* 1. GPA CALCULATOR */}
      {toolSlug === 'gpa-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/40 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Cumulative GPA</span>
              <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{gpaStats.gpa}</p>
            </div>
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Credits</span>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">{gpaStats.totalCredits}</p>
            </div>
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Honor Status</span>
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

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Course List ({courses.length})</h3>
              <button
                onClick={addCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 p-4 space-y-3">
              {courses.map((course, idx) => (
                <div key={course.id} className="pt-3 first:pt-0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-6">
                    <label className="text-[11px] text-neutral-400 block mb-1">Course Title</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={e => {
                        const next = [...courses];
                        next[idx].name = e.target.value;
                        setCourses(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-neutral-400 block mb-1">Credits</label>
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
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm font-medium text-center"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[11px] text-neutral-400 block mb-1">Grade</label>
                    <select
                      value={course.grade}
                      onChange={e => {
                        const next = [...courses];
                        next[idx].grade = parseFloat(e.target.value);
                        setCourses(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm font-medium"
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
                      className="p-2 text-neutral-400 hover:text-rose-500 disabled:opacity-20 transition"
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
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                Select Your Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-base font-semibold"
              />
            </div>
          </div>

          {ageStats && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Primary Age Display */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-center">
                  <span className="text-xs uppercase font-bold text-indigo-700 dark:text-indigo-300">Years</span>
                  <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{ageStats.years}</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
                  <span className="text-xs uppercase font-bold text-neutral-500">Months</span>
                  <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">{ageStats.months}</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
                  <span className="text-xs uppercase font-bold text-neutral-500">Days</span>
                  <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">{ageStats.days}</p>
                </div>
              </div>

              {/* Total Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 block">Total Days</span>
                  <span className="text-base font-bold text-neutral-900 dark:text-white mt-0.5 block">{ageStats.totalDays.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 block">Total Hours</span>
                  <span className="text-base font-bold text-neutral-900 dark:text-white mt-0.5 block">{ageStats.totalHours.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 block">Total Minutes</span>
                  <span className="text-base font-bold text-neutral-900 dark:text-white mt-0.5 block">{ageStats.totalMinutes.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 block">Next Birthday</span>
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
          {/* Card 1: What is X% of Y */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span>What is</span>
              <input
                type="number"
                value={p1Num}
                onChange={e => setP1Num(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center"
              />
              <span>% of</span>
              <input
                type="number"
                value={p1Total}
                onChange={e => setP1Total(parseFloat(e.target.value) || 0)}
                className="w-24 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center"
              />
              <span>?</span>
            </div>
            <div className="text-right sm:border-l border-neutral-100 dark:border-neutral-800 sm:pl-4">
              <span className="text-xs text-neutral-400 block">Result</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{p1Result}</span>
            </div>
          </div>

          {/* Card 2: X is what % of Y */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="number"
                value={p2Part}
                onChange={e => setP2Part(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center"
              />
              <span>is what % of</span>
              <input
                type="number"
                value={p2Whole}
                onChange={e => setP2Whole(parseFloat(e.target.value) || 0)}
                className="w-24 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center"
              />
              <span>?</span>
            </div>
            <div className="text-right sm:border-l border-neutral-100 dark:border-neutral-800 sm:pl-4">
              <span className="text-xs text-neutral-400 block">Percentage</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{p2Result}%</span>
            </div>
          </div>

          {/* Card 3: % Increase / Decrease */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span>Change from</span>
              <input
                type="number"
                value={p3From}
                onChange={e => setP3From(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center"
              />
              <span>to</span>
              <input
                type="number"
                value={p3To}
                onChange={e => setP3To(parseFloat(e.target.value) || 0)}
                className="w-20 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center"
              />
            </div>
            <div className="text-right sm:border-l border-neutral-100 dark:border-neutral-800 sm:pl-4">
              <span className="text-xs text-neutral-400 block">Difference</span>
              <span className={`text-xl font-extrabold ${parseFloat(p3Diff) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {parseFloat(p3Diff) >= 0 ? `+${p3Diff}%` : `${p3Diff}%`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. EMI LOAN CALCULATOR */}
      {toolSlug === 'emi-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={e => setLoanAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-base font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={e => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-base font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Loan Tenure ({tenureYears} Years)
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={tenureYears}
                  onChange={e => setTenureYears(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-center">
                <span className="text-xs uppercase font-bold text-indigo-700 dark:text-indigo-300">Monthly EMI Payment</span>
                <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">${emiStats.emi}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 block">Total Interest</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white mt-1 block">${emiStats.totalInterest}</span>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-400 block">Total Payment</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white mt-1 block">${emiStats.totalPayment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. BMI CALCULATOR */}
      {toolSlug === 'bmi-calculator' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setBmiUnit('metric')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  bmiUnit === 'metric' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                Metric (cm / kg)
              </button>
              <button
                onClick={() => setBmiUnit('imperial')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  bmiUnit === 'imperial' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                Imperial (ft / lbs)
              </button>
            </div>

            {bmiUnit === 'metric' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center font-bold"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">Feet</label>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={e => setHeightFeet(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">Inches</label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={e => setHeightInches(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={e => setWeightLbs(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-center font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center space-y-2">
            <span className="text-xs uppercase font-bold text-neutral-400">Your Calculated BMI</span>
            <p className="text-5xl font-black text-neutral-900 dark:text-white">{bmiStats.bmi}</p>
            <p className={`text-lg font-bold ${bmiStats.color}`}>{bmiStats.category}</p>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              WHO BMI Scale: &lt;18.5 Underweight | 18.5–24.9 Normal | 25–29.9 Overweight | &ge;30 Obese
            </p>
          </div>
        </div>
      )}

      {/* 6. UNIT CONVERTER */}
      {toolSlug === 'unit-converter' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="flex justify-center gap-2">
            {(['length', 'weight', 'temperature'] as const).map(type => (
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
                  } else {
                    setFromUnit('C');
                    setToUnit('F');
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                  unitType === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">From</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={unitInputVal}
                    onChange={e => setUnitInputVal(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-bold text-base"
                  />
                  <select
                    value={fromUnit}
                    onChange={e => setFromUnit(e.target.value)}
                    className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-semibold text-xs"
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
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">To</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    type="text"
                    value={unitResult}
                    className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-base"
                  />
                  <select
                    value={toUnit}
                    onChange={e => setToUnit(e.target.value)}
                    className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-semibold text-xs"
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
