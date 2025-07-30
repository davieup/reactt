import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ResponsiveContainer } from '@/components/ResponsiveLayout';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showBottomNav?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function AppLayout({
  children,
  showSidebar = true,
  showBottomNav = true,
  maxWidth = 'lg',
  padding = 'md',
}: AppLayoutProps) {
  const { isDesktop } = useResponsive();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Only on desktop */}
      {showSidebar && isDesktop && <Sidebar />}
      
      {/* Main Content */}
      <div className={`${isDesktop && showSidebar ? 'ml-64' : ''} min-h-screen`}>
        <ResponsiveContainer maxWidth={maxWidth} padding={padding}>
          {children}
        </ResponsiveContainer>
      </div>
      
      {/* Bottom Navigation - Only on mobile/tablet */}
      {showBottomNav && !isDesktop && <BottomNav />}
    </div>
  );
} 