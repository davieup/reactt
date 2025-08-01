import React from 'react';
import { useVerification } from '@/contexts/VerificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationBadge } from './VerificationBadge';
import { Crown, Users } from 'lucide-react';

export function VerificationInfo() {
  const { greenBadgeCount, isGreenBadgeAvailable } = useVerification();

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-green-600" />
          <span>Selos de Verificação</span>
        </CardTitle>
        <CardDescription>
          Sistema de selos especiais para destacar perfis na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selo Verde */}
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <VerificationBadge verified="green" size="md" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Selo Verde (Founder)</h3>
              <p className="text-xs text-muted-foreground">
                {greenBadgeCount}/100 utilizados
              </p>
              <p className="text-xs text-green-600 font-medium">
                {isGreenBadgeAvailable() ? 'Disponível' : 'Esgotado'}
              </p>
            </div>
          </div>

          {/* Selo Azul */}
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <VerificationBadge verified="blue" size="md" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Selo Azul (Influencer)</h3>
              <p className="text-xs text-muted-foreground">$3/mês</p>
              <p className="text-xs text-blue-600 font-medium">Em breve</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
                      <span>Go to Settings to acquire badges</span>
        </div>
      </CardContent>
    </Card>
  );
} 