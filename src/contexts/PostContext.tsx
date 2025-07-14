import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '@/types';
import postImage1 from '@/assets/post-image-1.jpg';

interface PostContextType {
  posts: Post[];
  addPost: (content: string, image?: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, content: string) => void;
  repost: (postId: string, userId: string) => void;
}

const defaultPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    content: 'Ótimo dia para programar! Acabei de terminar um novo projeto em React. 🚀',
    image: postImage1,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    likes: ['2', '3'],
    comments: [
      {
        id: '1',
        userId: '2',
        postId: '1',
        content: 'Parabéns! Ficou incrível!',
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
      }
    ],
    reposts: []
  },
  {
    id: '2',
    userId: '2',
    content: 'Alguém mais está animado com as novas funcionalidades do React? 💡',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: ['1'],
    comments: [],
    reposts: []
  },
  {
    id: '3',
    userId: '3',
    content: 'Café da manhã perfeito para começar bem o dia! ☕',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    likes: ['1', '2'],
    comments: [],
    reposts: []
  }
];

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

  const addPost = (content: string, image?: string) => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      content,
      image,
      timestamp: new Date(),
      likes: [],
      comments: [],
      reposts: []
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
      timestamp: new Date(),
      likes: [],
      comments: [],
      reposts: [],
      repostOf: postId
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

  return (
    <PostContext.Provider value={{
      posts,
      addPost,
      likePost,
      addComment,
      repost
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