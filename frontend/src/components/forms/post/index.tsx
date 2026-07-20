import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Editor } from './editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { postService } from '@/services';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/loader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Post } from '@/types/baseTypes';
import axios from 'axios';

export function Post({
	className,
	operation
}: Readonly<{ className?: string; operation: 'create' | 'edit' }>) {
	const { id: postId } = useParams();
	const location = useLocation();
	const post = location.state?.post as Post;

	const [loading, setLoading] = useState({
		post: false,
		image: false
	});
	const navigate = useNavigate();

	const FormSchema = z.object({
		title: z.string().min(1, {
			message: 'Required field.'
		}),
		content: z.string().min(1, {
			message: 'Required field.'
		}),
		tags: z.array(z.string()),
		imageUrl: z.string()
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			content: '# Hey there'
		}
	});

	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [objUrl, setObjUrl] = useState<string>('');

	useEffect(() => {
		if (imageBlob) {
			setObjUrl(URL.createObjectURL(imageBlob));
		}
	}, [imageBlob]);

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		if (!(imageBlob instanceof Blob)) {
			form.setError('imageUrl', { message: 'Url is not valid.' });
			return;
		}
		setLoading(prev => ({ post: true, image: prev.image }));
		try {
			const newPostId = postId
				? await postService.updatePost(postId, data)
				: await postService.createPost(data);
			navigate(`/post/${newPostId}`);
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.status === 404) {
					navigate('/posts');
					toast('Error');
				}
				toast('Error');
			}
			console.error(error);
		} finally {
			setLoading(prev => ({ post: false, image: prev.image }));
		}
	}

	useEffect(() => {
		if (operation === 'edit' && post) {
			form.setValue('title', post.title);
			form.setValue('content', post.content ?? '');
			form.setValue('imageUrl', post.imgUrl ?? '');
		} else {
			setLoading(prev => ({ post: true, image: prev.image }));
			setTimeout(() => {
				postService
					.getPostById(postId!)
					.then(post => {
						const postData = post;
						if (postData) {
							form.setValue('title', postData.title);
							form.setValue('content', postData.content ?? '');
							form.setValue('imageUrl', postData.imgUrl ?? '');
						} else {
							toast('Error');
						}
					})
					.finally(() =>
						setLoading(prev => ({ post: false, image: prev.image }))
					);
			}, 3000);
		}
	}, [operation, post, postId]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn(
					'space-y-6 px-4 py-6 rounded-xl w-full h-full overflow-y-auto',
					className
				)}
			>
				<div className="flex justify-between">
					<h1 className="text-3xl font-bold text-center">Create Post</h1>
					<Button type="submit" disabled={loading.post}>
						{loading.post ? <Loader /> : 'Submit'}
					</Button>
				</div>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<Label className="text-lg font-bold">Title</Label>
							<Input placeholder="Title" {...field} />
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="imageUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Image URL</FormLabel>
							<Input
								placeholder="https://picsum.photos/seed/picsum/1600/1200"
								{...field}
								onChange={e => {
									field.onChange(e.target.value);
									setLoading(prev => ({ post: prev.post, image: true }));
									axios
										.get(e.target.value, { responseType: 'blob' })
										.then(res => setImageBlob(res.data))
										.catch(() => setImageBlob(null))
										.finally(() =>
											setLoading(prev => ({ post: prev.post, image: false }))
										);
								}}
							/>
							<FormMessage />
							{field.value && (
								<div className="flex justify-center items-center h-80 p-3">
									{loading.image ? (
										<Loader />
									) : objUrl ? (
										<img
											src={objUrl}
											alt="Image preview"
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<div className="h-full flex justify-center items-center text-muted-foreground">
											Image not found
										</div>
									)}
								</div>
							)}
						</FormItem>
					)}
				/>
				<FormField
					name="content"
					render={() => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Controller
									control={form.control}
									name="content"
									render={({ field }) => (
										<Editor
											{...field}
											onChange={content => {
												field.onChange(content);
											}}
										/>
									)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
