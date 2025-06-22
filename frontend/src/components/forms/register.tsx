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
import { CiUser } from 'react-icons/ci';
import { MdEmail, MdPassword } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordStrength } from '@/components/passwordStrength';
import { authService } from '@/services';
import { IsUsernameAvailable } from '@/components/isUsernameAvailable';
import { isAxiosError } from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { profileActions } from '@/lib/redux/profile';
import { useState } from 'react';

export function Register({ className }: Readonly<{ className?: string }>) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [submitting, setSubmitting] = useState(false);

	const FormSchema = z.object({
		name: z.string().min(1, { message: 'Required field.' }),
		username: z
			.string()
			.min(1, { message: 'Required field.' })
			.regex(/^[a-zA-Z0-9]+$/, {
				message: 'Username can only contain letters and numbers.'
			}),
		email: z.string().email({
			message: 'Invalid email address.'
		}),
		password: z
			.string()
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.:;])[A-Za-z\d@$!%*?&_.:;]{8,}$/,
				{
					message:
						'Password can only contain letters, numbers, and the following special characters: @, $, !, %, *, ?, &, _, ., ;, :'
				}
			)
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			password: ''
		}
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			setSubmitting(true);
			const response = await authService.signup(
				data.name,
				data.username,
				data.email,
				data.password
			);
			dispatch(profileActions.setProfile(response.data!.user));
			toast('Account created.');
			navigate('/');
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 409) {
				toast('Registration failed.');
			} else {
				toast('Registration failed.');
				console.error(error);
			}
		} finally {
			setSubmitting(false);
		}
	}
	return (
		<Form {...form}>
			<form
				className={cn(
					'sm:w-2/3 xl:w-1/3 h-full space-y-6 font-montserrat border border-borderColor px-4 py-6 overflow-y-auto rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overscroll-none',
					className
				)}
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<h1 className="text-3xl font-bold text-center">Register</h1>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder="John Doe"
									{...field}
									className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
								/>
							</FormControl>
							<FormDescription>Enter your name</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<div className="flex relative">
									<div className="text-2xl font-montserrat rounded-l-lg bg-black text-white p-2 flex items-center justify-center">
										<CiUser />
									</div>
									<Input
										placeholder="johndoe"
										{...field}
										className="rounded-l-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
									/>
									<div className="absolute right-2 top-1/2 -translate-y-1/2">
										<IsUsernameAvailable
											username={field.value}
											trigger={form.trigger}
											setError={form.setError}
										/>
									</div>
								</div>
							</FormControl>
							<FormDescription>Enter your username</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<div className="flex">
									<div className="text-2xl font-montserrat rounded-l-lg bg-black text-white p-2 flex items-center justify-center">
										<MdEmail />
									</div>
									<Input
										placeholder="CqTt5@example.com"
										{...field}
										className="rounded-l-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
									/>
								</div>
							</FormControl>
							<FormDescription>Enter your email</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<div className="flex">
									<div className="text-2xl font-montserrat rounded-l-lg bg-black text-white p-2 flex items-center justify-center">
										<MdPassword />
									</div>
									<Input
										placeholder="●●●●●●●●"
										{...field}
										type="password"
										className="rounded-l-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
									/>
								</div>
							</FormControl>
							<FormDescription className="">
								Choose a strong password
							</FormDescription>
							<PasswordStrength password={field.value} />
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="text-sm text-secondaryText flex justify-end">
					<Link className="hover:underline underline-offset-2" to="/login">
						Login
					</Link>
				</div>
				<Button disabled={submitting} className="w-full" type="submit">
					Submit
				</Button>
			</form>
		</Form>
	);
}
