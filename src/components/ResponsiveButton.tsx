import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResponsiveButtonProps extends Omit<ButtonProps, 'size'> {
  mobileSize?: ButtonProps['size'];
  tabletSize?: ButtonProps['size'];
  desktopSize?: ButtonProps['size'];
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;
}

export function ResponsiveButton({
  children,
  mobileSize = 'sm',
  tabletSize = 'default',
  desktopSize = 'default',
  mobileClassName,
  tabletClassName,
  desktopClassName,
  showOnMobile = true,
  showOnTablet = true,
  showOnDesktop = true,
  className,
  ...props
}: ResponsiveButtonProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Determine if button should be shown
  if ((isMobile && !showOnMobile) || (isTablet && !showOnTablet) || (isDesktop && !showOnDesktop)) {
    return null;
  }

  // Determine size based on screen size
  let size: ButtonProps['size'] = 'default';
  if (isMobile) size = mobileSize;
  else if (isTablet) size = tabletSize;
  else if (isDesktop) size = desktopSize;

  // Determine responsive className
  let responsiveClassName = '';
  if (isMobile && mobileClassName) responsiveClassName = mobileClassName;
  else if (isTablet && tabletClassName) responsiveClassName = tabletClassName;
  else if (isDesktop && desktopClassName) responsiveClassName = desktopClassName;

  return (
    <Button
      size={size}
      className={cn(className, responsiveClassName)}
      {...props}
    >
      {children}
    </Button>
  );
}

interface ResponsiveIconButtonProps extends Omit<ButtonProps, 'size'> {
  icon: React.ReactNode;
  mobileSize?: ButtonProps['size'];
  tabletSize?: ButtonProps['size'];
  desktopSize?: ButtonProps['size'];
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;
}

export function ResponsiveIconButton({
  icon,
  mobileSize = 'icon-sm',
  tabletSize = 'icon',
  desktopSize = 'icon',
  showOnMobile = true,
  showOnTablet = true,
  showOnDesktop = true,
  className,
  ...props
}: ResponsiveIconButtonProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Determine if button should be shown
  if ((isMobile && !showOnMobile) || (isTablet && !showOnTablet) || (isDesktop && !showOnDesktop)) {
    return null;
  }

  // Determine size based on screen size
  let size: ButtonProps['size'] = 'icon';
  if (isMobile) size = mobileSize;
  else if (isTablet) size = tabletSize;
  else if (isDesktop) size = desktopSize;

  return (
    <Button
      size={size}
      className={className}
      {...props}
    >
      {icon}
    </Button>
  );
} 