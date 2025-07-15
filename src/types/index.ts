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
  type: 'like' | 'comment' | 'follow' | 'repost' | 'community_post';
  fromUserId: string;
  postId?: string;
  communityId?: string;
  timestamp: Date;
  read: boolean;
}

export interface Community {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  hashtags: string[];
  creatorId: string;
  followers: string[];
  createdAt: Date;
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
  communityId?: string;
}