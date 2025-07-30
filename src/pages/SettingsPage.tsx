import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useVerification } from '@/contexts/VerificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Camera, ArrowLeft, Trash2, Moon, Sun, Check, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VerificationBadge } from '@/components/VerificationBadge';

export function SettingsPage() {
  const { user, updateProfile, deleteAccount, logout, showDisplayName, setShowDisplayName } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { acquireGreenBadge, acquireBlueBadge, greenBadgeCount, isGreenBadgeAvailable } = useVerification();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileLink, setProfileLink] = useState(user?.profileLink || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [badgeMessage, setBadgeMessage] = useState('');
  const [showBadgeMessage, setShowBadgeMessage] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({
      name,
      bio,
      profileLink,
      avatar
    });
    navigate('/profile');
  };

  const handleDeleteAccount = () => {
    if (deleteAccount(deletePassword)) {
      setDeleteDialogOpen(false);
      navigate('/login');
    } else {
      setError('Incorrect password');
    }
  };

  const handleAcquireGreenBadge = () => {
    const result = acquireGreenBadge();
    setBadgeMessage(result.message);
    setShowBadgeMessage(true);
    setTimeout(() => setShowBadgeMessage(false), 5000);
  };

  const handleAcquireBlueBadge = () => {
    const result = acquireBlueBadge();
    setBadgeMessage(result.message);
    setShowBadgeMessage(true);
    setTimeout(() => setShowBadgeMessage(false), 5000);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

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
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Click to change profile picture
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={profileLink}
                    onChange={(e) => setProfileLink(e.target.value)}
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nome nos posts</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar nome de perfil em vez de nome de usuário
                  </p>
                </div>
                <Switch 
                  checked={showDisplayName} 
                  onCheckedChange={setShowDisplayName}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selos de Verificação</CardTitle>
              <CardDescription>
                Adquira selos especiais para destacar seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selo Verde */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <VerificationBadge verified="green" size="md" />
                    <div>
                      <h3 className="font-semibold">Selo Verde (Founder)</h3>
                      <p className="text-sm text-muted-foreground">
                        Disponível para os 100 primeiros usuários
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium">
                      {greenBadgeCount}/100 utilizados
                    </p>
                    <p className="text-xs text-muted-foreground">Gratuito</p>
                  </div>
                </div>
                
                {user?.verified === "green" ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Você possui o selo verde!</span>
                  </div>
                ) : (
                  <Button 
                    onClick={handleAcquireGreenBadge}
                    disabled={!isGreenBadgeAvailable()}
                    variant={isGreenBadgeAvailable() ? "default" : "outline"}
                    className="w-full"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Adquirir selo verde
                  </Button>
                )}
              </div>

              <Separator />

              {/* Selo Azul */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <VerificationBadge verified="blue" size="md" />
                    <div>
                      <h3 className="font-semibold">Selo Azul (Influencer)</h3>
                      <p className="text-sm text-muted-foreground">
                        Disponível para todos os usuários
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium">$3/mês</p>
                    <p className="text-xs text-muted-foreground">Em breve</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAcquireBlueBadge}
                  variant="outline"
                  className="w-full"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Adquirir selo azul
                </Button>
              </div>

              {showBadgeMessage && (
                <div className={`p-3 rounded-md text-sm ${
                  badgeMessage.includes('Parabéns') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {badgeMessage}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full"
              >
                Sign Out
              </Button>

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. All your data will be permanently removed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delete-password">Confirm your password</Label>
                      <Input
                        id="delete-password"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    {error && <p className="text-destructive text-sm">{error}</p>}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}