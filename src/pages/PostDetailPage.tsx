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
import { ArrowLeft, Heart, MessageCircle, Repeat2, Eye, Send, Image, Video, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user, users, showDisplayName } = useAuth();
  const { posts, addComment, likePost, repost, deletePost, editPost, likeComment, viewPost } = usePosts();
  const { getCommunityById } = useCommunities();
  
  
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

  if (!user || !postId) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const post = posts.find(p => p.id === postId);
  if (!post) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  const postUser = users.find(u => u.id === post.userId);
  if (!postUser) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  // Registrar visualização quando acessar a página
  React.useEffect(() => {
    if (user && postId) {
      viewPost(postId, user.id);
    }
  }, [postId, user?.id, viewPost]);

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
    navigate(`/compose?type=comment&postId=${post.id}`);
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
      <div className="max-w-full mx-auto">
        {/* Header */}
        <header className="sticky top-0 glass-effect border-b border-border px-4 py-3 z-10">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold">Post</h1>
          </div>
        </header>

        <main className="px-4">
          {/* Main Post */}
          <div className="border-b border-border">
            <div className="py-3">
              <div className="flex items-start space-x-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={postUser.avatar} />
                  <AvatarFallback>{postUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="font-semibold text-sm">
                      {showDisplayName ? postUser.name : `@${postUser.username}`}
                    </span>
                    {post.userId === user.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={startEdit}>
                            <Edit className="w-3 h-3 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {community && (
                    <p className="text-muted-foreground text-xs mb-1">
                      {community.name}
                    </p>
                  )}
                </div>
              </div>
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground text-base leading-relaxed">
                  {renderContentWithHashtags(post.content)}
                </p>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden border mt-3">
                    <img 
                      src={post.image} 
                      alt="Post image" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {post.video && (
                  <div className="rounded-2xl overflow-hidden border mt-3">
                    <video 
                      src={post.video} 
                      controls 
                      className="w-full h-auto"
                    />
                  </div>
                )}

                <div className="flex items-center text-muted-foreground text-sm pt-3">
                  <span>{post.timestamp.toLocaleDateString('pt-BR', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric', 
                    month: 'short',
                    year: '2-digit'
                  })}</span>
                  <span className="mx-2">·</span>
                  <span>{post.viewedBy.length.toLocaleString()} Views</span>
                </div>
              </div>
            )}
            </div>
          </div>
          <div className="border-b border-border py-3">
            <div className="flex items-center justify-around text-sm">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.reposts.length}</span>
                <span className="text-muted-foreground">Reposts</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.comments.length}</span>
                <span className="text-muted-foreground">Comments</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.likes.length}</span>
                <span className="text-muted-foreground">Likes</span>
              </div>
            </div>
          </div>

          <div className="border-b border-border py-2">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-3"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRepost}
                className="flex items-center space-x-1 text-muted-foreground hover:text-green-500 hover:bg-green-500/10 rounded-full p-3"
              >
                <Repeat2 className="w-5 h-5" />
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
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-3"
              >
                <Eye className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="border-b border-border px-4 py-3">
            <div className="flex justify-center">
              <Button onClick={handleComment} className="rounded-full px-6">
                <MessageCircle className="w-4 h-4 mr-2" />
                Responder
              </Button>
            </div>
          </div>
          <div className="space-y-0">
            {post.comments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">
                  No replies yet. Be the first to reply!
                </p>
              </div>
            ) : (
              post.comments.map((comment) => {
                const commentUser = users.find(u => u.id === comment.userId);
                if (!commentUser) return null;
                
                return (
                  <div key={comment.id} className="border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={commentUser.avatar} />
                        <AvatarFallback>{commentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="font-semibold text-sm">
                            {showDisplayName ? commentUser.name : `@${commentUser.username}`}
                          </span>
                          <span className="text-muted-foreground text-sm">·</span>
                          <span className="text-muted-foreground text-sm">
                            {comment.timestamp.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-foreground text-sm leading-relaxed">{renderContentWithHashtags(comment.content)}</p>
                        
                        {comment.image && (
                          <div className="mt-2 rounded-2xl overflow-hidden border">
                            <img 
                              src={comment.image} 
                              alt="Comment content" 
                              className="w-full max-h-60 object-cover"
                            />
                          </div>
                        )}

                        {comment.video && (
                          <div className="mt-2 rounded-2xl overflow-hidden border">
                            <video 
                              src={comment.video} 
                              controls
                              className="w-full max-h-60"
                            />
                          </div>
                        )}

                        <div className="flex items-center mt-3 space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => likeComment && likeComment(comment.id, user.id)}
                            className={`flex items-center space-x-1 rounded-full p-2 ${
                              comment.likes?.includes(user.id)
                                ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' 
                                : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${
                              comment.likes?.includes(user.id) ? 'fill-current' : ''
                            }`} />
                            {comment.likes && comment.likes.length > 0 && (
                              <span className="text-xs">{comment.likes.length}</span>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/comment/${comment.id}`)}
                            className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-2"
                          >
                            <Eye className="w-4 h-4" />
                            {comment.replies && comment.replies.length > 0 && (
                              <span className="text-xs">{comment.replies.length}</span>
                            )}
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
