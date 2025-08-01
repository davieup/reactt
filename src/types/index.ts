
export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  verified?: "green" | "blue" | boolean;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  image?: string;
  video?: string;
  timestamp: Date;
  likes?: string[];
  parentCommentId?: string;
  replies?: Comment[];
  views?: number;
  viewedBy?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'repost' | 'community_post' | 'new_post';
  fromUserId: string;
  postId?: string;
  commentId?: string;
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
  bio?: string;
  links?: string[];
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
  viewedBy: string[];
  communityId?: string;
}
