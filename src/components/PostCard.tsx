import React, { useState } from 'react';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { useCommunities } from '@/contexts/CommunityContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Repeat2, MoreHorizontal, Check, Send, Eye, Edit, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user, users } = useAuth();
  const { likePost, addComment, repost, deletePost, editPost, viewPost } = usePosts();
  const { getCommunityById } = useCommunities();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
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
    if (commentText.trim()) {
      addComment(post.id, user.id, commentText);
      setCommentText('');
    }
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
              {community && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-text-secondary">
                    {community.name}
                  </span>
                </>
              )}
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">
                {post.timestamp.toLocaleDateString('pt-BR')}
              </span>
              {postUser.verified && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </div>
            
            <div className="space-y-2">
              {isEditing ? (
                <div className="space-y-2">
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
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2 max-w-md">
              <Collapsible open={showComments} onOpenChange={setShowComments}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-accent group"
                  >
                    <MessageCircle className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{post.comments.length}</span>
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRepost}
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
                onClick={handleLike}
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
                    className="text-muted-foreground hover:text-foreground hover:bg-accent group"
                  >
                    <MoreHorizontal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {post.userId === user.id && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Collapsible open={showComments} onOpenChange={setShowComments}>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="flex space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex space-x-2">
                    <Input
                      placeholder="Adicionar comentário..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <Button size="sm" onClick={handleComment} disabled={!commentText.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {post.comments.map((comment) => {
                    const commentUser = users.find(u => u.id === comment.userId);
                    if (!commentUser) return null;
                    
                    return (
                      <div key={comment.id} className="flex space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={commentUser.avatar} />
                          <AvatarFallback>{commentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm">{commentUser.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp.toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}