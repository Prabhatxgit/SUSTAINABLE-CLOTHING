import React from 'react';
import { Home, Shirt, Plus, BarChart3, Repeat } from 'lucide-react';

export interface BottomNavProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeRoute, onNavigate }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'wardrobe', label: 'Closet', icon: Shirt },
    { id: 'add', label: 'Add', icon: Plus, isCenter: true },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'pass-it-on', label: 'Pass on', icon: Repeat },
  ];

  return (
    <>
      {/* Mobile Bottom Tab Bar (360px - 1023px) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/92 backdrop-blur-md border-t border-border pb-safe transition-colors"
      >
        <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRoute === tab.id;

            if (tab.isCenter) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.id)}
                  aria-label="Add new garment"
                  className="relative -top-3 flex items-center justify-center w-13 h-13 rounded-full bg-primary text-primary-ink shadow-lg shadow-primary/25 active:scale-90 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Plus className="w-7 h-7 stroke-[2.2]" />
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                aria-label={tab.label}
                className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors select-none active:scale-95 ${
                  isActive ? 'text-primary font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.2] fill-primary/15 scale-110' : 'stroke-[1.75]'
                  }`}
                />
                <span className="text-[10px] tracking-tight mt-1">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Left Rail (1024px and up) */}
      <aside
        aria-label="Desktop Sidebar Navigation"
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border flex-col justify-between p-6 z-40"
      >
        <div>
          {/* Logo brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center text-primary-ink font-display font-bold text-xl shadow-xs">
              W
            </div>
            <div>
              <span className="font-display font-bold text-lg text-ink block leading-tight">
                Wear More.
              </span>
              <span className="text-xs text-ink-muted">Waste Less</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRoute === tab.id;

              if (tab.isCenter) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onNavigate(tab.id)}
                    className="mt-2 mb-2 flex items-center gap-3 px-4 py-3 rounded-[14px] bg-primary text-primary-ink font-medium text-sm shadow-sm hover:opacity-95 active:scale-98 transition"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                    <span>Add Garment</span>
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-surface-2 text-primary font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-2/60'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-primary stroke-[2.2]' : 'stroke-[1.75]'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quiet footer footnote */}
        <div className="pt-4 border-t border-border/70 text-xs text-ink-muted">
          <p className="font-medium text-ink">Slow Fashion Pilot</p>
          <p className="text-[11px] text-ink-muted/80 mt-0.5">
            Wear clothes longer. Pass them on.
          </p>
        </div>
      </aside>
    </>
  );
};
