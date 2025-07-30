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
    // Contar quantos usuários já têm o selo verde
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
        message: "Desculpe, todos os 100 selos verdes já foram distribuídos."
      };
    }

    // Obter o usuário atual do localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      return {
        success: false,
        message: "Usuário não encontrado."
      };
    }

    const currentUser = JSON.parse(savedUser);
    
    if (currentUser.verified === "green") {
      return {
        success: false,
        message: "Você já possui o selo verde!"
      };
    }

    // Atualizar o perfil do usuário
    updateProfile({ verified: "green" });

    return {
      success: true,
      message: "Parabéns! Você adquiriu o selo verde (Founder). Este selo é vitalício e gratuito."
    };
  };

  const acquireBlueBadge = () => {
    return {
      success: false,
      message: "Função em desenvolvimento. Em breve você poderá adquirir este selo por $3/mês."
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