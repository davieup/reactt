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

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'repost';
  fromUserId: string;
  postId?: string;
  timestamp: Date;
  read: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  video?: string;
  timestamp: Date;
  likes: string[];
  comments: Comment[];
  reposts: string[];
  repostOf?: string;
  views: number;
}