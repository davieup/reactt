import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, MessageCircle, Eye } from 'lucide-react';

export function CommentDetailPage() {
  const { commentId } = useParams<{ commentId: string }>();
  const navigate = useNavigate();
  const { user, users, showDisplayName } = useAuth();
  const { getCommentById, likeComment, viewComment } = usePosts();

  // Function to render text with hashtags
  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => 
      part.startsWith('#') ? 
        <span key={index} className="hashtag">{part}</span> : 
        part
    );
  };

  if (!user || !commentId) return null;

  const comment = getCommentById(commentId);
  if (!comment) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Resposta não encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  const commentUser = users.find(u => u.id === comment.userId);
  if (!commentUser) return null;

  const isLiked = comment.likes?.includes(user.id) || false;

  const handleLike = () => {
    likeComment(comment.id, user.id);
  };

  const handleReply = () => {
    navigate(`/compose?type=comment&commentId=${comment.id}&postId=${comment.postId}`);
  };

  const handleView = () => {
    viewComment(comment.id);
  };

  const handleViewReply = (replyId: string) => {
    navigate(`/comment/${replyId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <header className="sticky top-0 glass-effect border-b border-border px-4 py-3 z-10">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold">Resposta</h1>
          </div>
        </header>

        <main className="px-4">
          {/* Main Comment */}
          <div className="border-b border-border">
            <div className="py-3">
              <div className="flex items-start space-x-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={commentUser.avatar} />
                  <AvatarFallback>{commentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="font-semibold text-sm">
                      {showDisplayName ? commentUser.name : `@${commentUser.username}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-foreground text-base leading-relaxed">
                  {renderContentWithHashtags(comment.content)}
                </p>

                {comment.image && (
                  <div className="rounded-2xl overflow-hidden border mt-3">
                    <img 
                      src={comment.image} 
                      alt="Comment image" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {comment.video && (
                  <div className="rounded-2xl overflow-hidden border mt-3">
                    <video 
                      src={comment.video} 
                      controls 
                      className="w-full h-auto"
                    />
                  </div>
                )}

                <div className="flex items-center text-muted-foreground text-sm pt-3">
                  <span>{comment.timestamp.toLocaleDateString('pt-BR', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric', 
                    month: 'short',
                    year: '2-digit'
                  })}</span>
                  <span className="mx-2">·</span>
                  <span>{(comment.views || 0).toLocaleString()} Visualizações</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-border py-3">
            <div className="flex items-center justify-around text-sm">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{comment.replies?.length || 0}</span>
                <span className="text-muted-foreground">Respostas</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{comment.likes?.length || 0}</span>
                <span className="text-muted-foreground">Curtidas</span>
              </div>
            </div>
          </div>

          <div className="border-b border-border py-2">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-3"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-1 rounded-full p-3 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${
                  isLiked ? 'fill-current' : ''
                }`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-3"
              >
                <Eye className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="border-b border-border px-4 py-3">
            <div className="flex justify-center">
              <Button onClick={handleReply} className="rounded-full px-6">
                <MessageCircle className="w-4 h-4 mr-2" />
                Responder
              </Button>
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-0">
            {!comment.replies || comment.replies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">
                  Nenhuma resposta ainda. Seja o primeiro a responder!
                </p>
              </div>
            ) : (
              comment.replies.map((reply) => {
                const replyUser = users.find(u => u.id === reply.userId);
                if (!replyUser) return null;
                
                return (
                  <div key={reply.id} className="border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={replyUser.avatar} />
                        <AvatarFallback>{replyUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="font-semibold text-sm">
                            {showDisplayName ? replyUser.name : `@${replyUser.username}`}
                          </span>
                          <span className="text-muted-foreground text-sm">·</span>
                          <span className="text-muted-foreground text-sm">
                            {reply.timestamp.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-foreground text-sm leading-relaxed">{renderContentWithHashtags(reply.content)}</p>
                        
                        {reply.image && (
                          <div className="mt-2 rounded-2xl overflow-hidden border">
                            <img 
                              src={reply.image} 
                              alt="Reply content" 
                              className="w-full max-h-60 object-cover"
                            />
                          </div>
                        )}

                        {reply.video && (
                          <div className="mt-2 rounded-2xl overflow-hidden border">
                            <video 
                              src={reply.video} 
                              controls
                              className="w-full max-h-60"
                            />
                          </div>
                        )}

                        <div className="flex items-center mt-3 space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => likeComment(reply.id, user.id)}
                            className={`flex items-center space-x-1 rounded-full p-2 ${
                              reply.likes?.includes(user.id)
                                ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' 
                                : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${
                              reply.likes?.includes(user.id) ? 'fill-current' : ''
                            }`} />
                            {reply.likes && reply.likes.length > 0 && (
                              <span className="text-xs">{reply.likes.length}</span>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReply(reply.id)}
                            className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-2"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}