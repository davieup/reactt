import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Hash, Settings, ExternalLink } from 'lucide-react';
import { useCommunities } from '@/contexts/CommunityContext';
import { usePosts } from '@/contexts/PostContext';
import { useAuth } from '@/contexts/AuthContext';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { EditCommunityDialog } from '@/components/EditCommunityDialog';

export function CommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCommunityById, followCommunity, unfollowCommunity } = useCommunities();
  const { posts, addPost } = usePosts();
  const { currentUser, getUserById } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  

  const community = id ? getCommunityById(id) : null;
  const creator = community ? getUserById(community.creatorId) : null;
  const isFollowing = community && currentUser ? community.followers.includes(currentUser.id) : false;
  
  // Filter posts from this community
  const communityPosts = posts.filter(post => post.communityId === id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  useEffect(() => {
    if (!community) {
      navigate('/search');
    }
  }, [community, navigate]);

  if (!community || !currentUser) {
    return null;
  }

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowCommunity(community.id, currentUser.id);
    } else {
      followCommunity(community.id, currentUser.id);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/search')}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-foreground" />
              </button>
              <h1 className="text-xl font-bold text-foreground">{community.name}</h1>
            </div>
            {community.creatorId === currentUser.id && (
              <button
                onClick={() => setShowEditDialog(true)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Settings size={20} className="text-foreground" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* Community Info */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-muted overflow-hidden">
            <img 
              src={community.coverImage} 
              alt={`${community.name} cover`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Community Avatar */}
          <div className="absolute -bottom-8 left-4">
            <img 
              src={community.avatar} 
              alt={community.name}
              className="w-16 h-16 rounded-full border-4 border-background object-cover"
            />
          </div>
        </div>

        <div className="px-4 pt-12 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{community.name}</h2>
              <div className="flex items-center gap-2 text-text-muted text-sm mt-1">
                <Users size={16} />
                <span>{community.followers.length} followers</span>
              </div>
              {creator && (
                <p className="text-text-secondary text-sm mt-1">
                  Created by @{creator.username}
                </p>
              )}
            </div>
            
            {community.creatorId !== currentUser.id && (
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  isFollowing
                    ? 'bg-muted text-foreground hover:bg-muted/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Bio */}
          {community.bio && (
            <div className="mb-4">
              <p className="text-text-secondary text-sm">{community.bio}</p>
            </div>
          )}

          {/* Links */}
          {community.links && community.links.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {community.links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    <ExternalLink size={12} />
                    {new URL(link).hostname}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {community.hashtags.map((hashtag) => (
              <span
                key={hashtag}
                className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm text-blue-600"
              >
                <Hash size={12} />
                {hashtag.replace('#', '')}
              </span>
            ))}
          </div>

          {/* Create Post Button */}
          {isFollowing && (
            <Button
              onClick={() => navigate(`/compose?communityId=${id}`)}
              className="w-full mb-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post in Community
            </Button>
          )}
        </div>

        {/* Posts */}
        <div className="px-4 pb-20">
          {communityPosts.length > 0 ? (
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted">No posts yet</p>
              <p className="text-text-muted text-sm mt-2">
                Be the first to post in this community!
              </p>
            </div>
          )}
        </div>
      </main>

      {showEditDialog && (
        <EditCommunityDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          community={community}
        />
      )}
    </div>
  );
}