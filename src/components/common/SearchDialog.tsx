import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOOLS, getToolBySlug } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { IconRenderer } from './IconRenderer';

interface SearchDialogProps {
  onNavigate: (path: string) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ onNavigate }) => {
  const { searchOpen, setSearchOpen, recentTools, trackEvent } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [searchOpen]);

  // Filter tools based on query
  const filteredTools = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return TOOLS.filter(tool => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.shortDescription.toLowerCase().includes(q);
      const matchCat = tool.category.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some(k => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchCat || matchKeywords;
    }).slice(0, 10);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredTools.length > 0 ? (prev - 1 + filteredTools.length) % filteredTools.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools.length > 0 && filteredTools[selectedIndex]) {
          const selected = filteredTools[selectedIndex];
          trackEvent('search_select', 'Search', selected.slug);
          onNavigate(`/${selected.category}/${selected.slug}`);
          setSearchOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, filteredTools, selectedIndex, onNavigate, setSearchOpen, trackEvent]);

  if (!searchOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setSearchOpen(false)}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            id="search-input-field"
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tools (e.g., pdf, word counter, json, age, image)..."
            className="w-full bg-transparent text-base sm:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Search Results / Default suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-3">
              {/* Recently Used Tools */}
              {Array.isArray(recentTools) && recentTools.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider px-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Recently Used</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(recentTools || []).slice(0, 4).map(slug => {
                      const tool = getToolBySlug(slug);
                      if (!tool) return null;
                      return (
                        <div
                          key={tool.id}
                          onClick={() => {
                            onNavigate(`/${tool.category}/${tool.slug}`);
                            setSearchOpen(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition text-left"
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <IconRenderer name={tool.iconName} className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                            {tool.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular Tools */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider px-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Popular Tools</span>
                </div>
                <div className="space-y-1">
                  {TOOLS.filter(t => t.popular).slice(0, 6).map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        onNavigate(`/${tool.category}/${tool.slug}`);
                        setSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 group cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          <IconRenderer name={tool.iconName} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {tool.shortDescription}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 ml-2">
                        {tool.category.replace('-tools', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="space-y-1">
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                const cat = CATEGORIES.find(c => c.slug === tool.category);
                return (
                  <div
                    key={tool.id}
                    id={`search-result-item-${idx}`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => {
                      trackEvent('search_select', 'Search', tool.slug);
                      onNavigate(`/${tool.category}/${tool.slug}`);
                      setSearchOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <IconRenderer name={tool.iconName} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate flex items-center gap-2">
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-normal bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {tool.shortDescription}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[11px] text-slate-400 capitalize hidden sm:inline">
                        {cat?.name || tool.category}
                      </span>
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-medium">No tools found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &ldquo;pdf&rdquo;, &ldquo;image&rdquo;, &ldquo;counter&rdquo;, or &ldquo;converter&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded mr-1">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded mr-1">↵</kbd>
              Open Tool
            </span>
          </div>
          <span>ToolNova Search</span>
        </div>
      </div>
    </div>
  );
};
