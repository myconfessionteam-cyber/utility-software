/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useRouter } from './hooks/useRouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchDialog } from './components/common/SearchDialog';
import { ToastContainer } from './components/common/Toast';
import { HomeView } from './components/views/HomeView';
import { CategoryView } from './components/views/CategoryView';
import { ToolLayout } from './components/layout/ToolLayout';
import { AllToolsView } from './components/views/AllToolsView';
import { FavoritesView } from './components/views/FavoritesView';
import { StaticPages } from './components/views/StaticPages';
import { getCategoryBySlug } from './data/categories';
import { getToolBySlug } from './data/tools';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const { route, navigate } = useRouter();
  const { setSearchOpen, trackEvent } = useApp();

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open search dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        trackEvent('keyboard_shortcut', 'Search', 'ctrl_k');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen, trackEvent]);

  // Render view based on route
  const renderView = () => {
    switch (route.view) {
      case 'home':
        return <HomeView onNavigate={navigate} />;

      case 'category': {
        const category = route.categorySlug ? getCategoryBySlug(route.categorySlug) : undefined;
        if (category) {
          return <CategoryView category={category} onNavigate={navigate} />;
        }
        break;
      }

      case 'tool': {
        const tool = route.toolSlug ? getToolBySlug(route.toolSlug) : undefined;
        if (tool) {
          return <ToolLayout tool={tool} onNavigate={navigate} />;
        }
        break;
      }

      case 'all-tools':
        return <AllToolsView onNavigate={navigate} />;

      case 'favorites':
        return <FavoritesView onNavigate={navigate} />;

      case 'info':
        if (route.infoPage === 'privacy' || route.infoPage === 'terms' || route.infoPage === 'sitemap') {
          return <StaticPages pageType={route.infoPage} onNavigate={navigate} />;
        }
        return <StaticPages pageType="privacy" onNavigate={navigate} />;

      default:
        break;
    }

    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
          <Wrench className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            404 Not Found
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Tool or Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            The requested URL does not match any known utility tool or directory. It may have been renamed or relocated.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => navigate('/all-tools')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <span>Browse All Tools</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top sticky navigation header */}
      <Header onNavigate={navigate} currentPath={route.path} />

      {/* Main content body */}
      <div className="flex-1 w-full">
        {renderView()}
      </div>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Modals & Overlays */}
      <SearchDialog onNavigate={navigate} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
