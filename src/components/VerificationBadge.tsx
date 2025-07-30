import React from 'react';
import { Check } from 'lucide-react';

interface VerificationBadgeProps {
  verified?: "green" | "blue" | boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerificationBadge({ verified, size = "md", className = "" }: VerificationBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const colorClasses = {
    green: "text-green-500",
    blue: "text-blue-500",
    true: "text-blue-500" // Para compatibilidade com o boolean
  };

  const color = typeof verified === "string" ? verified : "blue";

  return (
    <Check 
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      fill="currentColor"
    />
  );
} 