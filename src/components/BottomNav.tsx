import { Home, Search, Plus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Plus, label: 'New Post', path: '/compose' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  // Hide bottom nav on desktop
  if (isDesktop) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border z-50">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                size={isMobile ? 20 : 24} 
                className={isActive ? 'fill-current' : ''} 
              />
              <span className="text-xs font-medium hidden sm:block">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}