import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { PostCard } from '@/components/PostCard';
import { ArrowLeft, Settings, Check, Eye, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export function ProfilePage() {
  const { user } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const userPosts = posts.filter(post => post.userId === user.id);
  const userReposts = posts.filter(post => post.repostOf && post.userId === user.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // updateProfile({ avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{userPosts.length} posts</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main>
          {/* Profile Header */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="rounded-full px-6"
                onClick={() => navigate('/settings')}
              >
                Editar perfil
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                {user.verified && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className="text-muted-foreground">@{user.username}</p>
              {user.bio && <p className="text-foreground">{user.bio}</p>}
              {user.profileLink && (
                <a 
                  href={user.profileLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.profileLink}
                </a>
              )}
            </div>

            <div className="flex space-x-6 text-sm">
              <button 
                onClick={() => navigate('/follow')}
                className="hover:underline"
              >
                <span className="font-bold text-foreground">{user.following.length}</span>
                <span className="text-muted-foreground ml-1">Seguindo</span>
              </button>
              <button 
                onClick={() => navigate('/follow')}
                className="hover:underline"
              >
                <span className="font-bold text-foreground">{user.followers.length}</span>
                <span className="text-muted-foreground ml-1">Seguidores</span>
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="border-t border-border">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {userReposts.map((post) => (
              <PostCard key={`repost-${post.id}`} post={post} />
            ))}
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}