export type CategoryId =
  | 'text-tools'
  | 'pdf-tools'
  | 'image-tools'
  | 'developer-tools'
  | 'calculators'
  | 'converters'
  | 'qr-tools'
  | 'bangladesh-tools'
  | 'privacy-tools'
  | 'ai-tools'
  | 'date-time-tools';

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  iconName: string;
  shortDescription: string;
  longDescription: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  shortDescription: string;
  iconName: string;
  keywords: string[];
  popular?: boolean;
  isNew?: boolean;
  badge?: string;
  seoTitle: string;
  seoDescription: string;
  howToUse: string[];
  features: string[];
  faqs: FAQItem[];
  relatedToolSlugs: string[];
  privacyNote?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}
