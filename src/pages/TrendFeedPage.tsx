import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePosts } from '@/contexts/PostContext';
import { useAuth } from '@/contexts/AuthContext';
import { PostCard } from '@/components/PostCard';

export function TrendFeedPage() {
  const { hashtag } = useParams<{ hashtag: string }>();
  const navigate = useNavigate();
  const { getPostsByHashtag } = usePosts();
  const { users } = useAuth();

  if (!hashtag) {
    navigate('/search');
    return null;
  }

  const posts = getPostsByHashtag(hashtag);
  const displayHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{displayHashtag}</h1>
              <p className="text-text-muted text-sm">{posts.length} posts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Posts Feed */}
      <main className="max-w-md mx-auto">
        {posts.length > 0 ? (
          <div className="space-y-0">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
                          <p className="text-text-muted text-lg">No posts found</p>
            <p className="text-text-muted text-sm mt-2">
              Be the first to post about {displayHashtag}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}