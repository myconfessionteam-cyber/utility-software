import React from 'react';
import { Wrench, Shield, Lock, Zap, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400">
      {/* Privacy & Trust Bar */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Private & Local</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Your files stay on your device and are processed directly in your browser. We never upload your confidential documents or photos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fast & Frictionless</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Zero sign-up, zero paywalls, zero artificial delays. Get your work done immediately and download results in one click.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Data Tracking</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                No tracking cookies or invasive analytics. All preferences and history remain securely in your local browser storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Tool<span className="text-blue-600 dark:text-blue-400">Nova</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The modern all-in-one super utility hub. High-performance, private, client-side online tools for students, developers, writers, and digital professionals.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/${cat.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Specialized Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(5, 10).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/${cat.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Resources & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/all-tools')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  All Tools Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/favorites')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Favorite Tools
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sitemap')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  XML Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ToolNova. Free Online Tools — Fast, Private & No Sign-up.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Built with craftsmanship & client-side security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
