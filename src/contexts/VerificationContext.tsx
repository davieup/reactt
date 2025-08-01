import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface VerificationContextType {
  greenBadgeCount: number;
  acquireGreenBadge: () => { success: boolean; message: string };
  acquireBlueBadge: () => { success: boolean; message: string };
  isGreenBadgeAvailable: () => boolean;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

const MAX_GREEN_BADGES = 100;

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const { users, updateProfile } = useAuth();
  const [greenBadgeCount, setGreenBadgeCount] = useState(0);

  useEffect(() => {
    // Count how many users already have the green badge
    const count = users.filter(user => user.verified === "green").length;
    setGreenBadgeCount(count);
  }, [users]);

  const isGreenBadgeAvailable = () => {
    return greenBadgeCount < MAX_GREEN_BADGES;
  };

  const acquireGreenBadge = () => {
    if (!isGreenBadgeAvailable()) {
      return {
        success: false,
        message: "Sorry, all 100 green badges have already been distributed."
      };
    }

    // Obter o usuário atual do localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      return {
        success: false,
        message: "User not found."
      };
    }

    const currentUser = JSON.parse(savedUser);
    
    if (currentUser.verified === "green") {
      return {
        success: false,
        message: "You already have the green badge!"
      };
    }

    // Update user profile
    updateProfile({ verified: "green" });

    return {
      success: true,
              message: "Congratulations! You acquired the green badge (Founder). This badge is lifetime and free."
    };
  };

  const acquireBlueBadge = () => {
    return {
      success: false,
              message: "Feature under development. Soon you will be able to acquire this badge for $3/month."
    };
  };

  return (
    <VerificationContext.Provider value={{
      greenBadgeCount,
      acquireGreenBadge,
      acquireBlueBadge,
      isGreenBadgeAvailable
    }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
} 