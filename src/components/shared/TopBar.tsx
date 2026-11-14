import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Moon,
  Sun,
  RotateCcw,
  LogOut,
  Sparkles,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

export interface TopBarProps {
  title: string;
  onNavigate: (route: string) => void;
  onSignOut: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onNavigate, onSignOut }) => {
  const {
    user,
    isDarkMode,
    toggleDarkMode,
    resetDemo,
    changeUser,
  } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const currencies = ['INR', 'USD', 'EUR', 'GBP'] as const;

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Title in Fraunces H1 */}
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-ink truncate">
          {title}
        </h1>

        {/* Right action group */}
        <div className="flex items-center gap-2 relative">
          <PWAInstallButton />

          {/* User Profile Avatar Trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="User account and settings"
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full bg-surface border border-border hover:border-ink/20 active:scale-95 transition"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-primary-ink text-xs font-bold flex items-center justify-center">
              {user.display_name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-ink hidden sm:inline">
              {user.display_name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
          </button>

          {/* User Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-64 rounded-[20px] bg-surface border border-border shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-border/70 mb-2">
                <p className="text-xs font-semibold text-ink">{user.display_name}</p>
                <p className="text-[11px] text-ink-muted">{user.timezone}</p>
              </div>

              {/* Currency Selector */}
              <div className="px-3 py-1.5">
                <span className="text-[11px] font-medium text-ink-muted block mb-1.5">
                  Currency Display
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => changeUser({ currency: curr })}
                      className={`py-1 text-xs font-medium rounded-lg transition ${
                        user.currency === curr
                          ? 'bg-primary text-primary-ink font-semibold'
                          : 'bg-surface-2 text-ink-muted hover:text-ink'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-2 border-t border-border/60" />

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => toggleDarkMode()}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2 rounded-xl transition"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-accent" />
                ) : (
                  <Moon className="w-4 h-4 text-ink-muted" />
                )}
                <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
              </button>

              {/* Styleguide link for design review */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate('styleguide');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2 rounded-xl transition"
              >
                <BookOpen className="w-4 h-4 text-ink-muted" />
                <span>Component Styleguide</span>
              </button>

              {/* Reset Demo Data */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  resetDemo();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2 rounded-xl transition"
              >
                <RotateCcw className="w-4 h-4 text-ink-muted" />
                <span>Reset demo state</span>
              </button>

              <div className="my-2 border-t border-border/60" />

              {/* Sign out */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
