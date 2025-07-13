export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  reposts: number;
  isLiked?: boolean;
}