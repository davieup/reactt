import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { PostCard } from '@/components/PostCard';
import { ResponsiveHeader } from '@/components/ResponsiveHeader';
import { AppLayout } from '@/components/AppLayout';
import { VerificationInfo } from '@/components/VerificationInfo';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { user } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  const [showVerificationInfo, setShowVerificationInfo] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <AppLayout>
      <ResponsiveHeader />
        
        <main className="divide-y divide-border">
          {showVerificationInfo && (
            <div className="p-4">
              <VerificationInfo />
            </div>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
    </AppLayout>
  );
}