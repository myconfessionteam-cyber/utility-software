import React from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { TOOLS } from '../../data/tools';
import { CATEGORIES } from '../../data/categories';
import { ShieldCheck, Download, ExternalLink, Code } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StaticPageProps {
  pageType: 'privacy' | 'terms' | 'sitemap';
  onNavigate: (path: string) => void;
}

export const StaticPages: React.FC<StaticPageProps> = ({ pageType, onNavigate }) => {
  const { showToast } = useApp();

  // Generate XML sitemap string
  const generateSitemapXml = () => {
    const baseUrl = 'https://toolnova.dev';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Root
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Categories
    CATEGORIES.forEach(c => {
      xml += `  <url>\n    <loc>${baseUrl}/${c.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Tools
    TOOLS.forEach(t => {
      xml += `  <url>\n    <loc>${baseUrl}/${t.category}/${t.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  const handleDownloadXml = () => {
    const xml = generateSitemapXml();
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded sitemap.xml!');
  };

  if (pageType === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Breadcrumbs toolName="Privacy Policy" onNavigate={onNavigate} />
        <div className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">Privacy Policy</h1>
              <p className="text-xs text-neutral-400">Last updated: September 2026</p>
            </div>
          </div>

          <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-4 leading-relaxed">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">1. Our Core Privacy Philosophy</h2>
            <p>
              At ToolNova, your privacy is not an afterthought; it is the fundamental design principle of our software architecture. Unlike legacy online utility converters that require uploading your private documents, financial calculations, images, or code to external servers, ToolNova performs computational tasks <strong>locally inside your browser</strong>.
            </p>

            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">2. Data Handling & Zero Server Storage</h2>
            <p>
              When you use our PDF tools, Image resizers, JSON validators, or text cleaners:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your uploaded files are loaded into browser RAM via WebAssembly and Canvas APIs.</li>
              <li>No document content or personally identifiable information is transmitted to our servers or saved to remote databases.</li>
              <li>Closing the browser tab completely clears the temporary memory buffers.</li>
            </ul>

            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">3. Local Storage Preferences</h2>
            <p>
              ToolNova utilizes standard client-side browser <code>localStorage</code> purely to remember your theme preference (dark/light mode), favorite tools, and recent tool history. You can clear this at any time in your browser settings.
            </p>

            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">4. Third-Party Advertisements & Analytics</h2>
            <p>
              We believe in non-invasive, privacy-friendly operation. We do not use cross-site tracking cookies. Any future advertising integration strictly complies with ethical ad guidelines without fingerprinting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pageType === 'terms') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Breadcrumbs toolName="Terms of Service" onNavigate={onNavigate} />
        <div className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">Terms of Service</h1>
          <div className="text-sm text-neutral-700 dark:text-neutral-300 space-y-4 leading-relaxed">
            <p>
              Welcome to ToolNova. By accessing or using our free web utilities, you agree to be bound by these Terms of Service.
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">1. Free & Unrestricted Use</h2>
            <p>
              All utilities on ToolNova are provided free of charge for personal, educational, and commercial purposes. You are free to process as many files and documents as needed.
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">2. Disclaimer of Warranties</h2>
            <p>
              The tools and calculation algorithms (including GPA, Loan EMI, and tax calculators) are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. While we strive for absolute mathematical precision, users are encouraged to verify important legal, tax, or financial filings with certified advisors.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // XML Sitemap Page
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Breadcrumbs toolName="XML Sitemap" onNavigate={onNavigate} />
      <div className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">XML Sitemap & Index</h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Complete directory of all {TOOLS.length + CATEGORIES.length + 1} indexed canonical URLs for search engines.
            </p>
          </div>
          <button
            onClick={handleDownloadXml}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs self-start"
          >
            <Download className="w-4 h-4" />
            <span>Download sitemap.xml</span>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-3">Category Pages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => onNavigate(`/${c.slug}`)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 text-left text-neutral-700 dark:text-neutral-300"
                >
                  <span>/{c.slug}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-3">Tool Pages ({TOOLS.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono max-h-96 overflow-y-auto pr-1">
              {TOOLS.map(t => (
                <button
                  key={t.id}
                  onClick={() => onNavigate(`/${t.category}/${t.slug}`)}
                  className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 text-left text-neutral-700 dark:text-neutral-300 truncate"
                >
                  <span className="truncate">/{t.category}/{t.slug}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
