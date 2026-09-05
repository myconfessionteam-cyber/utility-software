import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getToolBySlug } from '../../data/tools';
import { IconRenderer } from './IconRenderer';

interface RelatedToolsProps {
  toolSlugs: string[];
  onNavigate: (path: string) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ toolSlugs, onNavigate }) => {
  const tools = toolSlugs.map(slug => getToolBySlug(slug)).filter(Boolean);

  if (tools.length === 0) return null;

  return (
    <section id="related-tools-section" className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Related Tools</h2>
        </div>
        <button
          id="btn-view-all-tools-related"
          onClick={() => onNavigate('/all-tools')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tools.map(tool => {
          if (!tool) return null;
          return (
            <div
              key={tool.id}
              id={`related-tool-card-${tool.slug}`}
              onClick={() => onNavigate(`/${tool.category}/${tool.slug}`)}
              className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IconRenderer name={tool.iconName} className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
