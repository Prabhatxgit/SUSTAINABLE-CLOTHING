import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-surface text-ink border border-border shadow-lg rounded-[16px] animate-in slide-in-from-bottom-3 fade-in duration-200"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="shrink-0">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-danger" />
                ) : (
                  <Info className="w-5 h-5 text-primary" />
                )}
              </span>
              <p className="text-xs font-medium text-ink leading-tight line-clamp-2">
                {toast.message}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {toast.undoAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.undoAction?.();
                    removeToast(toast.id);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-white text-[11px] font-semibold hover:bg-accent/90 active:scale-95 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Undo
                </button>
              )}

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                className="p-1 text-ink-muted hover:text-ink rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
