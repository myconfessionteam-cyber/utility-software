import React from 'react';
import { useApp } from '../../context/AppContext';
import { getToolBySlug } from '../../data/tools';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { IconRenderer } from '../common/IconRenderer';
import { Star, ArrowRight, Trash2 } from 'lucide-react';

interface FavoritesViewProps {
  onNavigate: (path: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onNavigate }) => {
  const { favorites, toggleFavorite, showToast } = useApp();

  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const favoriteTools = safeFavorites.map(slug => getToolBySlug(slug)).filter(Boolean);

  return (
    <div id="favorites-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs toolName="Favorite Tools" onNavigate={onNavigate} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            <span>My Favorite Tools ({favoriteTools.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pinned tools saved locally in your browser for immediate access.
          </p>
        </div>
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteTools.map(tool => {
            if (!tool) return null;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/${tool.category}/${tool.slug}`)}
                className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconRenderer name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(tool.slug);
                        showToast('Removed from favorites');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
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
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Star className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">No favorite tools saved yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Click the star icon on any tool card or tool page to pin your most frequently used utilities here.
          </p>
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
          >
            Explore Tools Directory
          </button>
        </div>
      )}
    </div>
  );
};
