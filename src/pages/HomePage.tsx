
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { useFeedAlgorithm } from '@/contexts/FeedAlgorithmContext';
import { PostCard } from '@/components/PostCard';
import { ResponsiveHeader } from '@/components/ResponsiveHeader';
import { AppLayout } from '@/components/AppLayout';
import { VerificationInfo } from '@/components/VerificationInfo';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { user } = useAuth();
  const { getPersonalizedFeed } = useFeedAlgorithm();
  const navigate = useNavigate();
  const [showVerificationInfo, setShowVerificationInfo] = useState(true);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const personalizedPosts = getPersonalizedFeed(user.id, 30);
      setFeedPosts(personalizedPosts);
    }
  }, [user, getPersonalizedFeed]);

  return (
    <div className="bg-background pb-20 md:pb-0">
      <AppLayout showSidebar={true} showBottomNav={true}>
        <ResponsiveHeader />
        
        <main className="divide-y divide-border">
          {showVerificationInfo && (
            <div className="p-4">
              <VerificationInfo />
            </div>
          )}
          {feedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
      </AppLayout>
    </div>
  );
}
