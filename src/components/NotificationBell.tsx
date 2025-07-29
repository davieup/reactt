import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export function NotificationBell() {
  const { notifications, markAsRead, unreadCount } = useNotifications();
  const { users } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notificationId: string, notification: any) => {
    markAsRead(notificationId);
    
    // Navigate to the specific post or comment
    if (notification.commentId) {
      navigate(`/comment/${notification.commentId}`);
    } else if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
    setIsOpen(false);
  };

  const getNotificationText = (notification: any) => {
    const fromUser = users.find(u => u.id === notification.fromUserId);
    const userName = fromUser?.name || 'Usuário';

    switch (notification.type) {
      case 'like':
        return `${userName} curtiu seu post`;
      case 'comment':
        return `${userName} comentou em seu post`;
      case 'follow':
        return `${userName} começou a seguir você`;
      case 'repost':
        return `${userName} repostou seu post`;
      default:
        return 'Nova notificação';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>Notificações</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full mt-6">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma notificação ainda
              </p>
            ) : (
              notifications.map((notification) => {
                const fromUser = users.find(u => u.id === notification.fromUserId);
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      !notification.read ? 'bg-accent/50' : 'hover:bg-accent/30'
                    }`}
                    onClick={() => handleNotificationClick(notification.id, notification)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={fromUser?.avatar} />
                      <AvatarFallback>{fromUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        {getNotificationText(notification)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}