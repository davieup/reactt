
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function FollowPage() {
  const { user, users, followUser, unfollowUser } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  if (!user) {
    navigate('/login');
    return null;
  }

  // Determine which user's connections to show
  const targetUser = userId ? users.find(u => u.id === userId) : user;
  const isOwnConnections = !userId || userId === user.id;

  if (!targetUser) {
    navigate('/');
    return null;
  }

  const following = users.filter(u => targetUser.following.includes(u.id));
  const followers = users.filter(u => targetUser.followers.includes(u.id));

  const handleToggleFollow = (userIdToToggle: string) => {
    if (user.following.includes(userIdToToggle)) {
      unfollowUser(userIdToToggle);
    } else {
      followUser(userIdToToggle);
    }
  };

  const UserCard = ({ targetUserCard, showFollowButton = false }: { targetUserCard: any, showFollowButton?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="flex items-center justify-between p-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer flex-1"
          onClick={() => navigate(`/profile/${targetUserCard.id}`)}
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={targetUserCard.avatar} />
            <AvatarFallback>{targetUserCard.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold">{targetUserCard.name}</h3>
              {targetUserCard.verified && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{targetUserCard.username}</p>
            {targetUserCard.bio && (
              <p className="text-sm text-muted-foreground mt-1">{targetUserCard.bio}</p>
            )}
          </div>
        </div>
        {showFollowButton && targetUserCard.id !== user.id && (
          <Button
            variant={user.following.includes(targetUserCard.id) ? "outline" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFollow(targetUserCard.id);
            }}
          >
            {user.following.includes(targetUserCard.id) ? 'Following' : 'Follow'}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(isOwnConnections ? '/profile' : `/profile/${targetUser.id}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Conexões</h1>
            <p className="text-sm text-muted-foreground">
              {isOwnConnections ? 'Suas conexões' : `Conexões de ${targetUser.name}`}
            </p>
          </div>
        </div>

        <Tabs defaultValue="following" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="following">
                              Following ({following.length})
            </TabsTrigger>
            <TabsTrigger value="followers">
              Seguidores ({followers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following" className="space-y-4">
            {following.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {isOwnConnections ? 'You are not following anyone yet' : `${targetUser.name} is not following anyone yet`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              following.map(followedUser => (
                <UserCard 
                  key={followedUser.id} 
                  targetUserCard={followedUser} 
                  showFollowButton={true}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-4">
            {followers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {isOwnConnections ? 'You do not have any followers yet' : `${targetUser.name} does not have any followers yet`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              followers.map(follower => (
                <UserCard 
                  key={follower.id} 
                  targetUserCard={follower} 
                  showFollowButton={true}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
