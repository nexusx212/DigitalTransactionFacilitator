import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        // Adding custom badge variants
        export: "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200",
        finance: "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200",
        seller: "bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200",
        afcfta: "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200",
        marketplace: "bg-indigo-100 text-indigo-800 border border-indigo-300 hover:bg-indigo-200",
        verified: "bg-teal-100 text-teal-800 border border-teal-300 hover:bg-teal-200",
      },
      size: {
        default: "h-6 px-2.5 py-0.5 text-xs",
        sm: "h-5 px-2 py-0 text-xs",
        lg: "h-7 px-3 py-1 text-sm",
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