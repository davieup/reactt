import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FollowPage() {
  const { user, users, followUser, unfollowUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const following = users.filter(u => user.following.includes(u.id));
  const followers = users.filter(u => user.followers.includes(u.id));

  const handleToggleFollow = (userId: string) => {
    if (user.following.includes(userId)) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  const UserCard = ({ targetUser, showFollowButton = false }: { targetUser: any, showFollowButton?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={targetUser.avatar} />
            <AvatarFallback>{targetUser.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold">{targetUser.name}</h3>
              {targetUser.verified && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{targetUser.username}</p>
            {targetUser.bio && (
              <p className="text-sm text-muted-foreground mt-1">{targetUser.bio}</p>
            )}
          </div>
        </div>
        {showFollowButton && (
          <Button
            variant={user.following.includes(targetUser.id) ? "outline" : "default"}
            size="sm"
            onClick={() => handleToggleFollow(targetUser.id)}
          >
            {user.following.includes(targetUser.id) ? 'Seguindo' : 'Seguir'}
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
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Conexões</h1>
        </div>

        <Tabs defaultValue="following" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="following">
              Seguindo ({following.length})
            </TabsTrigger>
            <TabsTrigger value="followers">
              Seguidores ({followers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following" className="space-y-4">
            {following.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Você ainda não está seguindo ninguém</p>
                </CardContent>
              </Card>
            ) : (
              following.map(followedUser => (
                <UserCard 
                  key={followedUser.id} 
                  targetUser={followedUser} 
                  showFollowButton={true}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-4">
            {followers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Você ainda não tem seguidores</p>
                </CardContent>
              </Card>
            ) : (
              followers.map(follower => (
                <UserCard 
                  key={follower.id} 
                  targetUser={follower} 
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