import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { useCommunities } from '@/contexts/CommunityContext';
import { PostComposer } from '@/components/PostComposer';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function ComposePage() {
  const { user } = useAuth();
  const { addPost, addComment } = usePosts();
  const { getCommunityById } = useCommunities();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  if (!user) {
    navigate('/login');
    return null;
  }

  const communityId = searchParams.get('communityId');
  const postId = searchParams.get('postId');
  const type = searchParams.get('type');
  
  const community = communityId ? getCommunityById(communityId) : null;
  const isComment = type === 'comment' && postId;

  const handlePost = (content: string, image?: string, video?: string) => {
    if (isComment && postId) {
      addComment(postId, user.id, content, image, video);
    } else if (communityId && community) {
      const contentWithHashtags = content + ' ' + community.hashtags.map(tag => `#${tag}`).join(' ');
      addPost(user.id, contentWithHashtags, image, video, communityId);
    } else {
      addPost(user.id, content, image, video);
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4 z-10">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">
              {isComment ? 'Novo Comentário' : community ? `Post em ${community.name}` : 'Novo Post'}
            </h1>
          </div>
        </header>
        
        <main className="p-4">
          <PostComposer 
            onPost={handlePost} 
            placeholder={
              isComment 
                ? 'Escreva seu comentário...' 
                : community 
                  ? `O que está acontecendo em ${community.name}?`
                  : 'O que está acontecendo?'
            }
          />
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}