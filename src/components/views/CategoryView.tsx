import React, { useState, useMemo } from 'react';
import { Category, ToolDefinition } from '../../types';
import { getToolsByCategory } from '../../data/tools';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { IconRenderer } from '../common/IconRenderer';
import { Search, Star, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CategoryViewProps {
  category: Category;
  onNavigate: (path: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onNavigate }) => {
  const { isFavorite, toggleFavorite, showToast } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const allTools = useMemo(() => getToolsByCategory(category.id), [category.id]);

  const filteredTools = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return allTools;
    return allTools.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [allTools, filterQuery]);

  return (
    <div id={`category-page-${category.slug}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumbs categorySlug={category.slug} onNavigate={onNavigate} />

      {/* Category Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 mb-10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 text-white shadow-sm flex items-center justify-center shrink-0">
              <IconRenderer name={category.iconName} className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {category.name}
                </h1>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {allTools.length} Free Utilities
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {category.longDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Input */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder={`Filter in ${category.name}...`}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            Available Online Tools ({filteredTools.length})
          </h2>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => {
              const favored = isFavorite(tool.slug);
              return (
                <div
                  key={tool.id}
                  id={`cat-tool-card-${tool.slug}`}
                  onClick={() => onNavigate(`/${tool.category}/${tool.slug}`)}
                  className="group relative cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <IconRenderer name={tool.iconName} className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {tool.badge}
                          </span>
                        )}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleFavorite(tool.slug);
                            showToast(favored ? 'Removed from favorites' : 'Saved to favorites');
                          }}
                          className="p-1.5 rounded-full text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Save favorite"
                        >
                          <Star className={`w-4 h-4 ${favored ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <p className="text-sm font-medium">No tools found matching &ldquo;{filterQuery}&rdquo;</p>
            <button
              onClick={() => setFilterQuery('')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2 hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
