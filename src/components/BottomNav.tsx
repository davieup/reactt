import { Home, Search, Plus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Plus, label: 'New Post', path: '/compose' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border z-50">
      <div className="flex items-center justify-around py-3 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl smooth-transition ${
                isActive 
                  ? 'text-primary bg-primary/10 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105'
              }`}
            >
              <Icon 
                size={22} 
                className={`smooth-transition ${isActive ? 'fill-current' : ''}`} 
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}