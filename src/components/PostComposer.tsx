import { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { Button } from './ui/button';
import { User } from '@/types';

interface PostComposerProps {
  user: User;
  onPost: (content: string, image?: string) => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function PostComposer({ user, onPost, onCancel, placeholder = "What's happening?" }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxLength = 500;

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content.trim(), selectedImage || undefined);
      setContent('');
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isAtLimit = content.length >= maxLength;
  const isNearLimit = content.length >= maxLength * 0.8;

  return (
    <div className="bg-card rounded-xl p-4 shadow-card animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <span className="font-semibold text-foreground">{user.name}</span>
          <p className="text-text-muted text-sm">@{user.username}</p>
        </div>
      </div>

      {/* Composer */}
      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[120px] p-3 text-foreground placeholder-text-muted bg-muted rounded-lg border-none resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={maxLength}
        />

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative">
            <img 
              src={selectedImage} 
              alt="Selected"
              className="w-full max-h-64 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-text-muted hover:text-primary hover:bg-muted rounded-full transition-all duration-200"
            >
              <Image size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Character Counter */}
            <div className={`text-sm ${
              isAtLimit ? 'text-destructive' : 
              isNearLimit ? 'text-yellow-500' : 
              'text-text-muted'
            }`}>
              {content.length}/{maxLength}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {onCancel && (
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  className="px-6"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isAtLimit}
                className="px-6 bg-primary hover:bg-primary/90"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}