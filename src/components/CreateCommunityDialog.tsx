import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Hash } from 'lucide-react';
import { useCommunities } from '@/contexts/CommunityContext';
import { usePosts } from '@/contexts/PostContext';

interface CreateCommunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCommunityDialog({ isOpen, onClose }: CreateCommunityDialogProps) {
  const { createCommunity } = useCommunities();
  const { getTrendingHashtags } = usePosts();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const trendingHashtags = getTrendingHashtags();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const handleCreate = async () => {
    if (!name.trim() || selectedHashtags.length === 0) return;
    
    setIsCreating(true);
    
    // Use placeholder images if not provided
    const finalAvatar = avatar || `https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center`;
    const finalCover = coverImage || `https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=200&fit=crop&crop=center`;
    
    createCommunity(name, finalAvatar, finalCover, selectedHashtags);
    
    // Reset form
    setName('');
    setAvatar('');
    setCoverImage('');
    setSelectedHashtags([]);
    setIsCreating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Create Community</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X size={20} className="text-text-muted" />
            </button>
          </div>

        <div className="p-4 space-y-6">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Photo
            </label>
            <div className="relative">
              {coverImage ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden">
                  <img 
                    src={coverImage} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    <ImageIcon size={24} className="text-text-muted mb-2" />
                    <span className="text-sm text-text-muted">Add cover photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Community Photo
            </label>
            <div className="flex items-center gap-4">
              {avatar ? (
                <div className="relative">
                  <img 
                    src={avatar} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button
                    onClick={() => setAvatar('')}
                    className="absolute -top-1 -right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-border rounded-full cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload size={20} className="text-text-muted" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-text-muted">
                  Add a photo to represent your community
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Community Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name..."
              className="w-full px-3 py-2 bg-muted rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-text-muted"
              maxLength={50}
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Hash size={16} />
              Community Topics
            </label>
            <p className="text-sm text-text-muted mb-3">
              Select hashtags that represent your community
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map((trend) => (
                <button
                  key={trend.hashtag}
                  onClick={() => toggleHashtag(trend.hashtag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedHashtags.includes(trend.hashtag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-text-secondary hover:bg-muted/80'
                  }`}
                >
                  {trend.hashtag}
                </button>
              ))}
            </div>
            {selectedHashtags.length === 0 && (
              <p className="text-sm text-red-500 mt-2">
                Select at least one hashtag
              </p>
            )}
          </div>

          {/* Create Button */}
            <button
              onClick={handleCreate}
              disabled={!name.trim() || selectedHashtags.length === 0 || isCreating}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Community'}
            </button>
        </div>
      </div>
    </div>
  );
}