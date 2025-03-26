
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'warm';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  to,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all focus-ring';
  
  const variants = {
    primary: 'bg-guardian-500 text-white hover:bg-guardian-600 active:bg-guardian-700 disabled:bg-guardian-300',
    secondary: 'bg-guardian-50 text-guardian-700 hover:bg-guardian-100 active:bg-guardian-200 disabled:text-guardian-300',
    outline: 'bg-transparent border border-guardian-300 text-guardian-700 hover:bg-guardian-50 active:bg-guardian-100 disabled:text-guardian-300',
    ghost: 'bg-transparent text-guardian-700 hover:bg-guardian-50 active:bg-guardian-100 disabled:text-guardian-300',
    link: 'bg-transparent text-guardian-500 underline-offset-4 hover:underline p-0 h-auto disabled:text-guardian-300',
    warm: 'bg-warm-500 text-white hover:bg-warm-600 active:bg-warm-700 disabled:bg-warm-300',
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1.5 h-8',
    md: 'text-base px-4 py-2 h-10',
    lg: 'text-lg px-6 py-3 h-12',
    icon: 'w-10 h-10',
  };
  
  const buttonClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    isLoading && 'opacity-70 cursor-not-allowed',
    className
  );
  
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </Link>
    );
  }
  
  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
