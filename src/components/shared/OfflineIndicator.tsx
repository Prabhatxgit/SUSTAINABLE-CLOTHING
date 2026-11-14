import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white shadow-md animate-in slide-in-from-top-2 duration-200"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>You are offline — cached wardrobe ready to log.</span>
    </div>
  );
};
