import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export function ResponsiveLayout({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getResponsiveClass = () => {
    if (isMobile && mobileClassName) return mobileClassName;
    if (isTablet && tabletClassName) return tabletClassName;
    if (isDesktop && desktopClassName) return desktopClassName;
    return '';
  };

  return (
    <div className={cn(className, getResponsiveClass())}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'lg',
  padding = 'md',
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getMaxWidthClass = () => {
    if (isMobile) return 'w-full';
    if (isTablet) return 'max-w-2xl mx-auto';
    if (isDesktop) {
      switch (maxWidth) {
        case 'sm': return 'max-w-sm mx-auto';
        case 'md': return 'max-w-md mx-auto';
        case 'lg': return 'max-w-lg mx-auto';
        case 'xl': return 'max-w-xl mx-auto';
        case '2xl': return 'max-w-2xl mx-auto';
        case 'full': return 'w-full';
        default: return 'max-w-lg mx-auto';
      }
    }
    return 'max-w-lg mx-auto';
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'px-2';
      case 'md': return 'px-4';
      case 'lg': return 'px-6';
      default: return 'px-4';
    }
  };

  return (
    <div className={cn(getMaxWidthClass(), getPaddingClass(), className)}>
      {children}
    </div>
  );
} 