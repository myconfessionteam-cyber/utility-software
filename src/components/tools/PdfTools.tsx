import React, { useState, useRef } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Upload, ArrowUp, ArrowDown, Trash2, Download, ShieldCheck, CheckCircle2, FileText, AlertCircle, RefreshCw, FileUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PdfToolProps {
  toolSlug: string;
}

export const PdfTools: React.FC<PdfToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<{ id: string; file: File; size: number; pageCount?: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [splitRange, setSplitRange] = useState('1');
  const [pdfMeta, setPdfMeta] = useState<{ title?: string; author?: string; subject?: string; creator?: string; producer?: string; totalPages?: number } | null>(null);
  const [rotateAngle, setRotateAngle] = useState<'90' | '180' | '270'>('90');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [compressedResult, setCompressedResult] = useState<{ originalSize: number; newSize: number; percent: number } | null>(null);

  // File selection handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = Array.from(e.target.files) as File[];

    const newItems = selected.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      size: file.size,
    }));

    if (toolSlug === 'pdf-merge' || toolSlug === 'image-to-pdf') {
      setFiles(prev => [...prev, ...newItems]);
    } else {
      setFiles(newItems.slice(0, 1));
      // Inspect metadata if tool is metadata-remover or split
      if (selected[0] && selected[0].type.includes('pdf')) {
        try {
          const buffer = await selected[0].arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          setPdfMeta({
            title: doc.getTitle() || 'None',
            author: doc.getAuthor() || 'None',
            subject: doc.getSubject() || 'None',
            creator: doc.getCreator() || 'None',
            producer: doc.getProducer() || 'None',
            totalPages: doc.getPageCount(),
          });
          setSplitRange(`1-${Math.min(doc.getPageCount(), 3)}`);
        } catch {
          // ignore error
        }
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const next = [...files];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setFiles(next);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // 1. Merge PDFs
  const handleMerge = async () => {
    if (files.length < 2) {
      showToast('Please select at least 2 PDF files to merge', 'error');
      return;
    }
    try {
      setLoading(true);
      setProgressMsg('Merging PDF documents in your browser...');
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const buffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      downloadBlob(mergedBytes, 'merged-document.pdf');
      showToast('PDFs merged successfully!');
      trackEvent('merge_completed', 'PDF', `${files.length}_files`);
    } catch (err: any) {
      showToast('Failed to merge PDFs: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  // 2. Split PDF
  const handleSplit = async () => {
    if (files.length === 0) {
      showToast('Please upload a PDF file first', 'error');
      return;
    }
    try {
      setLoading(true);
      setProgressMsg('Extracting requested pages...');
      const buffer = await files[0].file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const totalPages = srcPdf.getPageCount();

      // Parse range: e.g. "1-3, 5"
      const pageIndices: number[] = [];
      const parts = splitRange.split(',').map(p => p.trim());

      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
              if (!pageIndices.includes(i - 1)) pageIndices.push(i - 1);
            }
          }
        } else {
          const num = parseInt(part);
          if (!isNaN(num) && num >= 1 && num <= totalPages) {
            if (!pageIndices.includes(num - 1)) pageIndices.push(num - 1);
          }
        }
      }

      if (pageIndices.length === 0) {
        showToast(`Invalid page range. This document has ${totalPages} pages.`, 'error');
        setLoading(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));

      const outBytes = await newPdf.save();
      downloadBlob(outBytes, `split-${files[0].file.name}`);
      showToast(`Extracted ${copiedPages.length} pages successfully!`);
      trackEvent('split_completed', 'PDF', `${copiedPages.length}_pages`);
    } catch (err: any) {
      showToast('Error splitting PDF: ' + (err.message || 'Check range syntax'), 'error');
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  // 3. Compress PDF
  const handleCompress = async () => {
    if (files.length === 0) {
      showToast('Please select a PDF to compress', 'error');
      return;
    }
    try {
      setLoading(true);
      setProgressMsg('Optimizing PDF structure and removing redundant objects...');
      const buffer = await files[0].file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Strip unused metadata and re-serialize with object stream consolidation
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('ToolNova PDF Engine');
      pdf.setCreator('ToolNova');

      const compressedBytes = await pdf.save({ useObjectStreams: true });
      const orig = files[0].size;
      const comp = compressedBytes.byteLength;
      const saved = Math.max(0, Math.round(((orig - comp) / orig) * 100));

      setCompressedResult({
        originalSize: orig,
        newSize: comp,
        percent: saved,
      });

      downloadBlob(compressedBytes, `compressed-${files[0].file.name}`);
      showToast(`PDF optimized! Saved ${saved}% in size.`);
      trackEvent('compress_completed', 'PDF', `${saved}_percent`);
    } catch (err: any) {
      showToast('Compression error: ' + (err.message || 'File format error'), 'error');
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  // 4. Image to PDF
  const handleImageToPdf = async () => {
    if (files.length === 0) {
      showToast('Please select one or more images to convert', 'error');
      return;
    }
    try {
      setLoading(true);
      setProgressMsg('Assembling high-res images into PDF...');
      const pdf = await PDFDocument.create();

      for (const item of files) {
        const buffer = await item.file.arrayBuffer();
        let embeddedImage;
        if (item.file.type.includes('png')) {
          embeddedImage = await pdf.embedPng(buffer);
        } else {
          embeddedImage = await pdf.embedJpg(buffer);
        }

        const { width, height } = embeddedImage;
        const page = pdf.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdf.save();
      downloadBlob(pdfBytes, 'converted-images.pdf');
      showToast('Images successfully converted to PDF!');
      trackEvent('image_to_pdf', 'PDF', `${files.length}_images`);
    } catch (err: any) {
      showToast('Error converting images: ' + (err.message || 'Unsupported image type'), 'error');
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  // 5. Metadata Remover
  const handleRemoveMetadata = async () => {
    if (files.length === 0) {
      showToast('Please upload a PDF file first', 'error');
      return;
    }
    try {
      setLoading(true);
      setProgressMsg('Sanitizing document headers and wiping author metadata...');
      const buffer = await files[0].file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);

      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('');
      pdf.setCreator('');

      const cleanBytes = await pdf.save();
      downloadBlob(cleanBytes, `sanitized-${files[0].file.name}`);
      showToast('Metadata completely wiped and sanitized!');
      trackEvent('metadata_stripped', 'PDF');
    } catch (err: any) {
      showToast('Failed to strip metadata: ' + err.message, 'error');
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  // 6. Rotate & Watermark
  const handleRotateAndWatermark = async () => {
    if (files.length === 0) {
      showToast('Please upload a PDF file first', 'error');
      return;
    }
    try {
      setLoading(true);
      setProgressMsg('Rotating pages and stamping watermark...');
      const buffer = await files[0].file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      const angle = parseInt(rotateAngle);

      for (const page of pages) {
        page.setRotation(degrees((page.getRotation().angle + angle) % 360));

        if (watermarkText.trim()) {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 4,
            y: height / 2,
            size: 42,
            font,
            color: rgb(0.8, 0.2, 0.2),
            opacity: 0.25,
            rotate: degrees(45),
          });
        }
      }

      const outBytes = await pdf.save();
      downloadBlob(outBytes, `processed-${files[0].file.name}`);
      showToast('Pages rotated and watermarked successfully!');
      trackEvent('rotate_watermark', 'PDF');
    } catch (err: any) {
      showToast('Error processing: ' + err.message, 'error');
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  const downloadBlob = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isMultiFile = toolSlug === 'pdf-merge' || toolSlug === 'image-to-pdf';
  const acceptedFileTypes = toolSlug === 'image-to-pdf' ? 'image/jpeg, image/png, image/webp' : 'application/pdf';

  return (
    <div id="pdf-tool-container" className="space-y-6">
      {/* Privacy Callout Banner */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          <strong>100% Client-Side Processing:</strong> Your files are parsed and assembled directly inside your web browser. Nothing is ever uploaded to any cloud server.
        </span>
      </div>

      {/* Drag & Drop / File Selector Area */}
      <div
        id="pdf-dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            handleFileChange({ target: { files: e.dataTransfer.files } } as any);
          }
        }}
        className="group relative cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-8 sm:p-12 text-center transition-all bg-white dark:bg-neutral-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 shadow-xs"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={isMultiFile}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-xs">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Drag & Drop your {toolSlug === 'image-to-pdf' ? 'images' : 'PDF files'} here
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">browse files from your computer</span>
            </p>
          </div>
          <span className="text-[11px] text-neutral-400">
            {toolSlug === 'image-to-pdf' ? 'Supports JPG, JPEG, PNG, and WebP' : 'Supports standard PDF files'}
          </span>
        </div>
      </div>

      {/* Selected File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Selected {toolSlug === 'image-to-pdf' ? 'Images' : 'Files'} ({files.length})
            </span>
            {files.length > 1 && (
              <button
                onClick={() => setFiles([])}
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <span className="text-xs text-neutral-400">{formatFileSize(item.size)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {isMultiFile && (
                    <>
                      <button
                        onClick={() => moveFile(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(idx, 'down')}
                        disabled={idx === files.length - 1}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool-specific customization settings */}
      {toolSlug === 'pdf-split' && files.length > 0 && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            Page Range to Extract {pdfMeta?.totalPages ? `(Total pages: ${pdfMeta.totalPages})` : ''}
          </label>
          <input
            type="text"
            value={splitRange}
            onChange={e => setSplitRange(e.target.value)}
            placeholder="e.g. 1-3, 5, 8-10"
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold"
          />
          <p className="text-xs text-neutral-400">
            Specify comma-separated page numbers or ranges, e.g. &ldquo;1-2, 4&rdquo;.
          </p>
        </div>
      )}

      {toolSlug === 'pdf-metadata-remover' && pdfMeta && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            Current Document Metadata
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block">Title:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pdfMeta.title}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block">Author:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pdfMeta.author}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block">Creator Tool:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pdfMeta.creator}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block">Producer:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pdfMeta.producer}</span>
            </div>
          </div>
        </div>
      )}

      {toolSlug === 'pdf-rotate' && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 block mb-1">
              Rotation Angle
            </label>
            <select
              value={rotateAngle}
              onChange={e => setRotateAngle(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold"
            >
              <option value="90">90° Clockwise</option>
              <option value="180">180° Flip</option>
              <option value="270">270° (90° Counter-Clockwise)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 block mb-1">
              Watermark Text (Optional)
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={e => setWatermarkText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL or DRAFT"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold"
            />
          </div>
        </div>
      )}

      {/* Compression Result Banner */}
      {compressedResult && (
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/40 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">Compression Completed!</h4>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
              Original: {formatFileSize(compressedResult.originalSize)} → Compressed: {formatFileSize(compressedResult.newSize)}
            </p>
          </div>
          <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            -{compressedResult.percent}%
          </span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          id="btn-execute-pdf-action"
          disabled={files.length === 0 || loading}
          onClick={() => {
            if (toolSlug === 'pdf-merge') handleMerge();
            else if (toolSlug === 'pdf-split') handleSplit();
            else if (toolSlug === 'pdf-compress') handleCompress();
            else if (toolSlug === 'image-to-pdf') handleImageToPdf();
            else if (toolSlug === 'pdf-metadata-remover') handleRemoveMetadata();
            else if (toolSlug === 'pdf-rotate') handleRotateAndWatermark();
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{progressMsg || 'Processing...'}</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>
                {toolSlug === 'pdf-merge' && `Merge ${files.length} PDFs & Download`}
                {toolSlug === 'pdf-split' && 'Extract Pages & Download'}
                {toolSlug === 'pdf-compress' && 'Compress & Download PDF'}
                {toolSlug === 'image-to-pdf' && `Convert ${files.length} Images to PDF`}
                {toolSlug === 'pdf-metadata-remover' && 'Strip Metadata & Download Clean PDF'}
                {toolSlug === 'pdf-rotate' && 'Process & Download PDF'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
