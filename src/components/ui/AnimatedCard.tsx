
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  glassEffect?: boolean;
}

const AnimatedCard = ({
  children,
  className,
  delay = 0,
  hoverEffect = 'lift',
  glassEffect = false,
  ...props
}: AnimatedCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoverStyles = {
    lift: 'hover:-translate-y-2',
    glow: 'hover:shadow-lg hover:shadow-guardian-100/30',
    scale: 'hover:scale-[1.02]',
    none: ''
  };
  
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border p-6 shadow-sm transition-all duration-300 ease-out animate-fade-in',
        glassEffect && 'glassmorphism',
        hoverEffect !== 'none' && `${hoverStyles[hoverEffect]} cursor-pointer`,
        className
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
