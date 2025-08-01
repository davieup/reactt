import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post } from '@/types';
import { useAuth } from './AuthContext';
import { usePosts } from './PostContext';

interface FeedAlgorithmContextType {
  getFeedPosts: (userId: string) => Post[];
  getPersonalizedFeed: (userId: string, limit?: number) => Post[];
}

const FeedAlgorithmContext = createContext<FeedAlgorithmContextType | undefined>(undefined);

// Distribuição de conteúdo (soma total: 100%)
const FEED_DISTRIBUTION = {
  FOLLOWED_USERS: 0.35,        // 35% - Usuários que o usuário segue
  GREEN_BADGE_USERS: 0.30,     // 30% - Usuários com selo verde (Founder)
  BLUE_BADGE_USERS: 0.25,      // 25% - Usuários com selo azul (Influencer)
  UNVERIFIED_USERS: 0.10       // 10% - Usuários não seguidos e não verificados
};

export function FeedAlgorithmProvider({ children }: { children: React.ReactNode }) {
  const { users } = useAuth();
  const { posts } = usePosts();

  // Função para calcular o score de um post baseado no usuário
  const calculatePostScore = (post: Post, currentUserId: string): number => {
    const postUser = users.find(u => u.id === post.userId);
    if (!postUser) return 0;

    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return 0;

    let score = 0;

    // 1. Posts de usuários seguidos (35%)
    if (currentUser.following.includes(postUser.id)) {
      score += 100 * FEED_DISTRIBUTION.FOLLOWED_USERS;
    }

    // 2. Posts de usuários com selo verde (30%)
    if (postUser.verified === "green") {
      score += 100 * FEED_DISTRIBUTION.GREEN_BADGE_USERS;
    }

    // 3. Posts de usuários com selo azul (25%)
    if (postUser.verified === "blue") {
      score += 100 * FEED_DISTRIBUTION.BLUE_BADGE_USERS;
    }

    // 4. Posts de usuários não verificados e não seguidos (10%)
    if (!postUser.verified && !currentUser.following.includes(postUser.id)) {
      score += 100 * FEED_DISTRIBUTION.UNVERIFIED_USERS;
    }

    // Bônus por engajamento
    const engagementRate = (post.likes.length + post.comments.length + post.reposts.length) / Math.max(post.viewedBy.length, 1);
    score += engagementRate * 10;

    // Bônus por recência (posts mais recentes têm prioridade)
    const hoursSincePost = (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 24 - hoursSincePost) * 2;

    return score;
  };

  // Função para distribuir posts baseado nos percentuais
  const distributePosts = (allPosts: Post[], currentUserId: string): Post[] => {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return allPosts;

    // Separar posts por categoria
    const followedPosts: Post[] = [];
    const greenBadgePosts: Post[] = [];
    const blueBadgePosts: Post[] = [];
    const unverifiedPosts: Post[] = [];

    allPosts.forEach(post => {
      const postUser = users.find(u => u.id === post.userId);
      if (!postUser) return;

      if (currentUser.following.includes(postUser.id)) {
        followedPosts.push(post);
      } else if (postUser.verified === "green") {
        greenBadgePosts.push(post);
      } else if (postUser.verified === "blue") {
        blueBadgePosts.push(post);
      } else {
        unverifiedPosts.push(post);
      }
    });

    // Calcular quantos posts de cada categoria devem aparecer
    const totalPosts = Math.min(allPosts.length, 50); // Limite de 50 posts
    const followedCount = Math.floor(totalPosts * FEED_DISTRIBUTION.FOLLOWED_USERS);
    const greenBadgeCount = Math.floor(totalPosts * FEED_DISTRIBUTION.GREEN_BADGE_USERS);
    const blueBadgeCount = Math.floor(totalPosts * FEED_DISTRIBUTION.BLUE_BADGE_USERS);
    const unverifiedCount = Math.floor(totalPosts * FEED_DISTRIBUTION.UNVERIFIED_USERS);

    // Ordenar posts por score dentro de cada categoria
    const sortByScore = (posts: Post[]) => 
      posts.sort((a, b) => calculatePostScore(b, currentUserId) - calculatePostScore(a, currentUserId));

    // Selecionar posts de cada categoria
    const selectedPosts: Post[] = [
      ...sortByScore(followedPosts).slice(0, followedCount),
      ...sortByScore(greenBadgePosts).slice(0, greenBadgeCount),
      ...sortByScore(blueBadgePosts).slice(0, blueBadgeCount),
      ...sortByScore(unverifiedPosts).slice(0, unverifiedCount)
    ];

    // Misturar posts para criar diversidade
    return shuffleArray(selectedPosts);
  };

  // Função para embaralhar array (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getFeedPosts = (userId: string): Post[] => {
    const currentUser = users.find(u => u.id === userId);
    if (!currentUser) return [];

    // Filtrar posts que não são do próprio usuário
    const availablePosts = posts.filter(post => post.userId !== userId);
    
    return distributePosts(availablePosts, userId);
  };

  const getPersonalizedFeed = (userId: string, limit: number = 20): Post[] => {
    const feedPosts = getFeedPosts(userId);
    return feedPosts.slice(0, limit);
  };

  return (
    <FeedAlgorithmContext.Provider value={{
      getFeedPosts,
      getPersonalizedFeed
    }}>
      {children}
    </FeedAlgorithmContext.Provider>
  );
}

export function useFeedAlgorithm() {
  const context = useContext(FeedAlgorithmContext);
  if (context === undefined) {
    throw new Error('useFeedAlgorithm must be used within a FeedAlgorithmProvider');
  }
  return context;
} 