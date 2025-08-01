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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileLink">Profile Link</Label>
                <Input
                  id="profileLink"
                  value={profileLink}
                  onChange={(e) => setProfileLink(e.target.value)}
                  placeholder="https://your-website.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={avatar || '/placeholder.svg'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how your profile appears to others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Display Name Instead of Username</Label>
                  <p className="text-sm text-muted-foreground">
                    Show your full name instead of username in posts
                  </p>
                </div>
                <Switch
                  checked={showDisplayName}
                  onCheckedChange={setShowDisplayName}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose your preferred theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={toggleTheme} variant="outline" className="w-full">
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </Button>
            </CardContent>
          </Card>

          {/* Verification Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Badges</CardTitle>
              <CardDescription>
                Acquire special badges to highlight your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Green Badge (Founder)</p>
                    <p className="text-sm text-muted-foreground">
                      Available for the first 100 users - {greenBadgeCount}/100 used
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAcquireGreenBadge}
                  disabled={!isGreenBadgeAvailable}
                  variant="outline"
                  size="sm"
                >
                  {isGreenBadgeAvailable ? 'Acquire' : 'Unavailable'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Blue Badge (Influencer)</p>
                    <p className="text-sm text-muted-foreground">
                      Premium verification badge
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAcquireBlueBadge}
                  variant="outline"
                  size="sm"
                >
                  Acquire
                </Button>
              </div>
              
              {showBadgeMessage && (
                <Alert>
                  <AlertDescription>{badgeMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => logout()} variant="outline" className="w-full">
                Sign Out
              </Button>
              
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant="destructive"
                className="w-full"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}