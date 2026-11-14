import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, RotateCcw } from 'lucide-react';

export interface ImageUploadProps {
  value: string;
  onChange: (imageSrc: string) => void;
  className?: string;
}

// Client-side compression function to WebP < 250KB
async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxEdge = 1200;
        if (width > maxEdge || height > maxEdge) {
          if (width > height) {
            height = Math.round((height * maxEdge) / width);
            width = maxEdge;
          } else {
            width = Math.round((width * maxEdge) / height);
            height = maxEdge;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to webp with 0.8 quality
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const SAMPLE_PRESETS = [
  { label: 'Denim', path: '/src/assets/images/denim_jacket_1792929903155.jpg' },
  { label: 'Linen', path: '/src/assets/images/linen_shirt_1792929903640.jpg' },
  { label: 'Wool', path: '/src/assets/images/wool_sweater_1792929904587.jpg' },
  { label: 'Boots', path: '/src/assets/images/chelsea_boots_1792929905119.jpg' },
  { label: 'Chinos', path: '/src/assets/images/cotton_chinos_1792929905043.jpg' },
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch {
      // Fallback to object URL
      onChange(URL.createObjectURL(file));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <span className="text-xs font-medium text-ink-muted text-left">
        Garment Photo
      </span>

      {/* 4:5 Aspect Ratio Box */}
      <div className="relative aspect-[4/5] w-full max-w-[340px] mx-auto rounded-[20px] overflow-hidden border-2 border-dashed border-border bg-surface-2 flex flex-col items-center justify-center p-4">
        {value ? (
          <>
            <img
              src={value}
              alt="Garment preview"
              className="w-full h-full object-cover rounded-[16px]"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/80 text-surface text-xs font-medium backdrop-blur-xs hover:bg-ink transition shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-primary mb-3 shadow-xs">
              <Camera className="w-7 h-7 stroke-[1.75]" />
            </div>
            <p className="text-sm font-semibold text-ink mb-1">
              {isProcessing ? 'Processing photo...' : 'Add a photo of your piece'}
            </p>
            <p className="text-xs text-ink-muted mb-4 max-w-[220px]">
              Natural lighting, laying flat or hanging on a hanger.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] bg-primary text-primary-ink text-xs font-medium hover:opacity-95 active:scale-95 transition"
              >
                <Camera className="w-4 h-4" />
                Camera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] bg-surface text-ink text-xs font-medium border border-border hover:bg-surface-2 active:scale-95 transition"
              >
                <ImageIcon className="w-4 h-4" />
                Gallery
              </button>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Quick sample pickers if user is prototyping / demoing */}
      <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-ink-muted mr-1">Presets:</span>
        {SAMPLE_PRESETS.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => onChange(sample.path)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-surface border border-border text-ink-muted hover:text-ink hover:border-primary/40 transition active:scale-95"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
};
