import { ToolDefinition } from '../types';

export const TOOLS: ToolDefinition[] = [
  // ------------------- TEXT TOOLS -------------------
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text-tools',
    shortDescription: 'Count words, characters, sentences, paragraphs, and reading time in real-time.',
    iconName: 'Type',
    keywords: ['word count', 'character count', 'reading time', 'text statistics', 'sentence counter', 'letter counter'],
    popular: true,
    seoTitle: 'Free Online Word Counter — Words, Characters & Reading Time',
    seoDescription: 'Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time online for free. Fast, accurate, and 100% private.',
    howToUse: [
      'Type or paste your text into the main editor area.',
      'Statistics update automatically in real-time as you write.',
      'Use the Copy button to copy your text or Download to save as a .txt file.',
      'Click Clear to reset the counter and start over.'
    ],
    features: [
      'Real-time count of words, characters, characters without spaces',
      'Sentence and paragraph count breakdown',
      'Estimated reading and speaking time calculators',
      'Keyword density and word frequency inspection',
      'One-click copy and clean text actions'
    ],
    faqs: [
      {
        question: 'Does this word counter store my text?',
        answer: 'No. All calculations are executed locally inside your web browser. Your text is never transmitted to any external server.'
      },
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is computed based on the standard average human silent reading rate of 200 words per minute.'
      }
    ],
    relatedToolSlugs: ['character-counter', 'case-converter', 'remove-duplicate-lines', 'text-cleaner']
  },
  {
    id: 'character-counter',
    slug: 'character-counter',
    name: 'Character Counter',
    category: 'text-tools',
    shortDescription: 'Precise character counting with detailed breakdown of letters, numbers, and symbols.',
    iconName: 'AlignLeft',
    keywords: ['character counter', 'letter counter', 'spaces count', 'twitter character count', 'meta description counter'],
    seoTitle: 'Character Counter Online — Letters, Digits & Space Statistics',
    seoDescription: 'Count total characters, letters, spaces, digits, and punctuation marks instantly. Ideal for social media posts, SEO meta tags, and academic submissions.',
    howToUse: [
      'Paste your content into the character counter box.',
      'Review the categorized breakdown of letters, whitespace, digits, and special characters.',
      'Check if your text fits within popular limits like Twitter/X (280), Meta title (60), or SMS (160).'
    ],
    features: [
      'Total characters with and without whitespace',
      'Individual letter, digit, whitespace, and symbol counters',
      'Common platform limits tracker (X/Twitter, LinkedIn, SMS, Google Title)',
      '100% client-side privacy guarantee'
    ],
    faqs: [
      {
        question: 'Why count characters without spaces?',
        answer: 'Many academic institutions, translation services, and publications charge or enforce limits based strictly on non-whitespace characters.'
      }
    ],
    relatedToolSlugs: ['word-counter', 'case-converter', 'text-cleaner']
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'text-tools',
    shortDescription: 'Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase & slug.',
    iconName: 'CaseSensitive',
    keywords: ['uppercase', 'lowercase', 'title case', 'sentence case', 'camelcase', 'kebab-case', 'snake_case'],
    popular: true,
    seoTitle: 'Text Case Converter Online — Upper, Lower, Title & CamelCase',
    seoDescription: 'Convert any text into UPPERCASE, lowercase, Title Case, Sentence Case, camelCase, snake_case, and kebab-case instantly with a single click.',
    howToUse: [
      'Enter or paste text into the input box.',
      'Click the button corresponding to your target case format.',
      'The converted text appears immediately; click Copy to copy to clipboard.'
    ],
    features: [
      'UPPERCASE & lowercase transforms',
      'Title Case with smart lowercase for prepositions and articles',
      'Sentence Case capitalization after punctuation',
      'Programming formats: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE',
      'Instant copy and download options'
    ],
    faqs: [
      {
        question: 'Does Title Case follow standard grammatical style rules?',
        answer: 'Yes, minor words like "of", "and", "the", and "in" are automatically kept lowercase unless they start the sentence or title.'
      }
    ],
    relatedToolSlugs: ['word-counter', 'text-cleaner', 'remove-duplicate-lines']
  },
  {
    id: 'remove-duplicate-lines',
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    category: 'text-tools',
    shortDescription: 'De-duplicate text lists, sort lines alphabetically, and clean blank lines.',
    iconName: 'ListFilter',
    keywords: ['duplicate line remover', 'dedupe lines', 'sort lines', 'unique lines', 'remove repeated lines'],
    seoTitle: 'Remove Duplicate Lines Online — Deduplicate & Sort Text Lists',
    seoDescription: 'Clean lists by removing repeated and duplicate lines. Sort alphabetically, toggle case sensitivity, and eliminate empty rows in seconds.',
    howToUse: [
      'Paste your multi-line list or data.',
      'Choose options such as Case Sensitive, Trim Whitespace, or Alphabetical Sorting.',
      'Click Remove Duplicates and copy or download the refined list.'
    ],
    features: [
      'Case-sensitive and case-insensitive deduplication',
      'Optional whitespace trimming before comparison',
      'Sort output alphabetically (A-Z or Z-A)',
      'Counters displaying original line count vs. unique line count'
    ],
    faqs: [
      {
        question: 'Can I sort the unique lines as well?',
        answer: 'Yes! You can choose to preserve the original order of first appearance or sort alphabetically.'
      }
    ],
    relatedToolSlugs: ['text-cleaner', 'word-counter', 'case-converter']
  },
  {
    id: 'text-cleaner',
    slug: 'text-cleaner',
    name: 'Text Cleaner & Whitespace Remover',
    category: 'text-tools',
    shortDescription: 'Remove extra spaces, tabs, empty lines, and normalize whitespace.',
    iconName: 'Sparkles',
    keywords: ['clean text', 'remove extra spaces', 'strip blank lines', 'normalize text', 'whitespace cleaner'],
    seoTitle: 'Text Cleaner Online — Remove Extra Spaces & Blank Lines',
    seoDescription: 'Clean messy text by stripping multiple consecutive spaces, removing trailing whitespace, deleting empty lines, and normalizing formatting.',
    howToUse: [
      'Paste unformatted or copied text from PDFs or websites.',
      'Select desired cleaning actions (Remove Extra Spaces, Strip Blank Lines, Trim Lines).',
      'Click Clean Text to obtain pristine formatting.'
    ],
    features: [
      'Collapse multiple spaces into single space',
      'Remove blank or whitespace-only lines',
      'Strip leading and trailing line margins',
      'Normalize line endings (CRLF to LF)'
    ],
    faqs: [
      {
        question: 'Is this helpful for text copied from PDFs?',
        answer: 'Yes! PDF copy-paste often introduces artificial line wraps and double spacing which this tool effortlessly repairs.'
      }
    ],
    relatedToolSlugs: ['remove-duplicate-lines', 'word-counter', 'case-converter']
  },
  {
    id: 'lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'text-tools',
    shortDescription: 'Generate custom dummy placeholder text in paragraphs, sentences, or words.',
    iconName: 'FileCode',
    keywords: ['lorem ipsum', 'dummy text', 'placeholder text', 'filler text', 'mock text generator'],
    seoTitle: 'Lorem Ipsum Generator — Customizable Dummy Placeholder Text',
    seoDescription: 'Generate classic and customized Lorem Ipsum placeholder text for mockups, prototypes, and typography layouts with instant copy.',
    howToUse: [
      'Specify the number of paragraphs, sentences, or words you need.',
      'Toggle whether to start with the classic "Lorem ipsum dolor sit amet...".',
      'Click Generate and copy the dummy text directly to your clipboard.'
    ],
    features: [
      'Generate by paragraphs, sentences, or words count',
      'Customizable start with standard Lorem Ipsum intro',
      'Plain text and HTML paragraph wrap output modes',
      'Instant copy with one click'
    ],
    faqs: [
      {
        question: 'Where does Lorem Ipsum originate?',
        answer: 'It originates from sections of Cicero’s 45 BC treatise on ethics, "De Finibus Bonorum et Malorum".'
      }
    ],
    relatedToolSlugs: ['word-counter', 'character-counter', 'markdown-converter']
  },
  {
    id: 'markdown-converter',
    slug: 'markdown-converter',
    name: 'Markdown to HTML Converter',
    category: 'text-tools',
    shortDescription: 'Convert Markdown syntax to clean HTML and view a live rendered preview.',
    iconName: 'FileText',
    keywords: ['markdown to html', 'markdown preview', 'md to html', 'markdown parser', 'html generator'],
    seoTitle: 'Markdown to HTML Converter Online — Live Preview & Code Generator',
    seoDescription: 'Convert Markdown to clean HTML code with live split-screen preview. Supports tables, code blocks, blockquotes, lists, and headers.',
    howToUse: [
      'Write or paste Markdown content on the left pane.',
      'View the real-time rendered preview and inspect generated HTML code.',
      'Copy the raw HTML or formatted text with one click.'
    ],
    features: [
      'Real-time split view with rendered output and HTML code',
      'Supports headings, tables, code blocks, lists, links, and formatting',
      'Syntax highlighted HTML preview',
      'Quick template insertion for fast Markdown authoring'
    ],
    faqs: [
      {
        question: 'Does this support Github Flavored Markdown (GFM)?',
        answer: 'Yes, tables, strikethrough, and task checklists are fully supported.'
      }
    ],
    relatedToolSlugs: ['word-counter', 'text-cleaner', 'json-formatter']
  },

  // ------------------- PDF TOOLS -------------------
  {
    id: 'pdf-merge',
    slug: 'pdf-merge',
    name: 'PDF Merge',
    category: 'pdf-tools',
    shortDescription: 'Combine multiple PDF documents into a single organized file in your browser.',
    iconName: 'Files',
    keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf binder', 'merge pdfs free'],
    popular: true,
    badge: '100% Client-Side',
    seoTitle: 'Merge PDF Files Online for Free — Fast, Private & Unlimited',
    seoDescription: 'Combine multiple PDF files into a single document in seconds. 100% client-side processing means your private documents never leave your computer.',
    howToUse: [
      'Drag and drop two or more PDF files into the upload zone.',
      'Reorder files using the up/down controls to arrange your desired page sequence.',
      'Click "Merge PDFs" to assemble the new document and download immediately.'
    ],
    features: [
      'Client-side merging powered by pdf-lib (zero server uploads)',
      'Easy drag & drop reordering of uploaded files',
      'Real-time page count and file size summary',
      'Completely free with no limits on file count'
    ],
    faqs: [
      {
        question: 'Is it safe to merge confidential documents here?',
        answer: 'Yes, absolutely! Unlike other sites that upload your files to remote servers, ToolNova merges your PDFs entirely in your browser using WebAssembly and client-side JavaScript.'
      }
    ],
    relatedToolSlugs: ['pdf-split', 'pdf-compress', 'image-to-pdf', 'pdf-metadata-remover']
  },
  {
    id: 'pdf-split',
    slug: 'pdf-split',
    name: 'PDF Split',
    category: 'pdf-tools',
    shortDescription: 'Extract specific pages or page ranges from any PDF document.',
    iconName: 'Scissors',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'cut pdf pages'],
    popular: true,
    badge: '100% Client-Side',
    seoTitle: 'Split PDF Pages Online — Extract Pages & Custom Ranges Free',
    seoDescription: 'Extract pages from your PDF file. Select individual pages or custom ranges (e.g. 1-3, 5, 8-10) and save as a new PDF document.',
    howToUse: [
      'Upload your PDF document.',
      'Enter the pages or ranges you wish to extract (e.g. "1-3, 5, 7-9").',
      'Click "Extract Pages" to produce and download your customized PDF.'
    ],
    features: [
      'Extract custom ranges like 1-5, 8, 11-14',
      'Preview total page count',
      'High-speed in-browser processing without uploading files',
      'Preserves original quality and vector graphics'
    ],
    faqs: [
      {
        question: 'Can I extract multiple non-consecutive pages?',
        answer: 'Yes, comma-separated lists with hyphenated ranges are fully supported, such as "1, 3, 5-8".'
      }
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-compress', 'pdf-metadata-remover']
  },
  {
    id: 'pdf-compress',
    slug: 'pdf-compress',
    name: 'PDF Compress & Optimize',
    category: 'pdf-tools',
    shortDescription: 'Reduce PDF file size by stripping redundant metadata and optimizing streams.',
    iconName: 'Minimize2',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'optimize pdf', 'pdf size reducer'],
    popular: true,
    badge: 'Privacy-First',
    seoTitle: 'Compress PDF Online — Reduce PDF File Size Privately',
    seoDescription: 'Shrink your PDF file size without sacrificing readability. Fast, secure, and completed locally on your computer.',
    howToUse: [
      'Select or drag-and-drop your PDF file.',
      'Choose your optimization profile (Standard, Maximum Compression).',
      'Click "Compress PDF" and see the exact size reduction and percentage saved.'
    ],
    features: [
      'In-browser PDF stream restructuring and metadata cleanup',
      'Before and after file size comparison',
      'Percentage savings calculation',
      'No email registration or watermarks added'
    ],
    faqs: [
      {
        question: 'Will text clarity be reduced during compression?',
        answer: 'No, text and vector graphics remain crisp while unused fonts, duplicate resources, and unneeded metadata are stripped.'
      }
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-split', 'image-to-pdf']
  },
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF Converter (JPG & PNG to PDF)',
    category: 'pdf-tools',
    shortDescription: 'Convert JPG, PNG, and WebP images into a single printable PDF document.',
    iconName: 'FileImage',
    keywords: ['jpg to pdf', 'png to pdf', 'image to pdf', 'convert photo to pdf', 'pictures to pdf'],
    popular: true,
    seoTitle: 'Image to PDF Converter — Convert JPG & PNG to PDF Online Free',
    seoDescription: 'Convert images to PDF format in seconds. Add multiple photos, adjust page orientation and margins, and download your consolidated PDF.',
    howToUse: [
      'Upload one or more JPG, PNG, or WebP pictures.',
      'Select page orientation (Portrait / Landscape) and margin preference.',
      'Click "Convert to PDF" to generate and download your document.'
    ],
    features: [
      'Supports JPG, JPEG, PNG, and WebP image formats',
      'Custom page orientations: Auto-fit, Portrait, Landscape',
      'Reorder images before generating the final PDF',
      'High-resolution output preserving photo detail'
    ],
    faqs: [
      {
        question: 'Can I put multiple photos into one PDF?',
        answer: 'Yes! Each uploaded image will become a distinct high-quality page in your generated PDF.'
      }
    ],
    relatedToolSlugs: ['pdf-merge', 'image-resizer', 'image-compressor']
  },
  {
    id: 'pdf-metadata-remover',
    slug: 'pdf-metadata-remover',
    name: 'PDF Metadata Viewer & Remover',
    category: 'pdf-tools',
    shortDescription: 'Inspect and wipe Title, Author, Subject, Creator, and GPS info from PDFs.',
    iconName: 'ShieldAlert',
    keywords: ['pdf metadata remover', 'clean pdf metadata', 'view pdf metadata', 'remove author from pdf', 'pdf privacy'],
    badge: 'Privacy Tool',
    seoTitle: 'PDF Metadata Remover — View & Erase Hidden Document Data',
    seoDescription: 'View hidden metadata inside your PDF files (Author, Creator, Software, Dates) and wipe it clean with one click to protect your anonymity.',
    howToUse: [
      'Upload any PDF file.',
      'Inspect the metadata table showing Author, Subject, Keywords, Creator tool, and Creation Date.',
      'Click "Strip Metadata" to download a clean, sanitized PDF version.'
    ],
    features: [
      'Displays full metadata dictionary in real-time',
      'One-click sanitization of author and device fingerprints',
      'Preserves original document layout and contents intact',
      'Zero server upload guarantee'
    ],
    faqs: [
      {
        question: 'Why should I remove PDF metadata?',
        answer: 'PDFs often contain your computer username, company name, software versions, and exact creation timestamps that you may not want to share publicly.'
      }
    ],
    relatedToolSlugs: ['pdf-merge', 'password-generator', 'pdf-compress']
  },
  {
    id: 'pdf-rotate',
    slug: 'pdf-rotate',
    name: 'PDF Rotate & Watermark',
    category: 'pdf-tools',
    shortDescription: 'Permanently rotate PDF pages (90°, 180°, 270°) and stamp text watermarks.',
    iconName: 'RotateCw',
    keywords: ['rotate pdf', 'turn pdf pages', 'watermark pdf', 'add watermark to pdf', 'orient pdf'],
    seoTitle: 'Rotate PDF & Add Text Watermark Online — Free & Fast',
    seoDescription: 'Rotate PDF pages permanently by 90, 180, or 270 degrees and optionally apply a custom confidential or draft watermark across pages.',
    howToUse: [
      'Upload your PDF file.',
      'Select rotation angle (90° clockwise, 180°, or 270°).',
      'Optionally type a watermark text (e.g. "CONFIDENTIAL" or "DRAFT").',
      'Click "Process & Download" to save your updated PDF.'
    ],
    features: [
      'Rotate all pages uniformly in 90-degree increments',
      'Custom semi-transparent diagonal text watermark stamping',
      'Instant in-browser preview and download',
      'Zero data uploads to external servers'
    ],
    faqs: [
      {
        question: 'Will the rotation stay permanent when opened in Adobe Acrobat?',
        answer: 'Yes, the page transformation dictionary is permanently updated in the PDF specification.'
      }
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-split', 'pdf-compress']
  },

  // ------------------- IMAGE TOOLS -------------------
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image-tools',
    shortDescription: 'Compress JPG, PNG, and WebP images with custom quality and size controls.',
    iconName: 'Minimize',
    keywords: ['image compressor', 'compress jpg', 'compress png', 'shrink image', 'reduce photo size', 'optimize images'],
    popular: true,
    badge: 'Instant Canvas',
    seoTitle: 'Image Compressor Online — Compress JPG, PNG & WebP Free',
    seoDescription: 'Reduce image file size up to 80% while retaining sharp visual fidelity. Live quality slider with before/after size comparisons and percent savings.',
    howToUse: [
      'Upload a JPG, PNG, or WebP image.',
      'Adjust the compression quality slider (e.g. 70% - 90%).',
      'Review the original vs compressed file size and percentage saved.',
      'Click Download Compressed Image.'
    ],
    features: [
      'Interactive quality slider with real-time size computation',
      'Supports JPG, PNG, and WebP formats',
      'Displays exact megabyte/kilobyte savings and % reduction',
      'Browser canvas processing ensures photos never leave your device'
    ],
    faqs: [
      {
        question: 'What is the optimal quality setting for web images?',
        answer: 'Between 75% and 85% provides significant size reduction (often 60-80% smaller) with virtually zero human-perceptible quality degradation.'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'image-converter', 'image-cropper', 'favicon-generator']
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image-tools',
    shortDescription: 'Resize image dimensions by exact pixels or percentage while maintaining aspect ratio.',
    iconName: 'Maximize2',
    keywords: ['image resizer', 'resize photo', 'change image dimensions', 'scale photo', 'pixel resizer'],
    popular: true,
    seoTitle: 'Image Resizer Online — Change Image Dimensions & Pixels Free',
    seoDescription: 'Resize photos and graphics by exact width and height or scale percentage. Maintain aspect ratio lock with high-quality bicubic interpolation.',
    howToUse: [
      'Drop your photo or graphic into the resizer.',
      'Type your desired width or height (aspect ratio auto-locks by default).',
      'Or pick a percentage scale like 50%, 75%, or 200%.',
      'Download your resized graphic instantly.'
    ],
    features: [
      'Exact pixel dimension input (Width x Height)',
      'Aspect ratio lock switch to prevent distortion',
      'Quick scale buttons (25%, 50%, 75%, 150%, 200%)',
      'Instant preview and download'
    ],
    faqs: [
      {
        question: 'Does resizing reduce image clarity?',
        answer: 'Downscaling preserves clarity and reduces file size. Upscaling beyond the original resolution cannot create new detail, but bicubic smoothing prevents harsh pixelation.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'image-cropper', 'passport-photo-resizer']
  },
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Format Converter (JPG ↔ PNG ↔ WebP)',
    category: 'image-tools',
    shortDescription: 'Convert between JPG, PNG, WebP, and BMP formats in your browser.',
    iconName: 'RefreshCw',
    keywords: ['jpg to png', 'png to jpg', 'webp to png', 'png to webp', 'image converter', 'convert photo format'],
    popular: true,
    seoTitle: 'Image Converter Online — Convert JPG to PNG, WebP & PNG to JPG',
    seoDescription: 'Convert image files between JPG, PNG, WebP, and BMP format instantly in your browser. Fast, free, and no watermark added.',
    howToUse: [
      'Upload your source image in any standard format.',
      'Choose the output format: PNG, JPG, or WebP.',
      'Click Convert & Download to receive your converted file.'
    ],
    features: [
      'Instant conversion between PNG, JPG, WebP, and BMP',
      'Transparent background support when converting to PNG or WebP',
      'High-speed local conversion with HTML5 Canvas',
      'No file size restrictions or watermarks'
    ],
    faqs: [
      {
        question: 'Which image format should I choose for websites?',
        answer: 'WebP offers superior compression with both transparency and high color fidelity, making it the modern standard for web performance.'
      }
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'favicon-generator']
  },
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper & Aspect Ratio Tool',
    category: 'image-tools',
    shortDescription: 'Crop images with preset aspect ratios (1:1, 16:9, 4:3, 9:16) or custom crops.',
    iconName: 'Crop',
    keywords: ['crop image', 'photo cropper', 'square crop', '16:9 crop', 'crop photo online'],
    seoTitle: 'Image Cropper Online — Crop Photos to 1:1, 16:9, 4:3 Aspect Ratios',
    seoDescription: 'Crop images online to popular aspect ratios like Instagram 1:1, YouTube 16:9, portrait 9:16, or custom freeform crops with instant download.',
    howToUse: [
      'Upload an image from your device.',
      'Select an aspect ratio preset or adjust the crop boundaries manually.',
      'Click Crop & Download to save your cropped picture.'
    ],
    features: [
      'Presets for Square (1:1), Landscape (16:9), Standard (4:3), and Story (9:16)',
      'Freeform custom crop mode',
      'Live dimension tracker for cropped area',
      'Client-side canvas rendering'
    ],
    faqs: [
      {
        question: 'Does cropping alter my original image file?',
        answer: 'No, cropping creates a brand new cropped image download, leaving your original file on your computer unchanged.'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'passport-photo-resizer', 'image-compressor']
  },
  {
    id: 'favicon-generator',
    slug: 'favicon-generator',
    name: 'Favicon Generator & App Icon Maker',
    category: 'image-tools',
    shortDescription: 'Generate multi-size web favicons (16x16, 32x32, 48x48, 180x180, 512x512).',
    iconName: 'Grid',
    keywords: ['favicon generator', 'app icon maker', 'create favicon', 'apple touch icon', 'website icon'],
    seoTitle: 'Favicon Generator Online — Create Website Icons & App Icons',
    seoDescription: 'Turn any image or logo into standard website favicons and mobile app icons (16x16, 32x32, 48x48, 180x180, 512x512). Includes HTML meta tags.',
    howToUse: [
      'Upload your logo or icon image (square works best).',
      'Preview icons generated at standard browser and Apple Touch sizes.',
      'Download individual sizes or copy ready-to-paste HTML link tags.'
    ],
    features: [
      'Generates 16x16, 32x32, 48x48, 180x180 (Apple Touch), and 512x512 (PWA)',
      'Provides copyable HTML `<link rel="icon">` tags',
      'Smooth scaling algorithm keeping icons sharp at small sizes',
      'One-click download of all icon assets'
    ],
    faqs: [
      {
        question: 'What is the recommended size for a source favicon image?',
        answer: 'A clean 512x512 square PNG with transparent background produces the highest quality favicons across all resolutions.'
      }
    ],
    relatedToolSlugs: ['image-converter', 'image-resizer', 'color-picker']
  },
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: 'Color Picker & Palette Inspector',
    category: 'image-tools',
    shortDescription: 'Inspect colors, convert HEX, RGB, HSL, and extract palettes from images.',
    iconName: 'Palette',
    keywords: ['color picker', 'hex to rgb', 'rgb to hex', 'extract palette from image', 'color inspector'],
    seoTitle: 'Color Picker & Palette Generator — HEX, RGB, HSL Converter',
    seoDescription: 'Pick colors, convert between HEX, RGB, and HSL color models, test contrast ratios, and extract dominant color palettes from uploaded images.',
    howToUse: [
      'Use the interactive color wheel or type a HEX, RGB, or HSL value.',
      'Or upload a picture to sample colors directly from the canvas.',
      'Copy color codes with one click in CSS, HEX, RGB, or HSL format.'
    ],
    features: [
      'Live color converter across HEX, RGB, and HSL',
      'Image color palette extractor sampling dominant shades',
      'WCAG contrast score preview on white and black backgrounds',
      'One-click clipboard copy for CSS code'
    ],
    faqs: [
      {
        question: 'What color format is best for CSS variables?',
        answer: 'HEX and HSL are widely used; HSL is especially flexible for programmatically creating dark and light shade variants.'
      }
    ],
    relatedToolSlugs: ['image-converter', 'favicon-generator', 'base64-encoder']
  },

  // ------------------- DEVELOPER TOOLS -------------------
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Beautifier',
    category: 'developer-tools',
    shortDescription: 'Beautify, indent, format, and minify JSON data with instant error highlighting.',
    iconName: 'Braces',
    keywords: ['json formatter', 'beautify json', 'json pretty print', 'minify json', 'format json online'],
    popular: true,
    seoTitle: 'JSON Formatter & Beautifier Online — Pretty Print & Minify JSON',
    seoDescription: 'Format and beautify messy JSON strings with custom indentation (2 spaces, 4 spaces, tabs) or minify into a single compact line. Real-time syntax validation.',
    howToUse: [
      'Paste your raw JSON string into the editor.',
      'Click "Format (2 Spaces)" or "Format (4 Spaces)" to beautify.',
      'Click "Minify" to remove whitespace for network payloads.',
      'Copy formatted output or download as a .json file.'
    ],
    features: [
      'Syntax validation with exact line and column error markers',
      'Indentation options: 2 spaces, 4 spaces, tabs, or compact minification',
      'Formatted statistics: keys count, payload size, depth level',
      'Load sample data for testing'
    ],
    faqs: [
      {
        question: 'Is my JSON data uploaded or logged anywhere?',
        answer: 'Never. JSON parsing and formatting occurs strictly in JavaScript memory within your browser session.'
      }
    ],
    relatedToolSlugs: ['json-validator', 'base64-encoder', 'jwt-decoder', 'url-encoder']
  },
  {
    id: 'json-validator',
    slug: 'json-validator',
    name: 'JSON Validator & Linter',
    category: 'developer-tools',
    shortDescription: 'Validate JSON syntax with detailed error messages, line numbers, and character positions.',
    iconName: 'CheckCircle2',
    keywords: ['json validator', 'validate json', 'json linter', 'check json syntax', 'fix json errors'],
    seoTitle: 'JSON Validator & Linter Online — Catch Syntax Errors & Validate',
    seoDescription: 'Validate JSON syntax in real time. Pinpoint unescaped characters, missing commas, mismatched brackets, and trailing commas with exact line indicators.',
    howToUse: [
      'Enter your JSON payload into the input box.',
      'The validator immediately inspects syntax validity.',
      'If errors exist, the exact line and position are highlighted with an explanatory fix tip.'
    ],
    features: [
      'Detailed error inspection with line and token clues',
      'Tree structure overview for valid payloads',
      'Common error auto-fix suggestions (e.g. trailing commas, single quotes)',
      'Instant copy and clear controls'
    ],
    faqs: [
      {
        question: 'Why does JSON disallow trailing commas?',
        answer: 'The strict JSON RFC 8259 specification does not permit trailing commas after the final key-value pair or array element.'
      }
    ],
    relatedToolSlugs: ['json-formatter', 'base64-encoder', 'regex-tester']
  },
  {
    id: 'base64-encoder',
    slug: 'base64-encoder',
    name: 'Base64 Encoder & Decoder',
    category: 'developer-tools',
    shortDescription: 'Encode and decode plain text or binary files into Base64 format.',
    iconName: 'Binary',
    keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64', 'base64 online'],
    popular: true,
    seoTitle: 'Base64 Encoder & Decoder Online — Encode & Decode Text & Files',
    seoDescription: 'Fast, secure Base64 encoder and decoder. Convert text, strings, and files to Base64 and back. Supports UTF-8 strings and URL-safe Base64 encoding.',
    howToUse: [
      'Type or paste text into the input field.',
      'Toggle between "Encode" or "Decode" mode.',
      'Toggle "URL-Safe Base64" if needed for query strings.',
      'Copy the output directly with the Copy button.'
    ],
    features: [
      'Full UTF-8 Unicode character support',
      'URL-safe encoding mode (+ becomes -, / becomes _)',
      'Live character and byte count counter',
      'File to Base64 data URL converter'
    ],
    faqs: [
      {
        question: 'What is URL-safe Base64?',
        answer: 'Standard Base64 uses + and / which have special meanings in URLs. URL-safe Base64 substitutes these with - and _ to prevent URL encoding conflicts.'
      }
    ],
    relatedToolSlugs: ['url-encoder', 'json-formatter', 'hash-generator', 'uuid-generator']
  },
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder & Decoder',
    category: 'developer-tools',
    shortDescription: 'Encode and decode URLs and query string parameters (percent-encoding).',
    iconName: 'Link',
    keywords: ['url encoder', 'url decoder', 'encode uri component', 'percent encoding', 'decode url'],
    seoTitle: 'URL Encoder & Decoder Online — Percent-Encode URLs & Strings',
    seoDescription: 'Encode special characters into percent-encoded URL safe characters, or decode encoded query strings and links back into readable human text.',
    howToUse: [
      'Paste your URL or parameter string.',
      'Click "Encode" to transform symbols (e.g. spaces to %20) or "Decode" to revert.',
      'Inspect parsed query parameters in an organized key-value table.'
    ],
    features: [
      'Supports encodeURI and encodeURIComponent standards',
      'Automatic breakdown of URL components (protocol, host, pathname, query params)',
      'Live parameter table with copyable key-value pairs',
      'Instant copy to clipboard'
    ],
    faqs: [
      {
        question: 'When should I use encodeURIComponent vs encodeURI?',
        answer: 'Use encodeURIComponent for individual query parameter values (so & and = are escaped), and encodeURI for a full website address.'
      }
    ],
    relatedToolSlugs: ['base64-encoder', 'jwt-decoder', 'qr-code-generator']
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    category: 'developer-tools',
    shortDescription: 'Generate cryptographically random UUID v4 identifiers in bulk.',
    iconName: 'Key',
    keywords: ['uuid generator', 'guid generator', 'random uuid', 'uuid v4', 'generate guids online'],
    popular: true,
    seoTitle: 'UUID / GUID Generator Online — Free Cryptographic UUID v4',
    seoDescription: 'Generate cryptographically secure Version-4 UUIDs and GUIDs. Bulk generate up to 50 identifiers, toggle uppercase/lowercase, hyphens, and quotes.',
    howToUse: [
      'Select how many UUIDs to generate (1 to 50).',
      'Configure options: Uppercase, With Hyphens, or Wrapped in Quotes.',
      'Click "Generate New" and copy all generated IDs with one click.'
    ],
    features: [
      'Cryptographically secure random generation using window.crypto',
      'Bulk generation up to 50 UUIDs at once',
      'Custom formatting: Uppercase, Lowercase, Without Hyphens, Array format',
      'One-click batch copy and text file download'
    ],
    faqs: [
      {
        question: 'Can two UUID v4 values ever collide?',
        answer: 'The probability of generating a duplicate UUID v4 is so close to zero (1 in 2^122) that it is practically impossible across all computer systems on Earth.'
      }
    ],
    relatedToolSlugs: ['password-generator', 'hash-generator', 'base64-encoder']
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator (SHA-256, SHA-1, SHA-512, MD5)',
    category: 'developer-tools',
    shortDescription: 'Compute SHA-256, SHA-1, SHA-512, and MD5 cryptographic hashes locally.',
    iconName: 'Hash',
    keywords: ['hash generator', 'sha256 generator', 'sha1', 'sha512', 'md5 hash', 'checksum online'],
    seoTitle: 'Hash Generator Online — Compute SHA-256, SHA-512, SHA-1 & MD5',
    seoDescription: 'Generate cryptographic hash values from any text input. Calculate SHA-256, SHA-512, and SHA-1 using native Web Crypto API. Fast, free, and private.',
    howToUse: [
      'Type or paste your text or password string.',
      'Hashes for all major algorithms update automatically.',
      'Click the copy icon next to any hash to copy the hexadecimal digest.'
    ],
    features: [
      'Real-time hash generation using browser native Web Crypto API',
      'Computes SHA-256, SHA-512, and SHA-1 digests',
      'Displays hash length in bits and characters',
      'Uppercase and lowercase hex output toggle'
    ],
    faqs: [
      {
        question: 'Are hashes reversible?',
        answer: 'No. Cryptographic hashes are one-way mathematical functions designed so that the original input cannot be derived from the resulting hash digest.'
      }
    ],
    relatedToolSlugs: ['password-generator', 'uuid-generator', 'base64-encoder']
  },
  {
    id: 'unix-timestamp-converter',
    slug: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    category: 'developer-tools',
    shortDescription: 'Convert epoch seconds and milliseconds to human-readable dates and vice-versa.',
    iconName: 'Clock',
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'date to timestamp', 'epoch time'],
    seoTitle: 'Unix Timestamp Converter Online — Epoch to Human Date Converter',
    seoDescription: 'Convert Unix epoch timestamps (seconds and milliseconds) to human-readable UTC and local date formats, or convert any date into a timestamp.',
    howToUse: [
      'Enter an epoch timestamp (e.g. 1772678400) or pick a date on the calendar.',
      'View instant conversions in UTC, Local Time, ISO 8601, and Relative time.',
      'Click "Use Current Time" to get the live real-time timestamp.'
    ],
    features: [
      'Live current epoch timestamp display with ticker',
      'Bidirectional conversion: Timestamp → Date and Date → Timestamp',
      'Supports both seconds (10 digits) and milliseconds (13 digits)',
      'Outputs ISO 8601, RFC 2822, UTC, and local timezone formats'
    ],
    faqs: [
      {
        question: 'What is the Unix epoch?',
        answer: 'The Unix epoch is 00:00:00 UTC on 1 January 1970. The timestamp represents total elapsed seconds since that instant.'
      }
    ],
    relatedToolSlugs: ['date-difference-calculator', 'timezone-converter', 'age-calculator']
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder & Inspector',
    category: 'developer-tools',
    shortDescription: 'Decode JSON Web Tokens, inspect payload claims, and verify expiration dates.',
    iconName: 'Shield',
    keywords: ['jwt decoder', 'decode jwt', 'jwt inspector', 'json web token', 'jwt expiration check'],
    popular: true,
    badge: '100% Private',
    seoTitle: 'JWT Decoder Online — Decode JSON Web Tokens & Check Expiration',
    seoDescription: 'Decode and inspect JWT headers and payload claims without sending tokens to any server. Check token validity, issued at (iat), and expiration (exp) dates.',
    howToUse: [
      'Paste an encoded JSON Web Token (e.g. eyJhbGci...).',
      'The tool splits and parses the Header, Payload, and Signature.',
      'Check whether the token is currently expired or still valid with exact remaining time.'
    ],
    features: [
      'Color-coded token breakdown (Header in red, Payload in purple, Signature in cyan)',
      'Human-readable date parsing for `exp`, `iat`, and `nbf` claims',
      'Live expired / valid countdown status banner',
      'Strict client-side decoding—your secret tokens are never logged or stored'
    ],
    faqs: [
      {
        question: 'Does decoding a JWT expose my private credentials?',
        answer: 'Not on ToolNova. All decoding is done locally using JavaScript string splitting and Base64 decoding. Your token never touches a remote server.'
      }
    ],
    relatedToolSlugs: ['base64-encoder', 'json-formatter', 'hash-generator']
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester & Matcher',
    category: 'developer-tools',
    shortDescription: 'Test regular expressions with real-time match highlighting, flags, and group capture.',
    iconName: 'Search',
    keywords: ['regex tester', 'regular expression', 'regex online', 'test regex', 'regex matcher'],
    seoTitle: 'Regex Tester Online — Real-Time Regular Expression Testing',
    seoDescription: 'Test regular expressions with live match highlighting, flag toggles (g, i, m, s), capture group extraction, and handy cheat sheet shortcuts.',
    howToUse: [
      'Enter your regular expression pattern and choose flags (g, i, m).',
      'Paste your test text string in the test area.',
      'Matches are highlighted instantly, with capture groups detailed below.'
    ],
    features: [
      'Real-time match highlighting and match index counting',
      'Capture groups and captured substrings breakdown',
      'Flag controls: global (g), case-insensitive (i), multiline (m)',
      'Quick regex template library for emails, phone numbers, URLs, and dates'
    ],
    faqs: [
      {
        question: 'What JavaScript regex engine is used?',
        answer: 'It uses standard ECMAScript JavaScript RegExp engine directly in your browser.'
      }
    ],
    relatedToolSlugs: ['json-formatter', 'text-cleaner', 'word-counter']
  },

  // ------------------- CALCULATORS -------------------
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculators',
    shortDescription: 'Calculate percentages, percentage increase, decrease, and difference instantly.',
    iconName: 'Percent',
    keywords: ['percentage calculator', 'percent increase', 'percent decrease', 'calculate percentage', 'percent difference'],
    popular: true,
    seoTitle: 'Percentage Calculator Online — Percentage Increase, Decrease & Ratio',
    seoDescription: 'Quickly solve percentage math: What is X% of Y? X is what percent of Y? And percentage increase/decrease between two numbers with step-by-step formulas.',
    howToUse: [
      'Select which calculation mode you need from the 3 tabs.',
      'Input the corresponding numbers into the fields.',
      'The calculation computes automatically with formula breakdown and explanation.'
    ],
    features: [
      'Mode 1: What is X% of Y?',
      'Mode 2: Number X is what percent of Number Y?',
      'Mode 3: Percentage increase or decrease from value A to value B',
      'Clear formula display and mathematical explanation'
    ],
    faqs: [
      {
        question: 'How do you calculate percentage increase?',
        answer: 'Subtract the old value from the new value, divide by the old value, and multiply by 100: ((New - Old) / Old) * 100.'
      }
    ],
    relatedToolSlugs: ['discount-calculator', 'gpa-calculator', 'loan-emi-calculator']
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculators',
    shortDescription: 'Calculate exact age in years, months, days, hours, and next birthday countdown.',
    iconName: 'Cake',
    keywords: ['age calculator', 'calculate age', 'how old am i', 'exact age calculator', 'birthday countdown'],
    popular: true,
    seoTitle: 'Age Calculator Online — Calculate Exact Age in Years, Months & Days',
    seoDescription: 'Find your exact age from date of birth. Calculates precise years, months, weeks, days, total hours, minutes, and days remaining until your next birthday.',
    howToUse: [
      'Select your birth date on the date picker.',
      'Optionally specify a comparison target date (defaults to today).',
      'View your exact chronological age, lifetime stats, and next birthday countdown.'
    ],
    features: [
      'Exact age expressed in Years, Months, and Days',
      'Total lifetime summary: total months, weeks, days, hours, and minutes lived',
      'Next birthday countdown tracker with day of the week',
      'Leap year accuracy handling'
    ],
    faqs: [
      {
        question: 'Does this calculator account for leap years?',
        answer: 'Yes, leap years and variable month lengths (28, 29, 30, 31 days) are calculated with calendar precision.'
      }
    ],
    relatedToolSlugs: ['date-difference-calculator', 'bangladesh-age-calculator', 'percentage-calculator']
  },
  {
    id: 'gpa-calculator',
    slug: 'gpa-calculator',
    name: 'GPA & CGPA Calculator',
    category: 'calculators',
    shortDescription: 'Calculate Grade Point Average (GPA) and cumulative CGPA on 4.0 or 5.0 scales.',
    iconName: 'GraduationCap',
    keywords: ['gpa calculator', 'cgpa calculator', 'grade calculator', 'college gpa', 'semester gpa calculator'],
    popular: true,
    seoTitle: 'GPA & CGPA Calculator Online — Calculate Semester & Cumulative GPA',
    seoDescription: 'Calculate your semester GPA and cumulative CGPA with credit hour weighting. Supports 4.0 and 5.0 grading scales with easy course addition.',
    howToUse: [
      'Choose your grading scale (4.0 scale or 5.0 scale).',
      'Add your courses with credit hours and letter grade (A+, A, B, etc.).',
      'View your calculated weighted GPA and classification instantly.'
    ],
    features: [
      'Customizable grading scale: 4.0 Standard or 5.0 Scale',
      'Add unlimited courses with credit hours and grade points',
      'Cumulative CGPA calculator combining past GPA with current semester',
      'Visual grade classification (First Class, Magna Cum Laude, Honors)'
    ],
    faqs: [
      {
        question: 'How is weighted GPA calculated?',
        answer: 'Multiply each course grade point by its credit hours, sum all products, and divide by the total number of credit hours completed.'
      }
    ],
    relatedToolSlugs: ['percentage-calculator', 'discount-calculator', 'date-difference-calculator']
  },
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount & Sales Tax Calculator',
    category: 'calculators',
    shortDescription: 'Calculate final discounted price, total savings, and optional sales tax.',
    iconName: 'Tag',
    keywords: ['discount calculator', 'sale price calculator', 'savings calculator', 'calculate discount', 'shopping discount'],
    seoTitle: 'Discount Calculator Online — Calculate Sale Price & Money Saved',
    seoDescription: 'Calculate the final price of an item after discount and optional sales tax. See exact dollars saved and final amount due during shopping and sales.',
    howToUse: [
      'Enter the original retail price.',
      'Enter the discount percentage or fixed discount dollar amount.',
      'Optionally add a sales tax / VAT percentage.',
      'See your final price and total money saved immediately.'
    ],
    features: [
      'Percentage off (% off) and Fixed amount off modes',
      'Optional sales tax / VAT inclusion',
      'Visual breakdown of savings vs final cost',
      'Quick discount presets (10%, 20%, 30%, 50%, 70%)'
    ],
    faqs: [
      {
        question: 'Is tax calculated before or after discount?',
        answer: 'In standard retail practice, sales tax is applied to the discounted sale price, not the original sticker price.'
      }
    ],
    relatedToolSlugs: ['percentage-calculator', 'loan-emi-calculator', 'gpa-calculator']
  },
  {
    id: 'date-difference-calculator',
    slug: 'date-difference-calculator',
    name: 'Date Difference & Working Days Calculator',
    category: 'calculators',
    shortDescription: 'Calculate days, weeks, months, and business/working days between two dates.',
    iconName: 'CalendarDays',
    keywords: ['date difference', 'days between dates', 'working days calculator', 'business days', 'calendar difference'],
    seoTitle: 'Date Difference Calculator — Days, Weeks & Business Days Between Dates',
    seoDescription: 'Calculate exact number of days, weeks, months, and business working days between any two dates. Exclude weekends for project timelines.',
    howToUse: [
      'Pick a start date and an end date.',
      'View total calendar days, weeks, months, and years.',
      'Check the working days counter which excludes Saturday and Sunday.'
    ],
    features: [
      'Total calendar days, weeks, and month breakdown',
      'Business/working days calculator excluding weekends',
      'Quick shortcuts for +30 days, +90 days, or end of year',
      'Handles leap years and day counts accurately'
    ],
    faqs: [
      {
        question: 'Does the working days counter exclude public holidays?',
        answer: 'It excludes standard weekend days (Saturday and Sunday). Regional holidays vary by country and are not automatically deducted.'
      }
    ],
    relatedToolSlugs: ['age-calculator', 'unix-timestamp-converter', 'percentage-calculator']
  },
  {
    id: 'loan-emi-calculator',
    slug: 'loan-emi-calculator',
    name: 'Loan EMI & Interest Calculator',
    category: 'calculators',
    shortDescription: 'Calculate monthly EMI, total interest, and total repayment amount for loans.',
    iconName: 'Coins',
    keywords: ['loan calculator', 'emi calculator', 'mortgage calculator', 'car loan emi', 'monthly loan payment'],
    popular: true,
    seoTitle: 'Loan EMI Calculator Online — Calculate Monthly EMI & Interest',
    seoDescription: 'Calculate monthly Equated Monthly Installment (EMI) for home loans, car loans, or personal loans. View total interest payable and repayment summary.',
    howToUse: [
      'Enter the total loan amount (principal).',
      'Enter the annual interest rate (%).',
      'Enter loan tenure in months or years.',
      'Review your monthly EMI, total interest, and overall loan repayment cost.'
    ],
    features: [
      'Interactive sliders for loan amount, interest rate, and tenure',
      'Detailed breakdown of Principal vs Total Interest payable',
      'Monthly payment schedule preview',
      'Supports home loans, auto loans, student loans, and business financing'
    ],
    faqs: [
      {
        question: 'What is the standard EMI formula?',
        answer: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is total number of monthly installments.'
      }
    ],
    relatedToolSlugs: ['percentage-calculator', 'discount-calculator', 'bangladesh-land-converter']
  },

  // ------------------- CONVERTERS -------------------
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Universal Unit Converter',
    category: 'converters',
    shortDescription: 'Convert length, weight, temperature, area, volume, and digital storage units.',
    iconName: 'ArrowRightLeft',
    keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', 'kg to lbs', 'meters to feet'],
    popular: true,
    seoTitle: 'Unit Converter Online — Convert Length, Weight, Temp & Storage',
    seoDescription: 'Convert between metric and imperial units. Seamless conversions for Length (km, m, cm, mi, ft, in), Weight (kg, g, lb, oz), Temperature (°C, °F, K), and Digital Data.',
    howToUse: [
      'Select the measurement category (Length, Weight, Temperature, Data).',
      'Type your value and pick source and target units.',
      'The converted value calculates instantaneously.'
    ],
    features: [
      'Length: meters, kilometers, centimeters, millimeters, miles, yards, feet, inches',
      'Weight: kilograms, grams, pounds, ounces, metric tons',
      'Temperature: Celsius, Fahrenheit, Kelvin with reciprocal formula',
      'Data Storage: Bytes, KB, MB, GB, TB, PB',
      'Swap button to invert source and target units instantly'
    ],
    faqs: [
      {
        question: 'Are conversions calculated to high precision?',
        answer: 'Yes, formulas use IEEE double precision floating point standards to maintain up to 8 significant decimal places.'
      }
    ],
    relatedToolSlugs: ['timezone-converter', 'bangladesh-land-converter', 'percentage-calculator']
  },
  {
    id: 'timezone-converter',
    slug: 'timezone-converter',
    name: 'Timezone Converter & World Clock',
    category: 'converters',
    shortDescription: 'Compare times across world cities, convert timezones, and schedule international meetings.',
    iconName: 'Globe',
    keywords: ['timezone converter', 'world clock', 'utc to est', 'gmt to local', 'time difference calculator'],
    seoTitle: 'Timezone Converter Online — Compare World Times & UTC Offsets',
    seoDescription: 'Convert times between international time zones (UTC, GMT, EST, PST, BST, Dhaka, London, Tokyo). Perfect for remote teams and scheduling meetings.',
    howToUse: [
      'Pick your base city or timezone and select a target time.',
      'Add target timezones to compare side-by-side.',
      'Check daylight savings indicators and hour differences instantly.'
    ],
    features: [
      'World clock display with major financial and tech hubs (New York, London, Tokyo, Dhaka, Dubai, Sydney)',
      'Live current time ticker across all active time zones',
      'Day/Night visual indicators',
      'UTC and GMT offset calculator'
    ],
    faqs: [
      {
        question: 'Does this handle daylight saving time (DST)?',
        answer: 'Yes, standard browser Intl.DateTimeFormat API handles regional DST shifts automatically based on the selected date.'
      }
    ],
    relatedToolSlugs: ['unix-timestamp-converter', 'date-difference-calculator', 'unit-converter']
  },

  // ------------------- QR & BARCODE TOOLS -------------------
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'qr-tools',
    shortDescription: 'Generate custom QR codes for URLs, Wi-Fi networks, text, email, and phone numbers.',
    iconName: 'QrCode',
    keywords: ['qr code generator', 'make qr code', 'wifi qr code', 'custom qr code', 'qr code with color'],
    popular: true,
    badge: 'High Res PNG',
    seoTitle: 'Free QR Code Generator Online — Custom Colors & Wi-Fi QR Codes',
    seoDescription: 'Create high-resolution QR codes for websites, Wi-Fi passwords, contact cards, emails, and plain text. Customize foreground and background colors and download PNG format free.',
    howToUse: [
      'Select data type: URL, Plain Text, Wi-Fi, Email, or Phone.',
      'Enter your details into the provided fields.',
      'Customize colors (foreground and background) and preview in real time.',
      'Click "Download QR Code" to save a high-resolution PNG image.'
    ],
    features: [
      'Specialized formats: Web URL, Wi-Fi login auto-connect, Plain Text, Email, Phone',
      'Custom color pickers for foreground dots and background canvas',
      'Error correction levels (L, M, Q, H) for reliable scanning',
      'Instant high-res PNG download with no watermarks'
    ],
    faqs: [
      {
        question: 'Do generated QR codes ever expire?',
        answer: 'No! These are standard static QR codes that encode your data directly into the pixel pattern. They never expire and require no external redirection server.'
      }
    ],
    relatedToolSlugs: ['url-encoder', 'password-generator', 'image-converter']
  },

  // ------------------- PRIVACY TOOLS -------------------
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Strong Password Generator',
    category: 'privacy-tools',
    shortDescription: 'Generate cryptographically secure passwords with entropy and strength analysis.',
    iconName: 'Lock',
    keywords: ['password generator', 'strong password', 'secure password generator', 'random password', 'password strength'],
    popular: true,
    badge: 'Crypto Random',
    seoTitle: 'Strong Password Generator — Cryptographically Secure Passwords',
    seoDescription: 'Generate unbreakable, randomized passwords using window.crypto. Choose length, include symbols, numbers, uppercase letters, and avoid ambiguous characters.',
    howToUse: [
      'Select desired password length using the slider (8 to 64 characters).',
      'Toggle character options: Uppercase, Lowercase, Numbers, Symbols.',
      'Toggle "Exclude Ambiguous Characters" (like 0 and O, 1 and l) if needed.',
      'Click Copy to clipboard or Generate New.'
    ],
    features: [
      'Powered by window.crypto.getRandomValues for true cryptographic security',
      'Real-time entropy bit rating and strength indicator (Weak, Good, Strong, Unbreakable)',
      'Option to exclude similar characters (e.g. i, l, 1, L, o, 0, O)',
      'Estimated time-to-crack brute force calculation'
    ],
    faqs: [
      {
        question: 'Can ToolNova see or store my generated password?',
        answer: 'Never! Passwords are generated 100% client-side inside your browser’s volatile memory and wiped when you leave the page.'
      }
    ],
    relatedToolSlugs: ['uuid-generator', 'hash-generator', 'base64-encoder']
  },

  // ------------------- BANGLADESH TOOLS -------------------
  {
    id: 'bangla-english-typing',
    slug: 'bangla-english-typing',
    name: 'Bangla ↔ English Typing & Transliteration',
    category: 'bangladesh-tools',
    shortDescription: 'Type phonetic English to generate Bangla script (Avro style) and convert fonts.',
    iconName: 'Languages',
    keywords: ['bangla typing', 'avro typing online', 'english to bangla', 'bangla phonetic', 'bangla unicode text'],
    popular: true,
    badge: 'বাংলা টুলস',
    seoTitle: 'Bangla Typing Online — Phonetic English to Bangla Converter (Avro Style)',
    seoDescription: 'Type English phonetics to produce beautiful Unicode Bangla text easily (e.g. type "ami banglay gan gai" to get "আমি বাংলায় গান গাই"). Fast, free, and works on any device.',
    howToUse: [
      'Type phonetic English in the text box (e.g., "dhaka", "bangladesh", "kemon acho").',
      'Watch your input convert into Unicode Bengali script automatically.',
      'Use the Copy button to paste into Facebook, Word, or messages.'
    ],
    features: [
      'Phonetic transliteration rules matching familiar Avro keyboard layout',
      'Common conjuncts (যুক্তাক্ষর) and vowel sign (কার) support',
      'One-click copy to clipboard for social media and documents',
      'Unicode standard output readable on Android, iOS, Windows, and Mac'
    ],
    faqs: [
      {
        question: 'How do I type যুক্তাক্ষর (conjuncts)?',
        answer: 'Type the consonants together, e.g. "kk" for ক্ক, "kt" for ক্ত, "nd" for ন্দ, "shk" for ষ্ক.'
      }
    ],
    relatedToolSlugs: ['bangladesh-land-converter', 'bangladesh-age-calculator', 'word-counter']
  },
  {
    id: 'bangladesh-land-converter',
    slug: 'bangladesh-land-converter',
    name: 'Bangladesh Land Unit Converter (শতাংশ ↔ কাঠা ↔ বিঘা)',
    category: 'bangladesh-tools',
    shortDescription: 'Convert Bangladeshi land units: শতাংশ / শতক, কাঠা, বিঘা, একর, and বর্গফুট.',
    iconName: 'MapPin',
    keywords: ['land measurement bangladesh', 'shotok to katha', 'katha to bigha', 'shotaongsho converter', 'bangladesh jomi hisab'],
    popular: true,
    badge: 'জমি পরিমাপ',
    seoTitle: 'Bangladesh Land Measurement Converter — শতক, কাঠা, বিঘা & একর',
    seoDescription: 'Accurately convert land units used across Bangladesh. Convert between শতাংশ (শতক / ডেসিমেল), কাঠা, বিঘা, একর, বর্গফুট, and বর্গমিটার with standard survey formulas.',
    howToUse: [
      'Enter the land measurement number.',
      'Select the starting unit (e.g. শতাংশ / শতক, কাঠা, বিঘা, or একর).',
      'Instant equivalent measurements are calculated across all standard Bangladeshi land units.'
    ],
    features: [
      'Standard BD survey constants: 1 শতক = 435.6 বর্গফুট, 1 কাঠা = 1.65 শতক = 720 বর্গফুট',
      '1 বিঘা = 20 কাঠা = 33 শতক = 14,400 বর্গফুট',
      '1 একর = 3 বিঘা 8 ছটাক = 100 শতক = 43,560 বর্গফুট',
      'Clear formula explanation with land registration guidelines'
    ],
    faqs: [
      {
        question: 'Is 1 শতাংশ and 1 শতক the same in Bangladesh?',
        answer: 'Yes! শতাংশ, শতক, and ডেসিমেল refer to the exact same land area measurement (435.6 square feet).'
      }
    ],
    relatedToolSlugs: ['bangla-english-typing', 'bangladesh-age-calculator', 'unit-converter']
  },
  {
    id: 'bangladesh-age-calculator',
    slug: 'bangladesh-age-calculator',
    name: 'Bangladesh Govt Job Age Calculator',
    category: 'bangladesh-tools',
    shortDescription: 'Calculate candidate age as of the specific recruitment circular cutoff date.',
    iconName: 'Briefcase',
    keywords: ['govt job age calculator', 'bcs age calculator', 'bangladesh job circular age', 'chakrir boyos hisab', 'age cutoff calculator'],
    popular: true,
    badge: 'চাকরির বয়স',
    seoTitle: 'Bangladesh Government Job Age Calculator — Official Circular Cutoff Date',
    seoDescription: 'Calculate your exact age as of official government job advertisement cutoff dates (e.g. 1st day of the month or circular deadline). Check eligibility for 30/32 year quotas.',
    howToUse: [
      'Enter your date of birth.',
      'Enter the cutoff date specified in the government job circular (e.g. 01-Jan-2026).',
      'Select quota eligibility category (General 30 years, Freedom Fighter/Disability 32 years).',
      'Instantly check exact age in Years, Months, Days and eligibility status.'
    ],
    features: [
      'Calculates exact age on official job circular cutoff dates',
      'Official quota threshold indicators: General (Max 30), Quota/Disability (Max 32)',
      'Clear Pass / Exceeded eligibility badge',
      'Exact difference breakdown down to the day'
    ],
    faqs: [
      {
        question: 'What is the standard government job cutoff age in Bangladesh?',
        answer: 'For general candidates the standard upper age limit is 30 years. For children of freedom fighters and candidates with disabilities, it is 32 years.'
      }
    ],
    relatedToolSlugs: ['age-calculator', 'bangla-english-typing', 'passport-photo-resizer']
  },
  {
    id: 'passport-photo-resizer',
    slug: 'passport-photo-resizer',
    name: 'Passport & NID Photo Resizer',
    category: 'bangladesh-tools',
    shortDescription: 'Resize photos for Bangladesh MRP/E-Passport (55x45mm), NID, and 300x80 signatures.',
    iconName: 'UserSquare',
    keywords: ['passport photo resizer', 'bangladesh passport photo size', 'nid photo size', 'signature resizer 300x80', 'photo 300x300'],
    popular: true,
    badge: 'পাসপোর্ট ও NID',
    seoTitle: 'Passport & NID Photo Resizer — 300x300 Photo & 300x80 Signature Tool',
    seoDescription: 'Crop and resize photos to official Bangladesh government recruitment, E-Passport, and NID standards. 300x300 pixel photo and 300x80 pixel signature resizer under 100KB.',
    howToUse: [
      'Upload your portrait photo or scanned signature.',
      'Pick a preset: BD Passport / Job (300x300 px), Signature (300x80 px), or Custom.',
      'Adjust crop area and preview output dimensions and target file size (<100 KB).',
      'Download ready-to-upload JPEG image.'
    ],
    features: [
      'Standard BD Job application preset: 300 x 300 pixels (Max 100 KB)',
      'Standard Signature application preset: 300 x 80 pixels (Max 60 KB)',
      'E-Passport standard dimension preset: 55mm x 45mm at 300 DPI',
      'Automatic file size constraint checking and compression'
    ],
    faqs: [
      {
        question: 'What are the photo specifications for Teletalk government job applications?',
        answer: 'Photos must be exactly 300 x 300 pixels (not exceeding 100 KB), and signatures must be exactly 300 x 80 pixels (not exceeding 60 KB).'
      }
    ],
    relatedToolSlugs: ['image-resizer', 'image-compressor', 'bangladesh-age-calculator']
  },

  // ------------------- AI TOOLS -------------------
  {
    id: 'ai-summarizer',
    slug: 'ai-summarizer',
    name: 'AI Text Summarizer & Rewriter',
    category: 'ai-tools',
    shortDescription: 'Summarize lengthy articles, rewrite text, and extract key bullet points using AI.',
    iconName: 'Sparkles',
    keywords: ['ai summarizer', 'text summarizer', 'ai rewriter', 'paraphraser', 'summarize article online'],
    popular: true,
    badge: 'AI Powered',
    seoTitle: 'AI Text Summarizer Online — Condense Articles & Key Insights',
    seoDescription: 'Summarize articles, research papers, and long documents into concise bullet points or short executive summaries. Fast, accurate, and free.',
    howToUse: [
      'Paste your article or draft into the text area.',
      'Select summary length: Short (1-2 sentences), Bullet Points, or Executive Summary.',
      'Click "Summarize Text" to receive structured highlights.',
      'Copy the output or download as notes.'
    ],
    features: [
      'Flexible output styles: Key Bullet Points, Concise Paragraph, or Executive Summary',
      'Tone adjustment: Neutral, Professional, or Casual',
      'Shows original word count vs summarized word count savings',
      'Client fallback mode and server-side API integration architecture'
    ],
    faqs: [
      {
        question: 'How does the AI summarizer work?',
        answer: 'It uses advanced natural language processing to extract primary themes, thesis statements, and supporting points while omitting fluff.'
      }
    ],
    relatedToolSlugs: ['word-counter', 'case-converter', 'markdown-converter']
  }
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find(t => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return TOOLS.filter(t => t.category === categoryId);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter(t => t.popular);
}
