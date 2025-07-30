import React from 'react';
import { Check } from 'lucide-react';

interface VerificationBadgeProps {
  verified?: "green" | "blue" | boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerificationBadge({ verified, size = "md", className = "" }: VerificationBadgeProps) {
  if (!verified) return null;

  const badgeClasses = {
    sm: "w-3 h-3 rounded-full flex items-center justify-center shadow-sm",
    md: "w-4 h-4 rounded-full flex items-center justify-center shadow-sm", 
    lg: "w-5 h-5 rounded-full flex items-center justify-center shadow-md"
  };

  const iconSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2", 
    lg: "w-2.5 h-2.5"
  };

  const colorClasses = {
    green: "bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 text-white",
    blue: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white",
    true: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white" // Para compatibilidade com o boolean
  };

  const color = typeof verified === "string" ? verified : "blue";

  return (
    <div 
      className={`
        ${badgeClasses[size]} 
        ${colorClasses[color]} 
        ${className} 
        flex-shrink-0 
        ring-1 ring-white/30 
        backdrop-blur-sm
        transition-all duration-200
        hover:scale-110
        active:scale-95
      `}
    >
      <Check className={`${iconSizes[size]} fill-current drop-shadow-sm`} />
    </div>
  );
} 