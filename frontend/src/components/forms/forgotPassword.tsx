import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CiUser } from 'react-icons/ci';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function ForgotPassword({
	className
}: Readonly<{ className?: string }>) {
	const FormSchema = z.object({
		username: z.string().min(1, {
			message: 'Required field.'
		})
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: ''
		}
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		toast('Successful');
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn(
					'sm:w-2/3 xl:w-1/3 space-y-6 font-montserrat border border-borderColor px-4 py-6 rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-h-full',
					className
				)}
			>
				<h1 className="text-3xl font-bold text-center">Forgot Password</h1>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex">
									<div className="text-2xl font-montserrat rounded-l-lg bg-black text-white p-2 flex items-center justify-center">
										<CiUser />
									</div>
									<Input
										placeholder="Username"
										{...field}
										className="rounded-l-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="text-sm text-secondaryText flex justify-end">
					<Link className="hover:underline underline-offset-2" to="/login">
						Back to Login
					</Link>
				</div>
				<Button type="submit" className="w-full">
					Submit
				</Button>
			</form>
		</Form>
	);
}
