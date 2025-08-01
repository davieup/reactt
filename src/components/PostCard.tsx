
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { useCommunities } from '@/contexts/CommunityContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat2, MoreHorizontal, Eye, Edit, Trash2, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { VerificationBadge } from './VerificationBadge';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { user, users, showDisplayName } = useAuth();
  const { likePost, repost, deletePost, editPost, viewPost, likeComment } = usePosts();
  const { getCommunityById } = useCommunities();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  if (!user) return null;

  const postUser = users.find(u => u.id === post.userId);
  if (!postUser) return null;

  const community = post.communityId ? getCommunityById(post.communityId) : null;
  const isLiked = post.likes.includes(user.id);
  const isReposted = post.reposts.includes(user.id);

  const handleLike = () => {
    likePost(post.id, user.id);
  };

  const handleRepost = () => {
    repost(post.id, user.id);
  };

  const handleComment = () => {
    navigate(`/post/${post.id}`);
  };

  const handleDelete = () => {
    deletePost(post.id);
  };

  const handleEdit = () => {
    if (editContent.trim()) {
      editPost(post.id, editContent);
      setIsEditing(false);
    }
  };

  const handleView = () => {
    viewPost(post.id, user.id);
    navigate(`/post/${post.id}`);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (postUser.id === user.id) {
      navigate('/profile');
    } else {
      navigate(`/profile/${postUser.id}`);
    }
  };

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (community) {
      navigate(`/community/${community.id}`);
    }
  };

  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => 
      part.startsWith('#') ? 
        <span key={index} className="hashtag">{part}</span> : 
        part
    );
  };

  return (
    <div className="px-2 sm:px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border">
      {post.repostOf && (
        <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-2 ml-8 sm:ml-10">
          <Repeat2 className="w-3 h-3" />
          <span>{showDisplayName ? postUser.name : `@${postUser.username}`} reposted</span>
        </div>
      )}
      
      <div className="flex space-x-2 sm:space-x-3">
        <Avatar 
          className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={handleProfileClick}
        >
          <AvatarImage src={postUser.avatar} />
          <AvatarFallback>{postUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground text-xs sm:text-sm">
                {showDisplayName ? postUser.name : `@${postUser.username}`}
              </span>
              <VerificationBadge verified={postUser.verified} size="sm" />
              <span className="text-muted-foreground text-xs sm:text-sm">·</span>
              <span className="text-muted-foreground text-xs sm:text-sm">
                {post.timestamp.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            {community && (
              <button 
                onClick={handleCommunityClick}
                className="p-1 text-primary hover:text-primary/80 transition-colors hover:bg-primary/10 rounded-full"
                title={community.name}
              >
                <Users size={isMobile ? 12 : 14} />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px] text-xs sm:text-sm"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleEdit}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-foreground text-xs sm:text-sm leading-relaxed">{renderContentWithHashtags(post.content)}</p>
            )}
            
            {post.image && (
              <div className="rounded-2xl overflow-hidden border mt-3">
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            {post.video && (
              <div className="rounded-2xl overflow-hidden border mt-3">
                <video 
                  src={post.video} 
                  controls
                  className="w-full max-h-80"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleComment();
              }}
              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-1 sm:p-2"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs hidden sm:inline">{post.comments.length}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRepost();
              }}
              className="flex items-center space-x-1 text-muted-foreground hover:text-green-500 hover:bg-green-500/10 rounded-full p-1 sm:p-2"
            >
              <Repeat2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs hidden sm:inline">{post.reposts.length}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center space-x-1 rounded-full p-1 sm:p-2 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' 
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${
                isLiked ? 'fill-current' : ''
              }`} />
              <span className="text-xs hidden sm:inline">{post.likes.length}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-1 sm:p-2"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs hidden sm:inline">{post.viewedBy.length}</span>
            </Button>

            {post.userId === user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-full p-1 sm:p-2"
                  >
                    <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}>
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }} className="text-destructive">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
