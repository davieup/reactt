import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useCommunities } from '@/contexts/CommunityContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Home, Search, Plus, User } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, showDisplayName } = useAuth();
  const { isDesktop } = useResponsive();
  const { getFollowedCommunities } = useCommunities();

  if (!isDesktop || !user) {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Plus, label: 'New Post', path: '/compose' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const followedCommunities = getFollowedCommunities(user.id);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Reactt</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 h-12 ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Communities Followed */}
        <div className="flex-1 overflow-y-auto px-4">
                      <h2 className="text-xs font-semibold text-muted-foreground mt-4 mb-2 uppercase tracking-wider">My Communities</h2>
          {followedCommunities.length === 0 && (
                          <p className="text-xs text-muted-foreground">You are not following any communities yet.</p>
          )}
          <ul className="space-y-2">
            {followedCommunities.map((community) => (
              <li key={community.id}>
                <Button
                  variant={location.pathname === `/community/${community.id}` ? 'secondary' : 'ghost'}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-md"
                  onClick={() => navigate(`/community/${community.id}`)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={community.avatar} />
                    <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">{community.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {showDisplayName ? user.name : `@${user.username}`}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
} 