import React from 'react';
import { ToolDefinition } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { IconRenderer } from '../common/IconRenderer';
import { FAQSection } from '../common/FAQSection';
import { RelatedTools } from '../common/RelatedTools';
import { AdSlot } from '../common/AdSlot';
import { useApp } from '../../context/AppContext';
import { Star, Share2, ShieldCheck, Check, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

// Import our tool runners
import { TextTools } from '../tools/TextTools';
import { PdfTools } from '../tools/PdfTools';
import { ImageTools } from '../tools/ImageTools';
import { DevTools } from '../tools/DevTools';
import { CalculatorTools } from '../tools/CalculatorTools';
import { BangladeshTools } from '../tools/BangladeshTools';
import { UtilityTools } from '../tools/UtilityTools';
import { AiTools } from '../tools/AiTools';

interface ToolLayoutProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, onNavigate }) => {
  const { isFavorite, toggleFavorite, showToast, trackEvent } = useApp();
  const favored = isFavorite(tool.slug);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tool link copied to clipboard!');
      trackEvent('share_tool', 'Social', tool.slug);
    }
  };

  // Render the appropriate interactive tool based on category or slug
  const renderToolComponent = () => {
    switch (tool.category) {
      case 'text-tools':
        return <TextTools toolSlug={tool.slug} />;
      case 'pdf-tools':
        return <PdfTools toolSlug={tool.slug} />;
      case 'image-tools':
        return <ImageTools toolSlug={tool.slug} />;
      case 'developer-tools':
        return <DevTools toolSlug={tool.slug} />;
      case 'calculators':
      case 'converters':
      case 'date-time-tools':
        return <CalculatorTools toolSlug={tool.slug} />;
      case 'bangladesh-tools':
        return <BangladeshTools toolSlug={tool.slug} />;
      case 'qr-tools':
      case 'privacy-tools':
        return <UtilityTools toolSlug={tool.slug} />;
      case 'ai-tools':
        return <AiTools toolSlug={tool.slug} />;
      default:
        // Match specific specialized slugs if in other categories
        if (tool.slug === 'ai-summarizer') {
          return <AiTools toolSlug={tool.slug} />;
        }
        if (['qr-code-generator', 'password-generator', 'stopwatch'].includes(tool.slug)) {
          return <UtilityTools toolSlug={tool.slug} />;
        }
        if (['base64-encoder', 'url-encoder', 'uuid-generator', 'hash-generator', 'unix-timestamp-converter', 'jwt-decoder', 'regex-tester', 'json-formatter', 'json-validator'].includes(tool.slug)) {
          return <DevTools toolSlug={tool.slug} />;
        }
        if (['unit-converter', 'timezone-converter', 'percentage-calculator', 'age-calculator', 'gpa-calculator', 'discount-calculator', 'date-difference-calculator', 'loan-emi-calculator'].includes(tool.slug)) {
          return <CalculatorTools toolSlug={tool.slug} />;
        }
        if (['bangla-english-typing', 'bangladesh-land-converter', 'bangladesh-age-calculator', 'passport-photo-resizer'].includes(tool.slug)) {
          return <BangladeshTools toolSlug={tool.slug} />;
        }
        return <TextTools toolSlug={tool.slug} />;
    }
  };

  return (
    <div id={`tool-page-${tool.slug}`} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs categorySlug={tool.category} toolName={tool.name} onNavigate={onNavigate} />

      {/* Tool Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
            <IconRenderer name={tool.iconName} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {tool.name}
              </h1>
              {tool.badge && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            id="btn-toggle-favorite"
            onClick={() => {
              toggleFavorite(tool.slug);
              showToast(favored ? 'Removed from favorites' : 'Added to favorites!');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${
              favored
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Save to Favorites"
          >
            <Star className={`w-4 h-4 ${favored ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{favored ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            id="btn-share-tool"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition"
            title="Share this tool"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Tool Container */}
      <main id="tool-interactive-area" className="relative">
        {renderToolComponent()}
      </main>

      {/* Non-intrusive Ad slot */}
      <AdSlot placement="tool-bottom" />

      {/* Educational Guide: How to Use */}
      <section id="how-to-use-section" className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
          How to Use {tool.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs flex items-center justify-center mb-3">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Input or Upload
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste your text, select options, or drag & drop files directly into the interactive workspace.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs flex items-center justify-center mb-3">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Process Instantly
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculations, compression, and conversions happen immediately with real-time feedback in your browser.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs flex items-center justify-center mb-3">
              3
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Copy or Download
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              One-click copy to clipboard or download processed files straight to your device without watermark or sign-up.
            </p>
          </div>
        </div>
      </section>

      {/* Features & Key Benefits */}
      <section id="features-section" className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
          Key Features & Privacy Guarantee
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Zero server upload — 100% private in-browser computation</span>
          </div>
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>No account registration or email subscription required</span>
          </div>
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Unlimited usage with zero hidden paywalls or rate limits</span>
          </div>
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Fully responsive and optimized for mobile, tablet, and desktop</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={tool.faqs || []} toolName={tool.name} />

      {/* Related Tools Recommendations */}
      <RelatedTools
        toolSlugs={tool.relatedToolSlugs || []}
        category={tool.category}
        currentSlug={tool.slug}
        onNavigate={onNavigate}
      />
    </div>
  );
};
