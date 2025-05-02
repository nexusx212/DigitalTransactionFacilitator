import { ReactNode } from 'react';
import { Badge } from './badge';
import { 
  Award, 
  CheckCircle2, 
  CreditCard, 
  Globe, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Badge type definition
export type TradeBadgeType = 
  | 'export-ready'
  | 'finance-approved'
  | 'cross-border'
  | 'afcfta-compliant'
  | 'top-seller'
  | 'ava-verified';

// Badge data object with variant, icon, tooltip, and description for each badge
const badgeData: Record<TradeBadgeType, {
  label: string;
  variant: string;
  icon: ReactNode;
  tooltip: string;
}> = {
  'export-ready': {
    label: 'Certified Export-Ready',
    variant: 'export',
    icon: <Globe className="w-3 h-3" />,
    tooltip: 'This business has met all export certification requirements'
  },
  'finance-approved': {
    label: 'Finance Approved',
    variant: 'finance',
    icon: <CreditCard className="w-3 h-3" />,
    tooltip: 'Approved for trade finance solutions and credit facilities'
  },
  'cross-border': {
    label: 'Cross-Border Seller',
    variant: 'seller',
    icon: <TrendingUp className="w-3 h-3" />,
    tooltip: 'Successfully completed international transactions across borders'
  },
  'afcfta-compliant': {
    label: 'AfCFTA Compliant',
    variant: 'afcfta',
    icon: <ShieldCheck className="w-3 h-3" />,
    tooltip: 'Compliant with African Continental Free Trade Area regulations'
  },
  'top-seller': {
    label: 'Top Seller',
    variant: 'marketplace',
    icon: <Award className="w-3 h-3" />,
    tooltip: 'Recognized for outstanding sales performance and customer satisfaction'
  },
  'ava-verified': {
    label: 'Ava Verified',
    variant: 'verified',
    icon: <CheckCircle2 className="w-3 h-3" />,
    tooltip: 'Profile verified by Ava AI assistant based on transaction history'
  }
};

interface TradeBadgeProps {
  type: TradeBadgeType;
  size?: 'sm' | 'default' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function TradeBadge({ type, size = 'default', showTooltip = true, className }: TradeBadgeProps) {
  const badge = badgeData[type];
  
  const badgeElement = (
    <Badge 
      variant={badge.variant as any} 
      size={size}
      icon={badge.icon}
      className={className}
    >
      {badge.label}
    </Badge>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeElement}
          </TooltipTrigger>
          <TooltipContent>
            <p>{badge.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeElement;
}

interface TradeBadgesGroupProps {
  badges: TradeBadgeType[];
  size?: 'sm' | 'default' | 'lg';
  showTooltips?: boolean;
  className?: string;
}

export function TradeBadgesGroup({ badges, size = 'default', showTooltips = true, className }: TradeBadgesGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badgeType) => (
        <TradeBadge 
          key={badgeType} 
          type={badgeType} 
          size={size} 
          showTooltip={showTooltips} 
        />
      ))}
    </div>
  );
}