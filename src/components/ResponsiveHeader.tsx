import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ResponsiveContainer } from '@/components/ResponsiveLayout';
import { ResponsiveIconButton } from '@/components/ResponsiveButton';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/NotificationBell';
import { 
  LogOut, 
  Menu, 
  Search, 
  Plus, 
  Bell,
  User,
  Settings
} from 'lucide-react';

interface ResponsiveHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showSearchButton?: boolean;
  showNewPostButton?: boolean;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
}

export function ResponsiveHeader({
  title = 'Reactt',
  showBackButton = false,
  onBackClick,
  showSearchButton = true,
  showNewPostButton = true,
  showMenuButton = false,
  onMenuClick,
}: ResponsiveHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const handleNewPost = () => {
    navigate('/compose');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="sticky top-0 glass-effect border-b border-border z-10">
      <ResponsiveContainer padding="md">
        <div className="flex items-center justify-between py-3">
          {/* Left Section */}
          <div className="flex items-center space-x-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onBackClick}
                className="mr-2"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            
            {showMenuButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onMenuClick}
                className="mr-2"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>

          {/* Center Section - Only on desktop */}
          {isDesktop && (
            <div className="flex-1 max-w-md mx-auto hidden lg:block">
              {/* Search bar or other content can go here */}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile: Show action buttons */}
            {isMobile && (
              <>
                {showSearchButton && (
                  <ResponsiveIconButton
                    variant="ghost"
                    icon={<Search className="w-4 h-4" />}
                    onClick={handleSearch}
                  />
                )}
                
                {showNewPostButton && (
                  <ResponsiveIconButton
                    variant="ghost"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={handleNewPost}
                  />
                )}
                
                <ResponsiveIconButton
                  variant="ghost"
                  icon={<User className="w-4 h-4" />}
                  onClick={handleProfile}
                />
              </>
            )}

            {/* Tablet/Desktop: Show notification bell and logout */}
            {(isTablet || isDesktop) && (
              <>
                <NotificationBell />
                <ResponsiveIconButton
                  variant="ghost"
                  icon={<Settings className="w-4 h-4" />}
                  onClick={handleSettings}
                />
                <ResponsiveIconButton
                  variant="ghost"
                  icon={<LogOut className="w-4 h-4" />}
                  onClick={handleLogout}
                />
              </>
            )}
          </div>
        </div>
      </ResponsiveContainer>
    </header>
  );
} 