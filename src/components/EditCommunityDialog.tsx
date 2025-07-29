import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Hash, Trash2, Link, Plus } from 'lucide-react';
import { useCommunities } from '@/contexts/CommunityContext';
import { usePosts } from '@/contexts/PostContext';
import { Community } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditCommunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community;
}

export function EditCommunityDialog({ isOpen, onClose, community }: EditCommunityDialogProps) {
  const { updateCommunity, deleteCommunity } = useCommunities();
  const { getTrendingHashtags } = usePosts();
  const [name, setName] = useState(community.name);
  const [avatar, setAvatar] = useState(community.avatar);
  const [coverImage, setCoverImage] = useState(community.coverImage);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(community.hashtags);
  const [bio, setBio] = useState(community.bio || '');
  const [links, setLinks] = useState<string[]>(community.links?.length ? community.links : ['']);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const addLink = () => {
    if (links.length < 3) {
      setLinks([...links, '']);
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleUpdate = async () => {
    if (!name.trim() || selectedHashtags.length === 0) return;
    
    setIsUpdating(true);
    
    updateCommunity(community.id, {
      name,
      avatar,
      coverImage,
      hashtags: selectedHashtags,
      bio: bio.trim() || undefined,
      links: links.filter(link => link.trim())
    });
    
    setIsUpdating(false);
    onClose();
  };

  const handleDelete = () => {
    deleteCommunity(community.id);
    setShowDeleteDialog(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Edit Community</h2>
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
                Profile Photo
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
                    Update community profile photo
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

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio (Optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your community..."
              className="w-full px-3 py-2 bg-muted rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-text-muted resize-none"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-text-muted mt-1">{bio.length}/160</p>
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Link size={16} />
              Links (Optional)
            </label>
            <p className="text-sm text-text-muted mb-3">
              Add up to 3 links for your community
            </p>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 px-3 py-2 bg-muted rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-text-muted"
                  />
                  {links.length > 1 && (
                    <button
                      onClick={() => removeLink(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {links.length < 3 && (
                <button
                  onClick={addLink}
                  className="flex items-center gap-2 text-primary hover:bg-primary/10 px-3 py-2 rounded-xl transition-colors"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              )}
            </div>
          </div>

          {/* Update Button */}
            <button
              onClick={handleUpdate}
              disabled={!name.trim() || selectedHashtags.length === 0 || isUpdating}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Community'}
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Community
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Community</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this community? This action cannot be undone and all posts will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}