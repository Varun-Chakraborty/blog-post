import { Badge } from '@/components/ui/badge';
import {
	TooltipProvider,
	TooltipContent,
	TooltipTrigger,
	Tooltip
} from '@/components/ui/tooltip';

export function AdminBadge() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Badge className="bg-white dark:bg-slate-800 border-amber-500 text-amber-500 hover:text-white hover:bg-amber-500 dark:hover:bg-amber-500">
						Admin
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>This User is admin</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export function PremiumBadge() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Badge className="bg-white dark:bg-slate-800 border-emerald-500 text-emerald-500 hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-500">
						Premium
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>This User is premium</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
