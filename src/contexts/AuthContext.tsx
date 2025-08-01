import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import profile1 from '@/assets/profile-1.jpg';
import profile2 from '@/assets/profile-2.jpg';
import profile3 from '@/assets/profile-3.jpg';

interface AuthUser extends User {
  email: string;
  password: string;
  following: string[];
  followers: string[];
  profileLink?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  currentUser: AuthUser | null;
  showDisplayName: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, username: string, name: string, avatar: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  deleteAccount: (password: string) => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  getUserById: (id: string) => AuthUser | undefined;
  users: AuthUser[];
  setShowDisplayName: (show: boolean) => void;
}

const defaultUsers: AuthUser[] = [];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function encode(str: string) {
  return btoa(unescape(encodeURIComponent(str)));
}
function decode(str: string) {
  return decodeURIComponent(escape(atob(str)));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [showDisplayName, setShowDisplayNameState] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('allUsers');
    const savedShowDisplayName = localStorage.getItem('showDisplayName');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default users if none exist
      setUsers(defaultUsers);
      localStorage.setItem('allUsers', JSON.stringify(defaultUsers));
    }

    if (savedShowDisplayName) {
      setShowDisplayNameState(JSON.parse(savedShowDisplayName));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email && decode(u.password) === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, username: string, name: string, avatar: string): boolean => {
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return false;
    }

    const newUser: AuthUser = {
      id: Date.now().toString(),
      email,
      password: encode(password),
      username,
      name,
      avatar,
      bio: '',
      verified: false,
      following: [],
      followers: []
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    
    setUser(updatedUser);
    setUsers(updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  };

  const deleteAccount = (password: string): boolean => {
    if (!user || decode(user.password) !== password) return false;
    
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
    setUser(null);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    localStorage.removeItem('currentUser');
    return true;
  };

  const followUser = (userId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      following: [...user.following, userId]
    };
    
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return updatedUser;
      }
      if (u.id === userId) {
        return { ...u, followers: [...u.followers, user.id] };
      }
      return u;
    });
    
    setUser(updatedUser);
    setUsers(updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  };

  const unfollowUser = (userId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      following: user.following.filter(id => id !== userId)
    };
    
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return updatedUser;
      }
      if (u.id === userId) {
        return { ...u, followers: u.followers.filter(id => id !== user.id) };
      }
      return u;
    });
    
    setUser(updatedUser);
    setUsers(updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  const setShowDisplayName = (show: boolean) => {
    setShowDisplayNameState(show);
    localStorage.setItem('showDisplayName', JSON.stringify(show));
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentUser: user,
      showDisplayName,
      login,
      register,
      logout,
      updateProfile,
      deleteAccount,
      followUser,
      unfollowUser,
      getUserById,
      users,
      setShowDisplayName
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}