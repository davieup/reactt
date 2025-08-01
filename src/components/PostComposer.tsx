import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, VideoIcon, X } from 'lucide-react';

interface PostComposerProps {
  onPost?: (content: string, image?: string, video?: string) => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function PostComposer({ onPost, onCancel, placeholder = "O que está acontecendo?" }: PostComposerProps) {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const maxLength = 500;

  if (!user) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setVideo(null); // Clear video if image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideo(e.target?.result as string);
        setImage(null); // Clear image if video is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (content.trim()) {
      if (onPost) {
        onPost(content, image || undefined, video || undefined);
      } else {
        addPost(user.id, content, image || undefined, video || undefined);
      }
      setContent('');
      setImage(null);
      setVideo(null);
    }
  };

  const removeMedia = () => {
    setImage(null);
    setVideo(null);
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
              placeholder={placeholder}
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
                  onClick={removeMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {video && (
              <div className="relative">
                <video 
                  src={video} 
                  controls
                  className="w-full max-h-64 rounded-xl"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeMedia}
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
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <div className="p-2 rounded-full hover:bg-accent transition-colors">
                    <VideoIcon className="h-5 w-5 text-primary" />
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
                
                <div className="flex gap-2">
                  {onCancel && (
                    <Button 
                      variant="outline"
                      onClick={onCancel}
                      className="rounded-full px-6"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handlePost}
                    disabled={!content.trim() || content.length > maxLength}
                    className="rounded-full px-6"
                  >
                                            Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}