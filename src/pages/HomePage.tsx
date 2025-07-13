import { useState } from 'react';
import { PostCard } from '@/components/PostCard';
import { BottomNav } from '@/components/BottomNav';
import { initialPosts } from '@/data/mockData';
import { Post } from '@/types';

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

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
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Home</h1>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
            />
          ))}
        </div>

        {/* End of feed message */}
        <div className="text-center py-8">
          <p className="text-text-muted">You're all caught up! 🎉</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}