import { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '@/components/PostCard';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { currentUser, initialPosts } from '@/data/mockData';
import { Post } from '@/types';

export function ProfilePage() {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Filter posts by current user
  const userPosts = initialPosts.filter(post => post.user.id === currentUser.id);
  const [posts, setPosts] = useState<Post[]>(userPosts);

  const handleLike = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-foreground">{currentUser.name}</h1>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="p-6 bg-card">
          <div className="flex items-start gap-4 mb-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
                {currentUser.verified && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-text-muted mb-3">@{currentUser.username}</p>
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
                className="px-6"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>

          {/* Bio */}
          {currentUser.bio && (
            <p className="text-foreground mb-4">{currentUser.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-bold text-foreground">127</span>{' '}
              <span className="text-text-muted">Following</span>
            </div>
            <div>
              <span className="font-bold text-foreground">1.2K</span>{' '}
              <span className="text-text-muted">Followers</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="px-4 py-4">
          <h3 className="text-lg font-bold text-foreground mb-4">Posts</h3>
          
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted mb-2">No posts yet</p>
              <Button onClick={() => navigate('/compose')}>
                Create your first post
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}