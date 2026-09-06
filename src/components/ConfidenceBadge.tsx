import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { HealthStatus } from '../types';

interface ConfidenceBadgeProps {
  confidence: number;
  status?: HealthStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  labelPrefix?: string;
  id?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  status = 'normal',
  showIcon = true,
  size = 'md',
  labelPrefix = 'Confidence',
  id
}) => {
  // Determine color styling based on status or confidence threshold
  let bgClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let IconComponent = ShieldCheck;

  if (status === 'issue' || confidence < 75) {
    bgClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    IconComponent = AlertOctagon;
  } else if (status === 'inspection' || confidence < 90) {
    bgClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    IconComponent = AlertTriangle;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center rounded-md border backdrop-blur-xs tracking-wide ${bgClass} ${sizeClasses[size]}`}
    >
      {showIcon && <IconComponent size={iconSizes[size]} className="shrink-0" />}
      <span>
        {labelPrefix ? `${labelPrefix}: ` : ''}
        {confidence}%
      </span>
    </span>
  );
};
