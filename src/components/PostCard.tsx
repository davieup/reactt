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

  const renderContent = (content: string) => {
    return content.split(/(\s+)/).map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index} className="hashtag">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <Card className="post-card border border-border mb-4 mx-4 smooth-transition">
      <CardContent className="p-6 space-y-4">
        {post.repostOf && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Repeat2 className="w-4 h-4" />
            <span>{postUser.name} repostou</span>
          </div>
        )}
        
        <div className="flex space-x-4">
          <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={postUser.avatar} />
            <AvatarFallback>{postUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-foreground text-lg">{postUser.name}</h3>
              <span className="text-muted-foreground text-base">@{postUser.username}</span>
              {postUser.verified && (
                <Check className="w-5 h-5 text-primary" />
              )}
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">
                {post.timestamp.toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            {community && (
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  📍 {community.name}
                </span>
              </div>
            )}
            
            <div className="space-y-4 cursor-pointer" onClick={handleComment}>
              {isEditing ? (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[100px] text-lg"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleEdit}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed text-lg">
                  {renderContent(post.content)}
                </p>
              )}
              
              {post.image && (
                <div className="rounded-2xl overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              {post.video && (
                <div className="rounded-2xl overflow-hidden">
                  <video 
                    src={post.video} 
                    controls
                    className="w-full max-h-96"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground py-2">
              <span>{post.views || 0} visualizações</span>
              <span>•</span>
              <span>{post.likes.length} curtidas</span>
              <span>•</span>
              <span>{post.comments.length} comentários</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="flex-1 text-muted-foreground hover:text-primary hover:bg-primary/10 group smooth-transition"
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Comentar</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRepost();
                }}
                className={`flex-1 group smooth-transition ${
                  isReposted 
                    ? 'text-green-600 hover:text-green-700 hover:bg-green-600/10' 
                    : 'text-muted-foreground hover:text-green-600 hover:bg-green-600/10'
                }`}
              >
                <Repeat2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Repostar</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`flex-1 group smooth-transition ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-600/10' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <Heart 
                  className={`w-5 h-5 mr-2 group-hover:scale-110 transition-transform ${
                    isLiked ? 'fill-current' : ''
                  }`} 
                />
                <span>Curtir</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent group smooth-transition"
                  >
                    <MoreHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform" />
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