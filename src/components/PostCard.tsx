import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { Post } from '@/types';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onRepost }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.(post.id);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-card hover:shadow-hover transition-all duration-200 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img 
          src={post.user.avatar} 
          alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{post.user.name}</span>
            {post.user.verified && (
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <span>@{post.user.username}</span>
            <span>•</span>
            <span>{formatTime(post.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-foreground leading-relaxed">{post.content}</p>
        {post.image && (
          <img 
            src={post.image} 
            alt="Post content"
            className="mt-3 w-full rounded-lg object-cover max-h-96"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-text-muted">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-muted ${
            isLiked ? 'text-red-500' : 'hover:text-red-500'
          }`}
        >
          <Heart 
            size={18} 
            className={isLiked ? 'fill-current' : ''} 
          />
          <span className="text-sm">{likes}</span>
        </button>

        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-muted hover:text-blue-500"
        >
          <MessageCircle size={18} />
          <span className="text-sm">{post.comments}</span>
        </button>

        <button
          onClick={() => onRepost?.(post.id)}
          className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-muted hover:text-green-500"
        >
          <Repeat2 size={18} />
          <span className="text-sm">{post.reposts}</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-muted">
          <Share size={18} />
        </button>
      </div>
    </div>
  );
}