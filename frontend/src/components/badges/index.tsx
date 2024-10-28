import { Badge } from '@/components/ui/badge';
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export function AdminBadge() {
  return (
    <TooltipProvider>
      <TooltipTrigger>
        <Badge className="bg-amber-500">Admin</Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>This User is admin</p>
      </TooltipContent>
    </TooltipProvider>
  );
}

export function PremiumBadge() {
  return (
    <TooltipProvider>
      <TooltipTrigger>
        <Badge className="bg-emerald-500">Premium</Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>This User is premium</p>
      </TooltipContent>
    </TooltipProvider>
  );
}
