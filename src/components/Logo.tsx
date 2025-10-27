import React from 'react';
import logoImage from 'figma:asset/2bd7132737e2c03500698d426a242605ba811658.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', className = '', onClick, variant = 'light' }: LogoProps) {
  const sizes = {
    sm: {
      image: 'h-8',
      text: 'text-base',
      gap: 'gap-2'
    },
    md: {
      image: 'h-12',
      text: 'text-xl',
      gap: 'gap-3'
    },
    lg: {
      image: 'h-16',
      text: 'text-2xl',
      gap: 'gap-4'
    },
    xl: {
      image: 'h-20',
      text: 'text-3xl',
      gap: 'gap-4'
    },
  };

  const textColor = variant === 'dark' ? 'text-white' : 'text-primary';

  return (
    <div 
      className={`flex items-center ${sizes[size].gap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img 
        src={logoImage} 
        alt="EuroConnect Europe Logo" 
        className={`${sizes[size].image} w-auto`}
      />
      <span className={`${sizes[size].text} font-semibold ${textColor}`}>
        EuroConnect Europe
      </span>
    </div>
  );
}