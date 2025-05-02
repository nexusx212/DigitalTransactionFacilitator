import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary-600 text-primary-foreground font-semibold shadow-sm hover:from-primary-600 hover:to-primary-700",
        secondary: "bg-gradient-to-r from-secondary to-secondary-600 text-secondary-foreground font-semibold shadow-sm hover:from-secondary-600 hover:to-secondary-700",
        destructive: "bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground font-semibold shadow-sm hover:from-red-600 hover:to-red-700",
        outline: "bg-transparent text-foreground border border-input hover:bg-accent hover:text-accent-foreground shadow-sm",
        // Enhanced badge variants with more vibrant colors
        export: "bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-sm hover:from-green-600 hover:to-green-700",
        finance: "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm hover:from-blue-600 hover:to-blue-700",
        seller: "bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-sm hover:from-purple-600 hover:to-purple-700",
        afcfta: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-sm hover:from-amber-600 hover:to-amber-700",
        marketplace: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold shadow-sm hover:from-indigo-600 hover:to-indigo-700",
        verified: "bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-sm hover:from-teal-600 hover:to-teal-700",
      },
      size: {
        default: "h-6 px-3 py-0.5 text-xs",
        sm: "h-5 px-2.5 py-0.5 text-xs",
        lg: "h-7 px-3.5 py-1 text-sm font-semibold",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };