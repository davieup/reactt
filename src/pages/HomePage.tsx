import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { PostCard } from '@/components/PostCard';
import { BottomNav } from '@/components/BottomNav';
import { NotificationBell } from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { user, logout } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <header className="sticky top-0 glass-effect border-b border-border p-4 z-10 flex justify-between items-center">
          <h1 className="text-xl font-bold">React</h1>
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>
        
        <main className="pb-20">
          <div className="space-y-0">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}