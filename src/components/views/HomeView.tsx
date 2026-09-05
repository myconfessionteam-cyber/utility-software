import React, { useState } from 'react';
import { Search, Sparkles, Shield, Zap, Lock, ArrowRight, Star, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { TOOLS, getToolsByCategory, getToolBySlug } from '../../data/tools';
import { IconRenderer } from '../common/IconRenderer';
import { useApp } from '../../context/AppContext';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { setSearchOpen, recentTools, isFavorite, toggleFavorite, showToast } = useApp();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  const popularTools = TOOLS.filter(t => t.popular).slice(0, 8);

  const displayedTools = selectedCategoryTab === 'all'
    ? TOOLS.slice(0, 12)
    : TOOLS.filter(t => t.category === selectedCategoryTab);

  return (
    <div id="home-view-page" className="space-y-16 py-6">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-14 text-center max-w-4xl mx-auto px-4">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 blur-3xl -z-10 rounded-full pointer-events-none" />

        {/* Professional Trust Pill Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 rounded-full font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            100% Secure
          </span>
          <span className="px-3 py-1 text-slate-500 dark:text-slate-400">Client-Side Processing</span>
          <span className="px-3 py-1 text-slate-500 dark:text-slate-400 hidden sm:inline">No Sign-up Required</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Free Online Tools — <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400">
            Fast, Private & Seamless
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          High-performance web utilities for writers, students, designers, and developers. Your files and confidential data stay safely in your browser.
        </p>

        {/* Global Search Bar Button */}
        <div className="mt-8 max-w-xl mx-auto">
          <button
            id="hero-search-trigger"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md text-left transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
              <span className="text-sm sm:text-base text-slate-400">Search tools... (Ctrl + K)</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-mono text-slate-500">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Quick Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            onClick={() => onNavigate('/pdf-tools')}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
          >
            📄 PDF Tools
          </button>
          <button
            onClick={() => onNavigate('/image-tools')}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
          >
            🖼️ Image Tools
          </button>
          <button
            onClick={() => onNavigate('/text-tools')}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
          >
            ✍️ Text Tools
          </button>
          <button
            onClick={() => onNavigate('/developer-tools')}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
          >
            💻 Developer Tools
          </button>
          <button
            onClick={() => onNavigate('/calculators')}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
          >
            🧮 Calculators
          </button>
          <button
            onClick={() => onNavigate('/bangladesh-tools')}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
          >
            🇧🇩 Bangladesh Hub
          </button>
        </div>
      </section>

      {/* 2. Recently Used (If present) */}
      {recentTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Recently Used Tools</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {recentTools.slice(0, 6).map(slug => {
              const tool = getToolBySlug(slug);
              if (!tool) return null;
              return (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(`/${tool.category}/${tool.slug}`)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 text-left transition shadow-xs"
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <IconRenderer name={tool.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {tool.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Popular & Trending Utilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
              Popular Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              The most loved everyday utilities used by thousands of users worldwide.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/all-tools')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All 40+ Tools <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map(tool => {
            const favored = isFavorite(tool.slug);
            return (
              <div
                key={tool.id}
                id={`popular-tool-${tool.slug}`}
                onClick={() => onNavigate(`/${tool.category}/${tool.slug}`)}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconRenderer name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(tool.slug);
                        showToast(favored ? 'Removed from favorites' : 'Saved to favorites');
                      }}
                      className="p-1 text-slate-400 hover:text-amber-500 transition"
                      title="Save favorite"
                    >
                      <Star className={`w-4 h-4 ${favored ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{tool.category.replace('-tools', '')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Category Bento Hub Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
            <span className="w-2 h-6 bg-slate-300 dark:bg-slate-700 rounded-full inline-block"></span>
            Categories Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Categorized directories designed for rapid workflows without clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(category => {
            const catTools = getToolsByCategory(category.id);
            return (
              <div
                key={category.id}
                id={`home-cat-card-${category.slug}`}
                onClick={() => onNavigate(`/${category.slug}`)}
                className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconRenderer name={category.iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {catTools.length} Tools
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {category.shortDescription}
                  </p>

                  {/* Sample Tool tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {catTools.slice(0, 3).map(t => (
                      <span
                        key={t.id}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] uppercase font-bold"
                      >
                        {t.name}
                      </span>
                    ))}
                    {catTools.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-semibold">
                        +{catTools.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Browse Hub</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Why Choose ToolNova Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Professionals & Students Choose ToolNova
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Built with craftsmanship, client-side privacy, and zero unnecessary friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                PDF merging, image compression, formatting, and mathematical equations execute directly inside your browser memory via WebAssembly and Canvas. Zero file uploads to third-party servers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Lightning Fast & Zero Sign-up
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No credit cards, no login screens, no email spam. Every utility is available immediately with one click, keyboard shortcuts (Ctrl+K), and responsive mobile support.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Transparent & Open Architecture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A clean registry pattern supporting easy tool expansion. Bookmark individual SEO-friendly URLs (`/text-tools/word-counter`) or add tools to your local favorites.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
