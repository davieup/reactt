import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PostComposer } from '@/components/PostComposer';
import { currentUser } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export function ComposePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePost = (content: string, image?: string) => {
    // In a real app, this would send to an API
    console.log('New post:', { content, image });
    
    toast({
      title: "Post created!",
      description: "Your post has been shared successfully.",
    });
    
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-foreground">New Post</h1>
        </div>
      </header>

      {/* Composer */}
      <main className="max-w-md mx-auto px-4 py-6">
        <PostComposer
          user={currentUser}
          onPost={handlePost}
          onCancel={handleCancel}
          placeholder="What's on your mind?"
        />
      </main>
    </div>
  );
}