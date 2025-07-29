
import { useState } from 'react';
import { Search, X, TrendingUp, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { useCommunities } from '@/contexts/CommunityContext';
import { User, Community } from '@/types';
import { CreateCommunityDialog } from '@/components/CreateCommunityDialog';

export function SearchPage() {
  const { users, user, showDisplayName } = useAuth();
  const { getTrendingHashtags } = usePosts();
  const { communities, searchCommunities } = useCommunities();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [communityResults, setCommunityResults] = useState<Community[]>([]);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      const userResults = users.filter(userResult =>
        userResult.name.toLowerCase().includes(query.toLowerCase()) ||
        userResult.username.toLowerCase().includes(query.toLowerCase()) ||
        userResult.bio?.toLowerCase().includes(query.toLowerCase())
      );
      const commResults = searchCommunities(query);
      setSearchResults(userResults);
      setCommunityResults(commResults);
    } else {
      setSearchResults([]);
      setCommunityResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCommunityResults([]);
  };

  const handleUserProfileClick = (selectedUser: User) => {
    if (selectedUser.id === user?.id) {
      navigate('/profile');
    } else {
      navigate(`/profile/${selectedUser.id}`);
    }
  };

  const trendingHashtags = getTrendingHashtags();

  const handleTrendClick = (hashtag: string) => {
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
    navigate(`/trend/${cleanHashtag}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 overflow-y-auto">
      {/* Header */}
      <header className="glass-effect border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Search</h1>
          
          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search people and topics..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-muted rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-text-muted"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-background rounded-full transition-colors"
              >
                <X size={16} className="text-text-muted" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {searchQuery ? (
          /* Search Results */
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Results for "{searchQuery}"
            </h2>
            
            {/* Communities Results */}
            {communityResults.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Communities
                </h3>
                <div className="space-y-3">
                  {communityResults.map((community) => (
                    <div
                      key={community.id}
                      onClick={() => navigate(`/community/${community.id}`)}
                      className="flex items-center gap-3 p-3 bg-card rounded-xl hover:bg-muted transition-colors cursor-pointer"
                    >
                      <img 
                        src={community.avatar} 
                        alt={community.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{community.name}</p>
                        <p className="text-text-muted text-sm">{community.followers.length} followers</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {community.hashtags.slice(0, 2).map((hashtag) => (
                            <span key={hashtag} className="text-xs text-text-secondary bg-muted px-1 rounded">
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Users Results */}
            {searchResults.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-foreground mb-3">People</h3>
                <div className="space-y-3">
                  {searchResults.map((searchUser) => (
                    <div
                      key={searchUser.id}
                      onClick={() => handleUserProfileClick(searchUser)}
                      className="flex items-center gap-3 p-3 bg-card rounded-xl hover:bg-muted transition-colors cursor-pointer"
                    >
                      <img 
                        src={searchUser.avatar} 
                        alt={searchUser.name}
                        className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {showDisplayName ? searchUser.name : `@${searchUser.username}`}
                          </span>
                          {searchUser.verified && (
                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-text-muted text-sm">@{searchUser.username}</p>
                        {searchUser.bio && (
                          <p className="text-text-secondary text-sm mt-1">{searchUser.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.length === 0 && communityResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-text-muted">No results found</p>
              </div>
            )}
          </div>
        ) : (
          /* Trending Topics and Communities */
          <div className="space-y-6">
            {/* Trending Section */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Trending
              </h2>
              
              {trendingHashtags.length > 0 ? (
                <div className="space-y-2">
                  {trendingHashtags.map((trend, index) => (
                    <button
                      key={trend.hashtag}
                      onClick={() => handleTrendClick(trend.hashtag)}
                      className="block w-full text-left p-3 bg-card rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {trend.hashtag}
                          </p>
                          <p className="text-text-muted text-sm">
                            {trend.count} post{trend.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className="text-text-muted text-sm">
                          #{index + 1} trending
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp size={48} className="text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted">No trends at the moment</p>
                  <p className="text-text-muted text-sm mt-2">
                    Use hashtags in your posts to create trends!
                  </p>
                </div>
              )}
            </div>

            {/* Communities Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users size={20} />
                  Communities
                </h2>
                <button
                  onClick={() => setShowCreateCommunity(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} />
                  Create
                </button>
              </div>
              
              {communities.length > 0 ? (
                <div className="space-y-2">
                  {communities.slice(0, 5).map((community) => (
                    <button
                      key={community.id}
                      onClick={() => navigate(`/community/${community.id}`)}
                      className="block w-full text-left p-3 bg-card rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={community.avatar} 
                          alt={community.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {community.name}
                          </p>
                          <p className="text-text-muted text-sm">
                            {community.followers.length} followers
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted">No communities yet</p>
                  <p className="text-text-muted text-sm mt-2">
                    Create the first community!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
      
      {/* Create Community Dialog */}
      <CreateCommunityDialog 
        isOpen={showCreateCommunity}
        onClose={() => setShowCreateCommunity(false)}
      />
    </div>
  );
}
