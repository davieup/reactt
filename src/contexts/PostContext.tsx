import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '@/types';
import { useNotifications } from '@/contexts/NotificationContext';
import postImage1 from '@/assets/post-image-1.jpg';

interface PostContextType {
  posts: Post[];
  addPost: (content: string, image?: string, video?: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, content: string) => void;
  repost: (postId: string, userId: string) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, content: string) => void;
  viewPost: (postId: string) => void;
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

  const addPost = (content: string, image?: string, video?: string) => {
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
      views: 0
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
      viewPost
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