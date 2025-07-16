import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { useCommunities } from '@/contexts/CommunityContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Repeat2, MoreHorizontal, Check, Eye, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { user, users } = useAuth();
  const { likePost, repost, deletePost, editPost, viewPost } = usePosts();
  const { getCommunityById } = useCommunities();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  if (!user) return null;

  const postUser = users.find(u => u.id === post.userId);
  if (!postUser) return null;

  const community = post.communityId ? getCommunityById(post.communityId) : null;
  const originalPost = post.repostOf ? users.find(u => u.id === post.repostOf) : null;
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
    viewPost(post.id);
  };

  // Increment views when component mounts
  React.useEffect(() => {
    handleView();
  }, []);

  return (
    <Card className="border-none border-b border-border last:border-b-0 rounded-none glass-effect">
      <CardContent className="p-4 space-y-3">
        {post.repostOf && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Repeat2 className="w-4 h-4" />
            <span>{postUser.name} repostou</span>
          </div>
        )}
        
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={postUser.avatar} />
            <AvatarFallback>{postUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">{postUser.name}</h3>
              <span className="text-muted-foreground">@{postUser.username}</span>
              {postUser.verified && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">
                {post.timestamp.toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            {community && (
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                  📍 {community.name}
                </span>
              </div>
            )}
            
            <div className="space-y-2" onClick={handleComment}>
              {isEditing ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleEdit}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed">{post.content}</p>
              )}
              
              {post.image && (
                <div className="rounded-2xl overflow-hidden bg-secondary">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              {post.video && (
                <div className="rounded-2xl overflow-hidden bg-secondary">
                  <video 
                    src={post.video} 
                    controls
                    className="w-full max-h-96"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2 max-w-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="text-muted-foreground hover:text-foreground hover:bg-accent group"
              >
                <MessageCircle className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{post.comments.length}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRepost();
                }}
                className={`group transition-colors ${
                  isReposted 
                    ? 'text-green-600 hover:text-green-700 hover:bg-green-600/10' 
                    : 'text-muted-foreground hover:text-green-600 hover:bg-green-600/10'
                }`}
              >
                <Repeat2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{post.reposts.length}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`group transition-colors ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-600/10' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <Heart 
                  className={`w-4 h-4 mr-1 group-hover:scale-110 transition-transform ${
                    isLiked ? 'fill-current' : ''
                  }`} 
                />
                <span className="text-sm">{post.likes.length}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-accent group"
              >
                <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{post.views || 0}</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent group"
                  >
                    <MoreHorizontal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {post.userId === user.id && (
                    <>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}