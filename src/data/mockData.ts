import { User, Post } from '@/types';
import profile1 from '@/assets/profile-1.jpg';
import profile2 from '@/assets/profile-2.jpg';
import profile3 from '@/assets/profile-3.jpg';
import postImage1 from '@/assets/post-image-1.jpg';

export const currentUser: User = {
  id: '1',
  username: 'johndoe',
  name: 'John Doe',
  avatar: profile1,
  bio: 'Passionate about technology, design, and coffee ☕️',
  verified: true,
};

export const users: User[] = [
  currentUser,
  {
    id: '2',
    username: 'sarahchen',
    name: 'Sarah Chen',
    avatar: profile2,
    bio: 'UX Designer • Building beautiful interfaces',
    verified: true,
  },
  {
    id: '3',
    username: 'alexsmith',
    name: 'Alex Smith',
    avatar: profile3,
    bio: 'Software Engineer • Love to code and learn',
  },
];

export const initialPosts: Post[] = [
  {
    id: '1',
    user: users[1],
    content: 'Just finished redesigning our mobile app interface! Really excited about the new user experience improvements. Clean design is everything ✨',
    image: postImage1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    comments: 5,
    reposts: 3,
    isLiked: false,
  },
  {
    id: '2',
    user: users[2],
    content: 'Working on a new React project today. The ecosystem just keeps getting better and better. TypeScript + React is such a powerful combination! 🚀',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 18,
    comments: 8,
    reposts: 2,
    isLiked: true,
  },
  {
    id: '3',
    user: currentUser,
    content: 'Beautiful morning coffee setup ☕️ There\'s something magical about starting the day with the perfect brew and some coding.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 42,
    comments: 12,
    reposts: 7,
    isLiked: false,
  },
  {
    id: '4',
    user: users[1],
    content: 'Minimalist design is not about having less. It\'s about making sure every element serves a purpose. Every pixel should earn its place.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    likes: 31,
    comments: 6,
    reposts: 9,
    isLiked: true,
  },
];