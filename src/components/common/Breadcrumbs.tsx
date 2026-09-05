import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types';

interface BreadcrumbsProps {
  categorySlug?: string;
  toolName?: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categorySlug, toolName, onNavigate }) => {
  const category = CATEGORIES.find(c => c.slug === categorySlug || c.id === (categorySlug as CategoryId));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto py-1">
      <button
        id="breadcrumb-home"
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition py-0.5 shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {category && (
        <>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <button
            id={`breadcrumb-cat-${category.slug}`}
            onClick={() => onNavigate(`/${category.slug}`)}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition py-0.5 shrink-0 ${
              !toolName ? 'font-semibold text-slate-900 dark:text-white' : ''
            }`}
          >
            {category.name}
          </button>
        </>
      )}

      {toolName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-white shrink-0 truncate max-w-[200px] sm:max-w-none">
            {toolName}
          </span>
        </>
      )}
    </nav>
  );
};
