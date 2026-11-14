import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Eye, EyeOff, Sparkles, Shirt, Repeat, Award } from 'lucide-react';

export interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { user, changeUser, onboardUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('aarav@slowfashion.org');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('Aarav');
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [showOnboarding, setShowOnboarding] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (isSignUp && !name.trim()) {
      errs.name = 'Please provide your name';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isSignUp) {
      changeUser({
        display_name: name.trim(),
        onboarded: false,
      });
      setShowOnboarding(true);
    } else {
      if (!user.onboarded) {
        setShowOnboarding(true);
      } else {
        onSuccess();
      }
    }
  };

  const handleDemoSignIn = () => {
    changeUser({
      id: 'usr_aarav_demo',
      display_name: 'Aarav',
      currency: 'INR',
      onboarded: true,
    });
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <div className="w-full max-w-sm card-base p-8 text-center bg-surface">
        {/* App Mark */}
        <div className="w-14 h-14 rounded-2xl bg-primary text-primary-ink flex items-center justify-center mx-auto mb-4 shadow-sm font-display font-bold text-2xl">
          W
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink mb-1.5">
          Wear more.
        </h1>
        <h2 className="font-display text-xl md:text-2xl font-bold text-primary mb-2">
          Waste less.
        </h2>
        <p className="text-xs text-ink-muted mb-6">
          The slow fashion wardrobe companion that values every wear.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {isSignUp && (
            <Input
              label="Your Name"
              type="text"
              placeholder="e.g. Maya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="p-1 text-ink-muted hover:text-ink focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <Button type="submit" variant="primary" className="w-full mt-2">
            {isSignUp ? 'Create account' : 'Sign in'}
          </Button>

          <div className="relative my-2 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-surface px-2 text-[11px] text-ink-muted">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleDemoSignIn}
            className="w-full"
          >
            <span>Continue as Aarav (Demo User)</span>
          </Button>

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              className="text-xs text-ink-muted hover:text-primary transition"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </form>
      </div>

      {/* 3-Card Onboarding Sheet */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[24px] bg-surface p-6 shadow-2xl border border-border text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-surface-2 text-primary flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-display text-2xl font-bold text-ink mb-1">
              Welcome to Wear More
            </h3>
            <p className="text-xs text-ink-muted mb-6">
              Three simple steps to transform your relationship with your clothes.
            </p>

            <div className="grid grid-cols-1 gap-3 text-left mb-6">
              <div className="p-3.5 rounded-[16px] bg-surface-2/60 border border-border flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink">Add your pieces</h4>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Snap a quick photo and enter what you paid. No computer vision, just pure cataloging.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-[16px] bg-surface-2/60 border border-border flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink">Tap once a day</h4>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Log what you're wearing in one tap. Watch cost per wear plunge as streaks climb.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-[16px] bg-surface-2/60 border border-border flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/15 text-success flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink">Pass it on</h4>
                  <p className="text-xs text-ink-muted mt-0.5">
                    When a piece has served you well, donate it to an NGO partner or list at 20% resale.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                onboardUser();
                setShowOnboarding(false);
                onSuccess();
              }}
              className="w-full"
            >
              Start My Slow Wardrobe
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
