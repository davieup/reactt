import { useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { User } from '@/types';

export function SearchPage() {
  const { users } = useAuth();
  const { getTrendingHashtags } = usePosts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.bio?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const trendingHashtags = getTrendingHashtags();

  const handleTrendClick = (hashtag: string) => {
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
    navigate(`/trend/${cleanHashtag}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              Results for "{searchQuery}"
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-card rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        {user.verified && (
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-text-muted text-sm">@{user.username}</p>
                      {user.bio && (
                        <p className="text-text-secondary text-sm mt-1">{user.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">No results found</p>
              </div>
            )}
          </div>
        ) : (
          /* Trending Topics */
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
                <p className="text-text-muted">Nenhuma trend no momento</p>
                <p className="text-text-muted text-sm mt-2">
                  Use hashtags nos seus posts para criar trends!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}