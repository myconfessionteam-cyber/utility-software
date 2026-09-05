import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ToastMessage } from '../types';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  recentTools: string[];
  addRecentTool: (slug: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  trackEvent: (action: string, category?: string, label?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toolnova_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('toolnova_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('toolnova_favorites');
        const parsed = saved ? JSON.parse(saved) : null;
        return Array.isArray(parsed) ? parsed : ['word-counter', 'pdf-merge', 'image-compressor', 'json-formatter'];
      } catch {
        return ['word-counter', 'pdf-merge', 'image-compressor', 'json-formatter'];
      }
    }
    return ['word-counter', 'pdf-merge', 'image-compressor', 'json-formatter'];
  });

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites(prev => {
      const safe = Array.isArray(prev) ? prev : [];
      const next = safe.includes(slug) ? safe.filter(s => s !== slug) : [...safe, slug];
      try {
        localStorage.setItem('toolnova_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((slug: string) => (Array.isArray(favorites) ? favorites.includes(slug) : false), [favorites]);

  // Recently Used
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('toolnova_recent');
        const parsed = saved ? JSON.parse(saved) : null;
        return Array.isArray(parsed) ? parsed : ['word-counter', 'json-formatter', 'percentage-calculator'];
      } catch {
        return ['word-counter', 'json-formatter', 'percentage-calculator'];
      }
    }
    return ['word-counter', 'json-formatter', 'percentage-calculator'];
  });

  const addRecentTool = useCallback((slug: string) => {
    setRecentTools(prev => {
      const safe = Array.isArray(prev) ? prev : [];
      const filtered = safe.filter(s => s !== slug);
      const next = [slug, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('toolnova_recent', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Search Dialog
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Anonymous Privacy-Friendly Analytics Hook
  const trackEvent = useCallback((action: string, category: string = 'General', label?: string) => {
    // Dispatched via console/custom event, zero personally identifiable telemetry
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Event] Action: ${action} | Category: ${category} | Label: ${label || ''}`);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        isFavorite,
        recentTools,
        addRecentTool,
        searchOpen,
        setSearchOpen,
        toasts,
        showToast,
        removeToast,
        trackEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
