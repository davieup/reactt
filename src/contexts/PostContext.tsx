import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '@/types';
import { useMigration, migratePostsData } from '@/hooks/useMigration';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import postImage1 from '@/assets/post-image-1.jpg';

interface PostContextType {
  posts: Post[];
  addPost: (userId: string, content: string, image?: string, video?: string, communityId?: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, content: string, image?: string, video?: string, parentCommentId?: string) => void;
  repost: (postId: string, userId: string) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, content: string) => void;
  viewPost: (postId: string, userId?: string) => void;
  getTrendingHashtags: () => { hashtag: string; count: number }[];
  getPostsByHashtag: (hashtag: string) => Post[];
  likeComment: (commentId: string, userId: string) => void;
  getCommentById: (commentId: string) => Comment | null;
  viewComment: (commentId: string, userId?: string) => void;
}

const defaultPosts: Post[] = [];

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Migrate data when app version changes
  useMigration({
    version: '2.0.0',
    migrate: migratePostsData
  });
  const { addNotification } = useNotifications();
  const { users } = useAuth();

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      // Convert timestamp strings back to Date objects recursively
      const convertTimestamps = (comments: any[]): Comment[] => {
        return comments.map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
          replies: comment.replies ? convertTimestamps(comment.replies) : []
        }));
      };

      const postsWithDates = parsedPosts.map((post: any) => ({
        ...post,
        timestamp: new Date(post.timestamp),
        comments: convertTimestamps(post.comments || []),
        // Migrate old view system to new viewedBy system
        viewedBy: post.viewedBy || []
      }));
      setPosts(postsWithDates);
    } else {
      // Initialize with default posts if none exist
      setPosts(defaultPosts);
      localStorage.setItem('posts', JSON.stringify(defaultPosts));
    }
  }, []);

  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return content.match(hashtagRegex) || [];
  };

  const getTrendingHashtags = () => {
    const hashtagCount: { [key: string]: number } = {};
    
    // Contar hashtags dos últimos 7 dias
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    posts.forEach(post => {
      if (post.timestamp >= weekAgo) {
        const hashtags = extractHashtags(post.content);
        hashtags.forEach(hashtag => {
          const cleanHashtag = hashtag.toLowerCase();
          hashtagCount[cleanHashtag] = (hashtagCount[cleanHashtag] || 0) + 1;
        });
      }
    });

    return Object.entries(hashtagCount)
      .map(([hashtag, count]) => ({ hashtag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getPostsByHashtag = (hashtag: string) => {
    const cleanHashtag = hashtag.toLowerCase().startsWith('#') ? hashtag.toLowerCase() : `#${hashtag.toLowerCase()}`;
    return posts.filter(post => {
      const postHashtags = extractHashtags(post.content).map(h => h.toLowerCase());
      return postHashtags.includes(cleanHashtag);
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const addPost = (userId: string, content: string, image?: string, video?: string, communityId?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId,
      content,
      image,
      video,
      timestamp: new Date(),
      likes: [],
      comments: [],
      reposts: [],
      views: 0,
      viewedBy: [],
      communityId
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);

    // Add notifications for followers
    const currentUser = users.find(u => u.id === userId);
    if (currentUser) {
      currentUser.followers.forEach(followerId => {
        addNotification({
          type: communityId ? 'community_post' : 'new_post',
          userId: followerId,
          fromUserId: userId,
          postId: newPost.id,
          read: false
        });
      });
    }
  };

  const likePost = (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(userId)
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const addComment = (postId: string, userId: string, content: string, image?: string, video?: string, commentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      userId,
      content,
      timestamp: new Date(),
      likes: [],
      views: 0,
      image,
      video,
      replies: []
    };

    setPosts(currentPosts => {
      const updatedPosts = currentPosts.map(post => {
        if (post.id === postId) {
          if (commentId) {
            // Add reply to specific comment
            const addReplyToComment = (comments: Comment[]): Comment[] => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  // Add notification for reply to comment
                  if (comment.userId !== userId) {
                    addNotification({
                      type: 'comment',
                      userId: comment.userId,
                      fromUserId: userId,
                      postId: postId,
                      commentId: comment.id,
                      read: false
                    });
                  }
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), newComment]
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: addReplyToComment(comment.replies)
                  };
                }
                return comment;
              });
            };
            
            return {
              ...post,
              comments: addReplyToComment(post.comments)
            };
          } else {
            // Add comment to post
            // Add notification for comment on post
            if (post.userId !== userId) {
              addNotification({
                type: 'comment',
                userId: post.userId,
                fromUserId: userId,
                postId: postId,
                read: false
              });
            }
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
        }
        return post;
      });
      
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  const likeComment = (commentId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      const updateCommentLikes = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            const likes = comment.likes?.includes(userId)
              ? comment.likes.filter(id => id !== userId)
              : [...(comment.likes || []), userId];
            return { ...comment, likes };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateCommentLikes(comment.replies) };
          }
          return comment;
        });
      };
      return { ...post, comments: updateCommentLikes(post.comments) };
    });
    savePosts(updatedPosts);
  };

  const getCommentById = (commentId: string): Comment | null => {
    for (const post of posts) {
      const findComment = (comments: Comment[]): Comment | null => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            return comment;
          }
          if (comment.replies && comment.replies.length > 0) {
            const found = findComment(comment.replies);
            if (found) return found;
          }
        }
        return null;
      };
      const found = findComment(post.comments);
      if (found) return found;
    }
    return null;
  };

  const viewComment = (commentId: string, userId?: string) => {
    if (!userId) return;
    const updatedPosts = posts.map(post => {
      const updateCommentViews = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId && !comment.viewedBy?.includes(userId)) {
            return { 
              ...comment, 
              views: (comment.views || 0) + 1,
              viewedBy: [...(comment.viewedBy || []), userId]
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateCommentViews(comment.replies) };
          }
          return comment;
        });
      };
      return { ...post, comments: updateCommentViews(post.comments) };
    });
    savePosts(updatedPosts);
  };

  const repost = (postId: string, userId: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    // Check if already reposted
    if (originalPost.reposts.includes(userId)) {
      // Remove repost
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return { ...post, reposts: post.reposts.filter(id => id !== userId) };
        }
        return post;
      }).filter(post => !(post.repostOf === postId && post.userId === userId));
      savePosts(updatedPosts);
      return;
    }

    // Add repost
    const repostPost: Post = {
      id: Date.now().toString(),
      userId,
      content: originalPost.content,
      image: originalPost.image,
      video: originalPost.video,
      timestamp: new Date(),
      likes: [],
      comments: [],
      reposts: [],
      repostOf: postId,
      views: 0,
      viewedBy: []
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, reposts: [...post.reposts, userId] };
      }
      return post;
    });

    updatedPosts.unshift(repostPost);
    savePosts(updatedPosts);
  };

  const deletePost = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    savePosts(updatedPosts);
  };

  const editPost = (postId: string, content: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, content };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  const viewPost = (postId: string, userId?: string) => {
    if (!userId) return;
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // Only count view if user hasn't viewed this post before
        if (!post.viewedBy.includes(userId)) {
          return { 
            ...post, 
            views: post.views + 1,
            viewedBy: [...post.viewedBy, userId]
          };
        }
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  return (
    <PostContext.Provider value={{
      posts,
      addPost,
      likePost,
      addComment,
      repost,
      deletePost,
      editPost,
      viewPost,
      getTrendingHashtags,
      getPostsByHashtag,
      likeComment,
      getCommentById,
      viewComment
    }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}