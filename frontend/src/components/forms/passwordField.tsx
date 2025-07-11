import { useState } from 'react';
import { FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function PasswordField({
	field,
    className
}: {
	field: any;
	className?: string;
}) {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	return (
		<div className={cn("relative", className)}>
			<FormControl>
				<Input {...field} placeholder='Password' {...(showPassword ? {} : { type: 'password' })} />
			</FormControl>
			<Button
				variant="transparent"
				className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-accent cursor-pointer"
				type="button"
				onClick={() => setShowPassword(prev => !prev)}
			>
				{showPassword ? <EyeOff /> : <Eye />}
			</Button>
		</div>
	);
}
