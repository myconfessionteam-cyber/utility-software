import { useState, useEffect, useCallback } from 'react';
import { getToolBySlug, TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';

export interface RouteInfo {
  path: string;
  view: 'home' | 'category' | 'tool' | 'all-tools' | 'favorites' | 'info';
  categorySlug?: string;
  toolSlug?: string;
  infoPage?: 'about' | 'privacy' | 'terms' | 'faq' | 'sitemap';
}

function parsePath(pathname: string): RouteInfo {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/' || clean === '') {
    return { path: '/', view: 'home' };
  }

  if (clean === '/all-tools') {
    return { path: '/all-tools', view: 'all-tools' };
  }

  if (clean === '/favorites') {
    return { path: '/favorites', view: 'favorites' };
  }

  if (['/about', '/privacy', '/terms', '/faq', '/sitemap'].includes(clean)) {
    const page = clean.substring(1) as 'about' | 'privacy' | 'terms' | 'faq' | 'sitemap';
    return { path: clean, view: 'info', infoPage: page };
  }

  const parts = clean.split('/').filter(Boolean);

  // Check if first part matches a category
  if (parts.length === 1) {
    const categoryExists = CATEGORIES.some(c => c.slug === parts[0]);
    if (categoryExists) {
      return { path: clean, view: 'category', categorySlug: parts[0] };
    }

    // Direct tool slug alias: e.g. /word-counter
    const directTool = getToolBySlug(parts[0]);
    if (directTool) {
      return { path: `/${directTool.category}/${directTool.slug}`, view: 'tool', categorySlug: directTool.category, toolSlug: directTool.slug };
    }
  }

  if (parts.length >= 2) {
    const categorySlug = parts[0];
    const toolSlug = parts[1];
    const tool = getToolBySlug(toolSlug);
    if (tool) {
      return { path: clean, view: 'tool', categorySlug, toolSlug };
    }
    // If tool not found, might be category with subfilter
    const cat = CATEGORIES.find(c => c.slug === categorySlug);
    if (cat) {
      return { path: clean, view: 'category', categorySlug };
    }
  }

  // Fallback to home
  return { path: '/', view: 'home' };
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const [route, setRoute] = useState<RouteInfo>(() => parsePath(currentPath));

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setRoute(parsePath(path));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    if (typeof window === 'undefined') return;

    if (replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }

    setCurrentPath(to);
    const parsed = parsePath(to);
    setRoute(parsed);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // SEO updates
    updateSEO(parsed);
  }, []);

  // Update SEO meta tags based on current view
  useEffect(() => {
    updateSEO(route);
  }, [route]);

  return { route, navigate, currentPath };
}

function updateSEO(route: RouteInfo) {
  if (typeof document === 'undefined') return;

  let title = 'ToolNova — Free Online Tools. Fast, Private & No Sign-up';
  let description = 'Free online tools for PDF, images, text, developer tasks, math calculators, and Bangladesh utilities. 100% private, client-side, with zero sign-up required.';

  if (route.view === 'tool' && route.toolSlug) {
    const tool = getToolBySlug(route.toolSlug);
    if (tool) {
      title = `${tool.seoTitle} | ToolNova`;
      description = tool.seoDescription;
    }
  } else if (route.view === 'category' && route.categorySlug) {
    const category = CATEGORIES.find(c => c.slug === route.categorySlug);
    if (category) {
      title = `${category.name} — Free Online Utilities | ToolNova`;
      description = category.longDescription;
    }
  } else if (route.view === 'all-tools') {
    title = 'All Online Tools Directory | ToolNova';
    description = 'Browse all free online tools across PDF, Image, Developer, Text, Calculators, and Bangladesh utilities.';
  } else if (route.view === 'favorites') {
    title = 'My Favorite Tools | ToolNova';
    description = 'Quick access to your pinned and favorite online tools on ToolNova.';
  }

  document.title = title;

  // Update meta tags
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);
}
