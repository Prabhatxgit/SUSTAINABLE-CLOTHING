import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftAddon,
  rightAddon,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `input_${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label
        htmlFor={inputId}
        className="text-xs font-medium text-ink-muted tracking-tight select-none"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {leftAddon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-ink-muted">
            {leftAddon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full h-11 px-3.5 ${leftAddon ? 'pl-9' : ''} ${
            rightAddon ? 'pr-10' : ''
          } bg-surface text-ink text-sm rounded-[14px] border transition-colors duration-150 placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50 disabled:bg-surface-2 ${
            error
              ? 'border-danger focus:ring-danger/30 focus:border-danger'
              : 'border-border'
          } ${className}`}
          {...props}
        />
        {rightAddon && (
          <div className="absolute right-3 flex items-center">
            {rightAddon}
          </div>
        )}
      </div>
      {error ? (
        <span className="text-xs text-danger font-medium">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-muted">{hint}</span>
      ) : null}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || `select_${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label
        htmlFor={selectId}
        className="text-xs font-medium text-ink-muted tracking-tight select-none"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full h-11 px-3.5 bg-surface text-ink text-sm rounded-[14px] border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50 disabled:bg-surface-2 ${
          error
            ? 'border-danger focus:ring-danger/30 focus:border-danger'
            : 'border-border'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-xs text-danger font-medium">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-muted">{hint}</span>
      ) : null}
    </div>
  );
};
