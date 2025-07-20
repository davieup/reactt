import React, { createContext, useContext, useState, useEffect } from 'react';
import { Community } from '@/types';

interface CommunityContextType {
  communities: Community[];
  createCommunity: (name: string, avatar: string, coverImage: string, hashtags: string[], bio?: string, links?: string[]) => void;
  updateCommunity: (communityId: string, updates: Partial<Community>) => void;
  deleteCommunity: (communityId: string) => void;
  followCommunity: (communityId: string, userId: string) => void;
  unfollowCommunity: (communityId: string, userId: string) => void;
  getCommunityById: (id: string) => Community | undefined;
  getFollowedCommunities: (userId: string) => Community[];
  searchCommunities: (query: string) => Community[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const savedCommunities = localStorage.getItem('communities');
    if (savedCommunities) {
      const parsedCommunities = JSON.parse(savedCommunities);
      const communitiesWithDates = parsedCommunities.map((community: any) => ({
        ...community,
        createdAt: new Date(community.createdAt)
      }));
      setCommunities(communitiesWithDates);
    }
  }, []);

  const saveCommunities = (updatedCommunities: Community[]) => {
    setCommunities(updatedCommunities);
    localStorage.setItem('communities', JSON.stringify(updatedCommunities));
  };

  const createCommunity = (name: string, avatar: string, coverImage: string, hashtags: string[], bio?: string, links?: string[]) => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const newCommunity: Community = {
      id: Date.now().toString(),
      name,
      avatar,
      coverImage,
      hashtags,
      creatorId: user.id,
      followers: [user.id], // Creator automatically follows the community
      createdAt: new Date(),
      bio,
      links: links?.filter(link => link.trim()) || []
    };

    const updatedCommunities = [...communities, newCommunity];
    saveCommunities(updatedCommunities);
  };

  const updateCommunity = (communityId: string, updates: Partial<Community>) => {
    const updatedCommunities = communities.map(community => {
      if (community.id === communityId) {
        return { ...community, ...updates };
      }
      return community;
    });
    saveCommunities(updatedCommunities);
  };

  const deleteCommunity = (communityId: string) => {
    const updatedCommunities = communities.filter(community => community.id !== communityId);
    saveCommunities(updatedCommunities);
  };

  const followCommunity = (communityId: string, userId: string) => {
    const updatedCommunities = communities.map(community => {
      if (community.id === communityId && !community.followers.includes(userId)) {
        return { ...community, followers: [...community.followers, userId] };
      }
      return community;
    });
    saveCommunities(updatedCommunities);
  };

  const unfollowCommunity = (communityId: string, userId: string) => {
    const updatedCommunities = communities.map(community => {
      if (community.id === communityId) {
        return { ...community, followers: community.followers.filter(id => id !== userId) };
      }
      return community;
    });
    saveCommunities(updatedCommunities);
  };

  const getCommunityById = (id: string) => {
    return communities.find(community => community.id === id);
  };

  const getFollowedCommunities = (userId: string) => {
    return communities.filter(community => community.followers.includes(userId));
  };

  const searchCommunities = (query: string) => {
    return communities.filter(community =>
      community.name.toLowerCase().includes(query.toLowerCase()) ||
      community.hashtags.some(hashtag => hashtag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  return (
    <CommunityContext.Provider value={{
      communities,
      createCommunity,
      updateCommunity,
      deleteCommunity,
      followCommunity,
      unfollowCommunity,
      getCommunityById,
      getFollowedCommunities,
      searchCommunities
    }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunities() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunities must be used within a CommunityProvider');
  }
  return context;
}