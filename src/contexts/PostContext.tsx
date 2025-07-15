import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '@/types';
import { useNotifications } from '@/contexts/NotificationContext';
import postImage1 from '@/assets/post-image-1.jpg';

interface PostContextType {
  posts: Post[];
  addPost: (content: string, image?: string, video?: string, communityId?: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, content: string) => void;
  repost: (postId: string, userId: string) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, content: string) => void;
  viewPost: (postId: string) => void;
  getTrendingHashtags: () => { hashtag: string; count: number }[];
  getPostsByHashtag: (hashtag: string) => Post[];
}

const defaultPosts: Post[] = [];

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      // Convert timestamp strings back to Date objects
      const postsWithDates = parsedPosts.map((post: any) => ({
        ...post,
        timestamp: new Date(post.timestamp),
        comments: post.comments.map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp)
        }))
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

  const addPost = (content: string, image?: string, video?: string, communityId?: string) => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      content,
      image,
      video,
      timestamp: new Date(),
      likes: [],
      comments: [],
      reposts: [],
      views: 0,
      communityId
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
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

  const addComment = (postId: string, userId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId,
      postId,
      content,
      timestamp: new Date()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
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
      views: 0
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

  const viewPost = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, views: post.views + 1 };
      }
      return post;
    });
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
      getPostsByHashtag
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