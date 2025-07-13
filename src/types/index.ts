export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  timestamp: Date;
  likes: string[];
  comments: Comment[];
  reposts: string[];
  repostOf?: string;
}