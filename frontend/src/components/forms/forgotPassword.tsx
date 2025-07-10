import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { authService } from '@/services';
import { PasswordStrength } from '../passwordStrength';
import { useState } from 'react';
import { isAxiosError } from 'axios';

export function ForgotPassword({
	className
}: Readonly<{ className?: string }>) {
	const [tokenRequested, setTokenRequested] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const next = new URLSearchParams(location.search).get('next');

	const FormSchema = z.object({
		email: z.string().min(1, {
			message: 'Email is required to reset password.'
		}),
		token: z.string()
		.refine((value) => !tokenRequested || value.length === 6, {
			message: 'Required field.'
		}).refine((value) => !tokenRequested || /^\d+$/.test(value), {
			message: 'Only numbers are allowed.'
		}),
		password: z.string()
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: '',
			token: '',
			password: ''
		}
	});

	async function getToken(data: z.infer<typeof FormSchema>) {
		try {
			await authService.forgotPassword(data.email);
			toast('Successful');
			setTokenRequested(true);
		} catch (error) {
			toast('Error');
			if (isAxiosError(error) && error.response?.status === 400) {
				form.setError('email', { message: error.response.data.message });
			}
			console.error(error);
		}
	}

	async function resetPassword(data: z.infer<typeof FormSchema> ) {
		try {
			await authService.resetPassword(data.email, data.token, data.password);
			navigate(`/auth/signin?next=${next}`);
			toast('You can now login with your new password.');
		} catch (error) {
			toast('Error');
			if (isAxiosError(error) && error.response?.status === 400) {
				form.setError('token', { message: error.response.data.message });
			}
			console.error(error);
		}
	}

	return (
		<Card className={cn("md:w-1/4", className)}>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Forgot Password?</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="text-center p-4 pt-0">Enter your e-mail address and check your inbox for the pin. After that, you can change your password or directly login your account if you need faster access. We recommend you to change your password as soon as possible.</CardDescription>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(tokenRequested ? resetPassword : getToken)}
						className={cn(
							'grid gap-4 p-2',
						)}
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<div className='flex justify-between items-center gap-4'>
										<FormControl>
											<Input
												placeholder="Email"
												{...field}
												className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
											/>
										</FormControl>
										<Button type='button' onClick={form.handleSubmit(getToken)}>Request PIN</Button>	
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="text-sm relative p-2">
							<hr />
							<Link className="hover:underline underline-offset-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card p-2" to='/auth/signin?next='>
								Back to Login
							</Link>
						</div>
						<div className={cn('p-2 space-y-4', tokenRequested || 'hidden')}>
							<FormField
								control={form.control}
								name="token"
								render={({ field }) => (
									<FormItem>
										<div className='flex justify-between items-center'>
											<FormLabel>Enter PIN</FormLabel>
											<FormControl>
												<InputOTP maxLength={6} {...field}>
													<InputOTPGroup>
														<InputOTPSlot index={0} />
														<InputOTPSlot index={1} />
														<InputOTPSlot index={2} />
													</InputOTPGroup>
													<InputOTPSeparator />
													<InputOTPGroup>
														<InputOTPSlot index={3} />
														<InputOTPSlot index={4} />
														<InputOTPSlot index={5} />
													</InputOTPGroup>
												</InputOTP>
											</FormControl>	
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Enter New Password</FormLabel>
										<FormControl>
											<Input {...field} type="password" placeholder="Password" />
										</FormControl>
										<FormDescription>
											<PasswordStrength password={field.value} />
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className='w-full'>
								Reset Password
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
