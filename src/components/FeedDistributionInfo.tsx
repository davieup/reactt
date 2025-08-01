import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VerificationBadge } from './VerificationBadge';
import { Users, TrendingUp, Crown } from 'lucide-react';

export function FeedDistributionInfo() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span>Feed Algorithm</span>
        </CardTitle>
        <CardDescription>
                      Intelligent content distribution based on badges and relationships
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
                      {/* Followed users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Followed users</span>
              </div>
              <span className="text-sm text-muted-foreground">35%</span>
            </div>
            <Progress value={35} className="h-2" />
          </div>

          {/* Selo Verde */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <VerificationBadge verified="green" size="sm" />
                <span className="text-sm font-medium">Selo Verde (Founder)</span>
              </div>
              <span className="text-sm text-muted-foreground">30%</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>

          {/* Selo Azul */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <VerificationBadge verified="blue" size="sm" />
                <span className="text-sm font-medium">Selo Azul (Influencer)</span>
              </div>
              <span className="text-sm text-muted-foreground">25%</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>

                      {/* Unverified users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Other users</span>
              </div>
              <span className="text-sm text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2" />
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            The algorithm prioritizes content from verified users and those you follow, 
            maintaining diversity in the feed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 