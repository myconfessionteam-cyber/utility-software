import React, { useState } from 'react';
import { Search, Moon, Sun, Star, Menu, X, ChevronDown, Wrench, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { IconRenderer } from '../common/IconRenderer';

interface HeaderProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPath }) => {
  const { theme, toggleTheme, setSearchOpen, favorites } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="ToolNova Home"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center">
                Tool<span className="text-blue-600 dark:text-blue-400">Nova</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 -mt-1">
                Free Online Utilities
              </span>
            </div>
          </button>

          {/* Desktop Categories Dropdown */}
          <div className="relative hidden md:block">
            <button
              id="categories-dropdown-btn"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-expanded={categoriesOpen}
            >
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${categoriesOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {categoriesOpen && (
              <div
                id="categories-dropdown-menu"
                className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 grid grid-cols-1 gap-1 max-h-[75vh] overflow-y-auto"
              >
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Tool Categories
                </div>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    id={`menu-cat-${cat.slug}`}
                    onClick={() => {
                      onNavigate(`/${cat.slug}`);
                      setCategoriesOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition group"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-slate-600 dark:text-slate-300">
                      <IconRenderer name={cat.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {cat.shortDescription}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            id="nav-all-tools-btn"
            onClick={() => onNavigate('/all-tools')}
            className={`hidden md:flex items-center h-16 text-sm font-medium transition ${
              currentPath === '/all-tools'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            All Tools
          </button>
        </div>

        {/* Center/Right: Quick Search Bar trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            id="global-search-trigger-btn"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 border-none rounded-full text-sm text-slate-400 transition-all outline-none"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search tools... (Ctrl + K)</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-500 shadow-xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile search icon */}
          <button
            id="mobile-search-btn"
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Privacy Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-300">100% Client-Side</span>
          </div>

          {/* Favorites Link */}
          <button
            id="nav-favorites-btn"
            onClick={() => onNavigate('/favorites')}
            className={`relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition ${
              currentPath === '/favorites' ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : ''
            }`}
            title="My Favorites"
            aria-label="Favorite tools"
          >
            <Star className={`w-5 h-5 ${favorites.length > 0 ? 'text-amber-500 fill-amber-400' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Mobile hamburger menu */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Navigation</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-left text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('/all-tools');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-left text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              All Tools Directory
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onNavigate(`/${cat.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <IconRenderer name={cat.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
