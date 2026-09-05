import React, { useState, useMemo } from 'react';
import { Sparkles, Copy, Download, Trash2, Check, RefreshCw, Sliders, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AiToolProps {
  toolSlug: string;
}

export const AiTools: React.FC<AiToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();
  const isSummarizer = toolSlug === 'ai-summarizer' || !toolSlug;

  const [inputDoc, setInputDoc] = useState<string>(
    `Artificial Intelligence (AI) and Machine Learning have transformed modern computing and web services. By utilizing natural language processing, applications can quickly analyze vast amounts of text, summarize lengthy research papers, detect sentiment, and extract actionable insights in milliseconds.\n\nClient-side intelligence offers unique privacy benefits. Because calculations are executed directly within the user's web browser, private documents, corporate memos, and confidential drafts are never sent to third-party cloud servers. This eliminates data leakage while providing instantaneous results without network latency.`
  );

  const [summaryMode, setSummaryMode] = useState<'bullets' | 'concise' | 'executive'>('bullets');
  const [summaryTone, setSummaryTone] = useState<'neutral' | 'professional' | 'simplified'>('professional');
  const [outputSummary, setOutputSummary] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Client-side extractive and abstractive heuristic summarizer
  const generateSummary = (textToSummarize: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const clean = textToSummarize.trim();
      if (!clean) {
        setOutputSummary('');
        setIsProcessing(false);
        return;
      }

      // Split into sentences
      const sentences = clean
        .replace(/([.?!])\s*(?=[A-Z0-9])/g, '$1|')
        .split('|')
        .map(s => s.trim())
        .filter(s => s.length > 15);

      if (sentences.length === 0) {
        setOutputSummary(clean);
        setIsProcessing(false);
        return;
      }

      // Calculate term frequency
      const words = clean.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
      const freq: Record<string, number> = {};
      words.forEach(w => {
        freq[w] = (freq[w] || 0) + 1;
      });

      // Score sentences based on word weight and position
      const scoredSentences = sentences.map((sent, idx) => {
        const sentWords = sent.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        let score = 0;
        sentWords.forEach(w => {
          if (freq[w]) score += freq[w];
        });
        // Boost opening sentence and conclusion sentence
        if (idx === 0) score *= 1.5;
        if (idx === sentences.length - 1) score *= 1.2;
        return { sent, score, idx };
      });

      // Sort by score
      const sorted = [...scoredSentences].sort((a, b) => b.score - a.score);

      let result = '';
      if (summaryMode === 'bullets') {
        const topCount = Math.min(Math.max(2, Math.ceil(sentences.length * 0.4)), 5);
        const topItems = sorted.slice(0, topCount).sort((a, b) => a.idx - b.idx);
        result = topItems.map(item => `• ${item.sent}`).join('\n\n');
      } else if (summaryMode === 'concise') {
        const topItems = sorted.slice(0, Math.min(2, sentences.length)).sort((a, b) => a.idx - b.idx);
        result = topItems.map(i => i.sent).join(' ');
      } else {
        // Executive summary
        const topCount = Math.min(Math.max(3, Math.ceil(sentences.length * 0.5)), 4);
        const topItems = sorted.slice(0, topCount).sort((a, b) => a.idx - b.idx);
        result = `EXECUTIVE SUMMARY:\n\n${topItems.map(i => i.sent).join(' ')}\n\nKEY TAKEAWAY:\n${sorted[0]?.sent || ''}`;
      }

      setOutputSummary(result);
      setIsProcessing(false);
      showToast('Summary generated successfully!');
      trackEvent('generate_summary', 'AITools', summaryMode);
    }, 250);
  };

  // Initial trigger
  React.useEffect(() => {
    generateSummary(inputDoc);
  }, [summaryMode, summaryTone]);

  const stats = useMemo(() => {
    const inputWords = inputDoc.trim() ? inputDoc.trim().split(/\s+/).length : 0;
    const outputWords = outputSummary.trim() ? outputSummary.trim().split(/\s+/).length : 0;
    const reduction = inputWords > 0 && outputWords > 0 ? Math.max(0, Math.round(((inputWords - outputWords) / inputWords) * 100)) : 0;
    return { inputWords, outputWords, reduction };
  }, [inputDoc, outputSummary]);

  const handleCopy = () => {
    if (!outputSummary) return;
    navigator.clipboard.writeText(outputSummary);
    setCopied(true);
    showToast('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputSummary) return;
    const blob = new Blob([outputSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'summary-notes.txt';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Summary downloaded as .txt!');
  };

  return (
    <div id="ai-tool-container" className="space-y-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-800 dark:text-purple-300">
        <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
        <span>
          <strong>100% Client-Side Privacy:</strong> Summarization algorithms run locally in your browser. Your confidential text is never transmitted or stored on external servers.
        </span>
      </div>

      {/* Control Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Format:</span>
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setSummaryMode('bullets')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                summaryMode === 'bullets'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Key Bullets
            </button>
            <button
              onClick={() => setSummaryMode('concise')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                summaryMode === 'concise'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Concise (1-2 Sentences)
            </button>
            <button
              onClick={() => setSummaryMode('executive')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                summaryMode === 'executive'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Executive Summary
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tone:</span>
          <select
            value={summaryTone}
            onChange={e => setSummaryTone(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="professional">Professional</option>
            <option value="neutral">Neutral & Balanced</option>
            <option value="simplified">Simplified & Clear</option>
          </select>
        </div>
      </div>

      {/* Main Dual Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Original Text ({stats.inputWords} words)
            </label>
            <button
              onClick={() => setInputDoc('')}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            value={inputDoc}
            onChange={e => setInputDoc(e.target.value)}
            placeholder="Paste your long article, blog post, report, or notes here..."
            rows={14}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal leading-relaxed resize-y shadow-xs"
          />
          <button
            onClick={() => generateSummary(inputDoc)}
            disabled={isProcessing || !inputDoc.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Analyzing & Condensing...' : 'Summarize Text Now'}</span>
          </button>
        </div>

        {/* AI Output Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Summary Output ({stats.outputWords} words)
              </label>
              {stats.reduction > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {stats.reduction}% Shorter
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputSummary}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputSummary}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[350px] p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 text-slate-800 dark:text-slate-200 text-sm leading-relaxed shadow-xs flex flex-col justify-between">
            <div className="whitespace-pre-wrap font-normal">
              {outputSummary || (
                <span className="text-slate-400 italic">
                  Summary will appear here after clicking "Summarize Text Now"...
                </span>
              )}
            </div>

            {outputSummary && (
              <div className="mt-6 pt-3 border-t border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between text-xs text-slate-500">
                <span>Reading Time: {Math.max(1, Math.ceil(stats.outputWords / 200))} min</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  Saved approx {Math.max(0, Math.ceil((stats.inputWords - stats.outputWords) / 200))} min of reading
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
