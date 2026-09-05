import React, { useState, useMemo } from 'react';
import { TOOLS } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { IconRenderer } from '../common/IconRenderer';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Search, Star, ArrowRight, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AllToolsViewProps {
  onNavigate: (path: string) => void;
}

export const AllToolsView: React.FC<AllToolsViewProps> = ({ onNavigate }) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchCat = selectedCat === 'all' || tool.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [selectedCat, searchQuery]);

  return (
    <div id="all-tools-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs toolName="All Tools Directory" onNavigate={onNavigate} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          All Online Utilities Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
          Browse through our comprehensive directory of {TOOLS.length} free web tools, converters, calculators, and developer utilities.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter by name, description, or keyword..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCat === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
            }`}
          >
            All Categories ({TOOLS.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCat === cat.slug
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Showing {filteredTools.length} Utilities
          </span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map(tool => {
              const favored = isFavorite(tool.slug);
              return (
                <div
                  key={tool.id}
                  onClick={() => onNavigate(`/${tool.category}/${tool.slug}`)}
                  className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <IconRenderer name={tool.iconName} className="w-5 h-5" />
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavorite(tool.slug);
                          showToast(favored ? 'Removed from favorites' : 'Saved to favorites');
                        }}
                        className="p-1 text-slate-400 hover:text-amber-500 transition"
                      >
                        <Star className={`w-4 h-4 ${favored ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{tool.category.replace('-tools', '')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <p className="text-sm font-medium">No tools found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
