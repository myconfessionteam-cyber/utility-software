import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Download, Check, Sparkles, ArrowDownAZ, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileSize } from '../common/FileSize';

interface TextToolProps {
  toolSlug: string;
}

export const TextTools: React.FC<TextToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();
  const [text, setText] = useState<string>('Welcome to ToolNova! Type or paste your text here to see real-time statistics, convert cases, eliminate duplicate lines, or clean formatting.');
  const [copied, setCopied] = useState(false);

  // Copy helper
  const handleCopy = (contentToCopy?: string) => {
    const val = contentToCopy !== undefined ? contentToCopy : text;
    navigator.clipboard.writeText(val);
    setCopied(true);
    showToast('Copied to clipboard!');
    trackEvent('copy', 'TextTools', toolSlug);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download helper
  const handleDownload = (content?: string, filename = 'toolnova-text.txt') => {
    const val = content !== undefined ? content : text;
    const blob = new Blob([val], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast('File downloaded!');
    trackEvent('download', 'TextTools', toolSlug);
  };

  // ==================== 1. WORD COUNTER ====================
  const wordStats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const lines = text.length ? text.split('\n').length : 0;
    const readingTimeSec = Math.ceil((wordCount / 200) * 60);
    const speakingTimeSec = Math.ceil((wordCount / 130) * 60);

    // Keyword density
    const freqMap: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 3) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });
    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      wordCount,
      charCount,
      charNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTimeSec,
      speakingTimeSec,
      topKeywords,
      byteSize: new Blob([text]).size,
    };
  }, [text]);

  // ==================== 2. CASE CONVERTER ====================
  const convertCase = (type: string) => {
    let result = text;
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text
          .toLowerCase()
          .split(' ')
          .map((word, idx) => {
            const stopWords = ['of', 'and', 'the', 'in', 'on', 'with', 'a', 'an', 'to', 'for'];
            if (idx > 0 && stopWords.includes(word)) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        result = text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^./, c => c.toLowerCase());
        break;
      case 'snake':
        result = text
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '');
        break;
      case 'kebab':
        result = text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '');
        break;
      case 'constant':
        result = text
          .toUpperCase()
          .replace(/\s+/g, '_')
          .replace(/[^A-Z0-9_]/g, '');
        break;
    }
    setText(result);
    showToast(`Converted to ${type} case!`);
  };

  // ==================== 3. DUPLICATE LINES REMOVER ====================
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [sortAlphabetical, setSortAlphabetical] = useState(false);

  const duplicateStats = useMemo(() => {
    const rawLines = text.split('\n');
    const processed = rawLines.map(l => (trimLines ? l.trim() : l));
    const seen = new Set<string>();
    const unique: string[] = [];

    processed.forEach(line => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    });

    if (sortAlphabetical) {
      unique.sort((a, b) => a.localeCompare(b));
    }

    return {
      originalCount: rawLines.length,
      uniqueCount: unique.length,
      removedCount: rawLines.length - unique.length,
      uniqueResult: unique.join('\n'),
    };
  }, [text, caseSensitive, trimLines, sortAlphabetical]);

  // ==================== 4. TEXT CLEANER ====================
  const cleanText = (mode: 'spaces' | 'blankLines' | 'trimAll' | 'all') => {
    let res = text;
    if (mode === 'spaces' || mode === 'all') {
      res = res.replace(/[ \t]+/g, ' ');
    }
    if (mode === 'blankLines' || mode === 'all') {
      res = res.replace(/^\s*[\r\n]/gm, '');
    }
    if (mode === 'trimAll' || mode === 'all') {
      res = res
        .split('\n')
        .map(l => l.trim())
        .join('\n')
        .trim();
    }
    setText(res);
    showToast('Text cleaned successfully!');
  };

  // ==================== 5. LOREM IPSUM ====================
  const [loremCount, setLoremCount] = useState(3);
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithClassic, setStartWithClassic] = useState(true);

  const generateLorem = () => {
    const classicStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const sentences = [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    ];

    let result = '';
    if (loremType === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < loremCount; i++) {
        let p = '';
        if (i === 0 && startWithClassic) {
          p = classicStart + ' ' + sentences.slice(0, 3).join(' ');
        } else {
          p = sentences.slice(i % sentences.length, (i % sentences.length) + 4).join(' ');
        }
        paras.push(p);
      }
      result = paras.join('\n\n');
    } else if (loremType === 'sentences') {
      const sArr: string[] = [];
      for (let i = 0; i < loremCount; i++) {
        sArr.push(sentences[i % sentences.length]);
      }
      result = (startWithClassic ? classicStart + ' ' : '') + sArr.join(' ');
    } else {
      const words = (classicStart + ' ' + sentences.join(' ')).replace(/[^a-zA-Z\s]/g, '').split(/\s+/);
      const chosen: string[] = [];
      for (let i = 0; i < loremCount; i++) {
        chosen.push(words[i % words.length]);
      }
      result = chosen.join(' ');
    }
    setText(result);
    showToast(`Generated ${loremCount} ${loremType}!`);
  };

  // ==================== 6. MARKDOWN CONVERTER ====================
  const renderedHtml = useMemo(() => {
    if (toolSlug !== 'markdown-converter') return '';
    let parsed = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2 text-slate-900 dark:text-white">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3 text-slate-900 dark:text-white">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold my-4 text-slate-900 dark:text-white">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' class='max-w-full rounded-lg my-2' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' class='text-blue-600 underline'>$1</a>")
      .replace(/`([^`]+)`/gim, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono text-rose-500">$1</code>')
      .replace(/\n\n/gim, '</p><p class="my-2 leading-relaxed">')
      .replace(/\n/gim, '<br />');

    return `<p class="leading-relaxed">${parsed}</p>`;
  }, [text, toolSlug]);

  return (
    <div id="text-tool-container" className="space-y-6">
      {/* Specific tool headers/controls */}
      {toolSlug === 'case-converter' && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <button onClick={() => convertCase('upper')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">UPPERCASE</button>
          <button onClick={() => convertCase('lower')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">lowercase</button>
          <button onClick={() => convertCase('title')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">Title Case</button>
          <button onClick={() => convertCase('sentence')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">Sentence case</button>
          <button onClick={() => convertCase('camel')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">camelCase</button>
          <button onClick={() => convertCase('snake')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">snake_case</button>
          <button onClick={() => convertCase('kebab')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">kebab-case</button>
          <button onClick={() => convertCase('constant')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs">CONSTANT_CASE</button>
        </div>
      )}

      {toolSlug === 'remove-duplicate-lines' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
              <span>Case Sensitive</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={trimLines} onChange={e => setTrimLines(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
              <span>Trim Whitespace</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={sortAlphabetical} onChange={e => setSortAlphabetical(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
              <span>Sort Alphabetically</span>
            </label>
          </div>
          <button
            onClick={() => {
              setText(duplicateStats.uniqueResult);
              showToast(`Removed ${duplicateStats.removedCount} duplicate lines!`);
            }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
          >
            Apply & Remove Duplicates ({duplicateStats.removedCount} duplicates)
          </button>
        </div>
      )}

      {toolSlug === 'text-cleaner' && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <button onClick={() => cleanText('all')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm">
            Clean All Formatting
          </button>
          <button onClick={() => cleanText('spaces')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition">
            Remove Extra Spaces
          </button>
          <button onClick={() => cleanText('blankLines')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition">
            Strip Empty Lines
          </button>
          <button onClick={() => cleanText('trimAll')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition">
            Trim Each Line
          </button>
        </div>
      )}

      {toolSlug === 'lorem-ipsum-generator' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="50"
              value={loremCount}
              onChange={e => setLoremCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-center"
            />
            <select
              value={loremType}
              onChange={e => setLoremType(e.target.value as any)}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer ml-2">
              <input type="checkbox" checked={startWithClassic} onChange={e => setStartWithClassic(e.target.checked)} className="rounded text-blue-600" />
              <span>Start with &quot;Lorem ipsum...&quot;</span>
            </label>
          </div>
          <button
            onClick={generateLorem}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Lorem Ipsum</span>
          </button>
        </div>
      )}

      {/* Main Text Input Editor Area */}
      <div className="relative">
        <textarea
          id="main-text-input-field"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
          placeholder="Paste or write your text here..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans text-sm sm:text-base leading-relaxed resize-y shadow-xs"
        />

        {/* Action button bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-text"
              onClick={() => handleCopy()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              id="btn-download-text"
              onClick={() => handleDownload()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
          </div>

          <button
            id="btn-clear-text"
            onClick={() => {
              setText('');
              showToast('Editor cleared', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Markdown Live Preview */}
      {toolSlug === 'markdown-converter' && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Rendered HTML Preview</h3>
            <button
              onClick={() => handleCopy(renderedHtml)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy HTML Code
            </button>
          </div>
          <div
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none shadow-xs"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      )}

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5 pt-2">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Words</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{wordStats.wordCount}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Characters</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{wordStats.charCount}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">No Spaces</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{wordStats.charNoSpaces}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sentences</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{wordStats.sentences}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paragraphs</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{wordStats.paragraphs}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">File Size</span>
          <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            <FileSize bytes={wordStats.byteSize} />
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reading Time</span>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {wordStats.readingTimeSec < 60 ? `${wordStats.readingTimeSec}s` : `${Math.ceil(wordStats.readingTimeSec / 60)}m`}
          </p>
        </div>
      </div>

      {/* Dedicated Panel: Character Counter Platform Limits */}
      {toolSlug === 'character-counter' && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Social Media & SEO Character Limits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {[
              { name: 'X / Twitter Post', max: 280 },
              { name: 'SMS Text Message', max: 160 },
              { name: 'Google Title Tag', max: 60 },
              { name: 'Meta Description', max: 160 },
              { name: 'LinkedIn Post', max: 3000 },
              { name: 'Instagram Caption', max: 2200 },
            ].map(platform => {
              const current = wordStats.charCount;
              const percent = Math.min(100, Math.round((current / platform.max) * 100));
              const isOver = current > platform.max;
              return (
                <div key={platform.name} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{platform.name}</span>
                    <span className={isOver ? 'text-rose-500 font-bold' : 'text-slate-500'}>
                      {current} / {platform.max}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-blue-600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dedicated Panel: Word Counter Keyword Density */}
      {toolSlug === 'word-counter' && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Keyword Density</h3>
            <span className="text-xs text-slate-400">Speaking time: ~{Math.ceil(wordStats.speakingTimeSec / 60)} min</span>
          </div>
          {wordStats.topKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {wordStats.topKeywords.map(([word, count]) => {
                const density = wordStats.wordCount > 0 ? ((count / wordStats.wordCount) * 100).toFixed(1) : '0';
                return (
                  <div key={word} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{word}</span>
                    <span className="text-slate-400">×{count}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">({density}%)</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Type more words to see top keyword density analysis...</p>
          )}
        </div>
      )}
    </div>
  );
};
