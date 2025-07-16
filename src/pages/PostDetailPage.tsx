import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { useCommunities } from '@/contexts/CommunityContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Eye, Send, Image, Video, Trash2, Edit } from 'lucide-react';

export function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user, users } = useAuth();
  const { posts, addComment, likePost, repost, deletePost, editPost } = usePosts();
  const { getCommunityById } = useCommunities();
  const [commentText, setCommentText] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  // Function to render text with hashtags
  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => 
      part.startsWith('#') ? 
        <span key={index} className="hashtag">{part}</span> : 
        part
    );
  };

  if (!user || !postId) return null;

  const post = posts.find(p => p.id === postId);
  if (!post) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Post não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

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
    if (commentText.trim()) {
      addComment(post.id, user.id, commentText);
      setCommentText('');
    }
  };

  const handleDelete = () => {
    deletePost(post.id);
    navigate(-1);
  };

  const handleEdit = () => {
    if (editContent.trim()) {
      editPost(post.id, editContent);
      setIsEditing(false);
    }
  };

  const startEdit = () => {
    setEditContent(post.content);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="sticky top-0 glass-effect border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-lg font-semibold">Post</h1>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </header>

        <div className="p-3 space-y-4">
          {/* Main Post */}
          <Card className="post-card border border-border">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={postUser.avatar} />
                  <AvatarFallback>{postUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold">{postUser.name}</h2>
                      <p className="text-sm text-muted-foreground">@{postUser.username}</p>
                      {community && (
                        <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {community.name}
                        </span>
                      )}
                    </div>
                    {post.userId === user.id && (
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={startEdit}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px] text-base"
                          placeholder="O que está acontecendo?"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleEdit}>Salvar</Button>
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-base leading-relaxed">{renderContentWithHashtags(post.content)}</p>
                    )}
                    
                    {post.image && (
                      <div className="rounded-2xl overflow-hidden bg-secondary/50">
                        <img 
                          src={post.image} 
                          alt="Post content" 
                          className="w-full max-h-80 object-cover"
                        />
                      </div>
                    )}

                    {post.video && (
                      <div className="rounded-2xl overflow-hidden bg-secondary/50">
                        <video 
                          src={post.video} 
                          controls
                          className="w-full max-h-80"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{post.timestamp.toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-6 py-3 border-t border-border text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{post.views || 0} visualizações</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes.length} curtidas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length} comentários</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-around py-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`flex-1 ${
                        isLiked 
                          ? 'text-red-500 hover:text-red-600 hover:bg-red-600/10' 
                          : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      Curtir
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/compose?postId=${postId}&type=comment`)}
                      className="flex-1 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comentar
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRepost}
                      className={`flex-1 ${
                        isReposted 
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-600/10' 
                          : 'text-muted-foreground hover:text-green-600 hover:bg-green-600/10'
                      }`}
                    >
                      <Repeat2 className="w-4 h-4 mr-2" />
                      Repostar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold px-1">Comentários</h3>
            
            {/* Quick Comment */}
            <Card className="border border-border">
              <CardContent className="p-3">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Escreva um comentário..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[60px] resize-none text-sm"
                    />
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/compose?postId=${postId}&type=comment`)}
                        className="text-xs px-2"
                      >
                        <Image className="w-3.5 h-3.5 mr-1" />
                        Mídia
                      </Button>
                      <Button 
                        onClick={handleComment} 
                        disabled={!commentText.trim()}
                        size="sm"
                        className="text-xs px-3"
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.map((comment) => {
                const commentUser = users.find(u => u.id === comment.userId);
                if (!commentUser) return null;
                
                return (
                  <Card key={comment.id} className="border border-border">
                    <CardContent className="p-3">
                      <div className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={commentUser.avatar} />
                          <AvatarFallback>{commentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold">{commentUser.name}</h4>
                            <span className="text-xs text-muted-foreground">@{commentUser.username}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{renderContentWithHashtags(comment.content)}</p>
                          
                          {comment.image && (
                            <div className="mt-2 rounded-xl overflow-hidden bg-secondary/30">
                              <img 
                                src={comment.image} 
                                alt="Comment content" 
                                className="w-full max-h-40 object-cover"
                              />
                            </div>
                          )}

                          {comment.video && (
                            <div className="mt-2 rounded-xl overflow-hidden bg-secondary/30">
                              <video 
                                src={comment.video} 
                                controls
                                className="w-full max-h-40"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {post.comments.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum comentário ainda</p>
                <p className="text-xs">Seja o primeiro a comentar!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}