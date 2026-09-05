import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Sliders, ShieldCheck, Check, Copy, Palette, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ImageToolProps {
  toolSlug: string;
}

export const ImageTools: React.FC<ImageToolProps> = ({ toolSlug }) => {
  const { showToast, trackEvent } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ name: string; width: number; height: number; size: number; type: string } | null>(null);

  // Compressor states
  const [quality, setQuality] = useState<number>(80);
  const [compressedBlob, setCompressedBlob] = useState<{ url: string; size: number; saved: number } | null>(null);

  // Resizer states
  const [resizeWidth, setResizeWidth] = useState<number>(800);
  const [resizeHeight, setResizeHeight] = useState<number>(600);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);

  // Converter format
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');

  // Cropper preset
  const [cropAspect, setCropAspect] = useState<'1:1' | '16:9' | '4:3' | '9:16' | 'free'>('1:1');

  // Color Picker & Palette
  const [pickedColor, setPickedColor] = useState<string>('#4f46e5');
  const [paletteColors, setPaletteColors] = useState<string[]>(['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']);

  // Handle uploaded image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = event => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setImageMeta({
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type,
        });
        setResizeWidth(img.naturalWidth);
        setResizeHeight(img.naturalHeight);
        setOriginalRatio(img.naturalWidth / img.naturalHeight);

        // Auto compress test
        processCompression(src, img.naturalWidth, img.naturalHeight, quality, file.size);

        // Auto extract palette
        extractPaletteFromImage(img);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Compression processing
  const processCompression = (src: string, w: number, h: number, q: number, origSize: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        blob => {
          if (!blob) return;
          const newSize = blob.size;
          const saved = Math.max(0, Math.round(((origSize - newSize) / origSize) * 100));
          const url = URL.createObjectURL(blob);
          setCompressedBlob({ url, size: newSize, saved });
        },
        'image/jpeg',
        q / 100
      );
    };
    img.src = src;
  };

  // Extract color palette
  const extractPaletteFromImage = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, 50, 50);
    const data = ctx.getImageData(0, 0, 50, 50).data;
    const extracted: string[] = [];

    for (let i = 0; i < data.length; i += 400) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      if (!extracted.includes(hex)) extracted.push(hex);
      if (extracted.length >= 6) break;
    }
    if (extracted.length > 0) setPaletteColors(extracted);
  };

  // Resize dimension changes
  const handleWidthChange = (w: number) => {
    setResizeWidth(w);
    if (aspectRatioLocked && originalRatio) {
      setResizeHeight(Math.round(w / originalRatio));
    }
  };

  const handleHeightChange = (h: number) => {
    setResizeHeight(h);
    if (aspectRatioLocked && originalRatio) {
      setResizeWidth(Math.round(h * originalRatio));
    }
  };

  const handleScalePreset = (percent: number) => {
    if (!imageMeta) return;
    const w = Math.round((imageMeta.width * percent) / 100);
    const h = Math.round((imageMeta.height * percent) / 100);
    setResizeWidth(w);
    setResizeHeight(h);
  };

  // Execute download for resized / converted / cropped
  const executeProcessAndDownload = () => {
    if (!imageSrc || !imageMeta) {
      showToast('Please upload an image first', 'error');
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetW = resizeWidth;
      let targetH = resizeHeight;
      let sx = 0,
        sy = 0,
        sWidth = img.naturalWidth,
        sHeight = img.naturalHeight;

      if (toolSlug === 'image-cropper') {
        if (cropAspect === '1:1') {
          const side = Math.min(img.naturalWidth, img.naturalHeight);
          sx = (img.naturalWidth - side) / 2;
          sy = (img.naturalHeight - side) / 2;
          sWidth = side;
          sHeight = side;
          targetW = 800;
          targetH = 800;
        } else if (cropAspect === '16:9') {
          const expectedH = (img.naturalWidth * 9) / 16;
          if (expectedH <= img.naturalHeight) {
            sx = 0;
            sy = (img.naturalHeight - expectedH) / 2;
            sWidth = img.naturalWidth;
            sHeight = expectedH;
          } else {
            const expectedW = (img.naturalHeight * 16) / 9;
            sx = (img.naturalWidth - expectedW) / 2;
            sy = 0;
            sWidth = expectedW;
            sHeight = img.naturalHeight;
          }
          targetW = 1280;
          targetH = 720;
        } else if (cropAspect === '4:3') {
          const expectedH = (img.naturalWidth * 3) / 4;
          sx = 0;
          sy = (img.naturalHeight - expectedH) / 2;
          sWidth = img.naturalWidth;
          sHeight = expectedH;
          targetW = 1024;
          targetH = 768;
        }
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);

      const mime = toolSlug === 'image-converter' ? targetFormat : 'image/jpeg';
      const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';

      canvas.toBlob(
        blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `processed-${imageMeta.name.split('.')[0]}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Image processed and downloaded!');
          trackEvent('image_action', 'ImageTools', toolSlug);
        },
        mime,
        quality / 100
      );
    };
    img.src = imageSrc;
  };

  // Generate Favicon assets
  const downloadFaviconSize = (size: number) => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favicon-${size}x${size}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${size}x${size} icon!`);
      }, 'image/png');
    };
    img.src = imageSrc;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div id="image-tool-container" className="space-y-6">
      {/* Privacy Guarantee */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          <strong>Private Canvas Processing:</strong> All image scaling, compression, and conversions execute locally on your device via HTML5 Canvas.
        </span>
      </div>

      {/* Dropzone */}
      <div
        id="image-dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            handleImageUpload({ target: { files: e.dataTransfer.files } } as any);
          }
        }}
        className="group relative cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-2xl p-6 sm:p-8 text-center transition-all bg-white dark:bg-neutral-900/50 hover:bg-indigo-50/20 shadow-xs"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png, image/webp, image/bmp"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {imageMeta ? 'Choose a different image' : 'Drag & Drop an image here'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              or click to browse from device (JPG, PNG, WebP)
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview & Details */}
      {imageSrc && imageMeta && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Image Preview */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center">
              <div className="max-h-72 overflow-hidden rounded-lg flex items-center justify-center bg-neutral-200/50 dark:bg-neutral-800/50 p-2 w-full">
                <img src={imageSrc} alt="Preview" className="max-h-64 object-contain rounded-md shadow-xs" />
              </div>
              <div className="w-full flex items-center justify-between text-xs text-neutral-500 mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span>Original: {imageMeta.width} x {imageMeta.height} px</span>
                <span>Size: {formatBytes(imageMeta.size)}</span>
              </div>
            </div>

            {/* Right: Controls based on Tool Slug */}
            <div className="space-y-4">
              {/* 1. COMPRESSOR */}
              {toolSlug === 'image-compressor' && (
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                      <span>Compression Quality</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={quality}
                      onChange={e => {
                        const q = parseInt(e.target.value);
                        setQuality(q);
                        processCompression(imageSrc, imageMeta.width, imageMeta.height, q, imageMeta.size);
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                      <span>Smaller File (Lower Quality)</span>
                      <span>Best Quality</span>
                    </div>
                  </div>

                  {compressedBlob && (
                    <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-neutral-500 block">Estimated Result</span>
                        <p className="text-base font-extrabold text-neutral-900 dark:text-white mt-0.5">
                          {formatBytes(compressedBlob.size)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">
                          Saved {compressedBlob.saved}%
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          -{formatBytes(imageMeta.size - compressedBlob.size)}
                        </span>
                      </div>
                    </div>
                  )}

                  <a
                    href={compressedBlob?.url || '#'}
                    download={`compressed-${imageMeta.name}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Compressed Image</span>
                  </a>
                </div>
              )}

              {/* 2. RESIZER */}
              {toolSlug === 'image-resizer' && (
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={resizeWidth}
                        onChange={e => handleWidthChange(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={resizeHeight}
                        onChange={e => handleHeightChange(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aspectRatioLocked}
                      onChange={e => setAspectRatioLocked(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Maintain original aspect ratio ({originalRatio.toFixed(2)}:1)</span>
                  </label>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                      Quick Percentage Presets
                    </span>
                    <div className="flex gap-2">
                      {[25, 50, 75, 150].map(pct => (
                        <button
                          key={pct}
                          onClick={() => handleScalePreset(pct)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold hover:border-indigo-500 transition"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={executeProcessAndDownload}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Resize & Download</span>
                  </button>
                </div>
              )}

              {/* 3. FORMAT CONVERTER */}
              {toolSlug === 'image-converter' && (
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                      Convert to Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'WebP (Recommended)', value: 'image/webp' },
                        { label: 'PNG (Lossless)', value: 'image/png' },
                        { label: 'JPG (Standard)', value: 'image/jpeg' },
                      ].map(fmt => (
                        <button
                          key={fmt.value}
                          onClick={() => setTargetFormat(fmt.value as any)}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                            targetFormat === fmt.value
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={executeProcessAndDownload}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Convert & Download</span>
                  </button>
                </div>
              )}

              {/* 4. CROPPER */}
              {toolSlug === 'image-cropper' && (
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                      Aspect Ratio Preset
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Square (1:1)', val: '1:1' },
                        { label: 'Widescreen (16:9)', val: '16:9' },
                        { label: 'Standard (4:3)', val: '4:3' },
                      ].map(item => (
                        <button
                          key={item.val}
                          onClick={() => setCropAspect(item.val as any)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                            cropAspect === item.val
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={executeProcessAndDownload}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Crop & Download Image</span>
                  </button>
                </div>
              )}

              {/* 5. FAVICON GENERATOR */}
              {toolSlug === 'favicon-generator' && (
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                    Download Standard Favicon Sizes
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[16, 32, 48, 180, 512].map(size => (
                      <button
                        key={size}
                        onClick={() => downloadFaviconSize(size)}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 transition"
                      >
                        <span className="font-semibold">{size}x{size} px</span>
                        <Download className="w-3.5 h-3.5 text-indigo-600" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block mb-1">HTML Code Snippet</span>
                    <pre className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono overflow-x-auto text-neutral-700 dark:text-neutral-300">
{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">`}
                    </pre>
                  </div>
                </div>
              )}

              {/* 6. COLOR PICKER & PALETTE */}
              {toolSlug === 'color-picker' && (
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                      Extracted Image Palette
                    </span>
                    <div className="flex gap-2">
                      {paletteColors.map((color, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setPickedColor(color);
                            navigator.clipboard.writeText(color);
                            showToast(`Copied ${color}!`);
                          }}
                          className="w-10 h-10 rounded-xl cursor-pointer shadow-xs hover:scale-110 transition-transform border border-black/10"
                          style={{ backgroundColor: color }}
                          title={`Click to copy ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <input
                      type="color"
                      value={pickedColor}
                      onChange={e => setPickedColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-mono font-bold block">{pickedColor}</span>
                      <span className="text-[11px] text-neutral-400">Selected Color</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pickedColor);
                        showToast(`Copied ${pickedColor}!`);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
