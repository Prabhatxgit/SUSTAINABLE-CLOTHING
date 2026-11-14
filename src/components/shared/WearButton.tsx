import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface WearButtonProps {
  garmentIds: string[];
  onLogged?: () => void;
  className?: string;
  size?: 'md' | 'lg';
  labelOverride?: string;
}

export const WearButton: React.FC<WearButtonProps> = ({
  garmentIds,
  onLogged,
  className = '',
  size = 'lg',
  labelOverride,
}) => {
  const { logOutfit } = useApp();
  const [animating, setAnimating] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  const count = garmentIds.length;
  const isDisabled = count === 0;

  const handleClick = () => {
    if (isDisabled || animating) return;

    // Trigger signature scale down and check draw-in
    setAnimating(true);
    setJustLogged(true);

    try {
      logOutfit(garmentIds);
      if (onLogged) {
        onLogged();
      }
    } finally {
      setTimeout(() => {
        setAnimating(false);
        setJustLogged(false);
      }, 1200);
    }
  };

  const defaultLabel =
    count === 1
      ? 'I wore this today'
      : count > 1
      ? `I wore these (${count})`
      : 'Select what you wore';

  const label = labelOverride || defaultLabel;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={label}
      className={`relative inline-flex items-center justify-center font-medium select-none rounded-[14px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none shadow-sm ${
        animating ? 'scale-[0.96] bg-success text-white' : 'bg-primary text-primary-ink active:scale-[0.97]'
      } ${size === 'lg' ? 'h-13 px-6 text-base w-full' : 'h-11 px-5 text-sm'} ${className}`}
    >
      <span className="flex items-center gap-2">
        {justLogged ? (
          <Check className="w-5 h-5 stroke-[2.5] animate-in zoom-in-50 duration-200" />
        ) : null}
        <span>{justLogged ? 'Logged for today!' : label}</span>
      </span>
    </button>
  );
};
