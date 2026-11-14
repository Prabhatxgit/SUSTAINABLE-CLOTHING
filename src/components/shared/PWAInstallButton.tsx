import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          type="button"
          onClick={install}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-ink shadow-xs hover:opacity-95 active:scale-95 transition ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {isIOS && (
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-surface text-ink border border-border hover:bg-surface-2 active:scale-95 transition ${className}`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-surface p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-ink">
                Install on iPhone / iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full text-ink-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              To install <strong>Wear More</strong> as an app on your home screen:
            </p>
            <ol className="text-xs text-ink space-y-2 mb-6 list-decimal list-inside bg-surface-2 p-3.5 rounded-[14px]">
              <li>
                Tap the <strong>Share</strong> button in the Safari toolbar.
              </li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> in the top right corner.</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-[14px] bg-primary text-primary-ink text-sm font-medium hover:opacity-95 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
