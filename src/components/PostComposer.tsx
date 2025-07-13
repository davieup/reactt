import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, X } from 'lucide-react';

interface PostComposerProps {
  onPost?: () => void;
}

export function PostComposer({ onPost }: PostComposerProps) {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const maxLength = 500;

  if (!user) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (content.trim()) {
      addPost(content, image || undefined);
      setContent('');
      setImage(null);
      onPost?.();
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <Card className="border border-border shadow-soft">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que está acontecendo?"
              className="min-h-[120px] border-none resize-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
              maxLength={maxLength}
            />
            
            {image && (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Upload preview" 
                  className="w-full max-h-64 object-cover rounded-xl"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="p-2 rounded-full hover:bg-accent transition-colors">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${
                  content.length > maxLength * 0.9 
                    ? 'text-destructive' 
                    : content.length > maxLength * 0.7 
                    ? 'text-yellow-500' 
                    : 'text-muted-foreground'
                }`}>
                  {content.length}/{maxLength}
                </span>
                
                <Button 
                  onClick={handlePost}
                  disabled={!content.trim() || content.length > maxLength}
                  className="rounded-full px-6"
                >
                  Postar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}