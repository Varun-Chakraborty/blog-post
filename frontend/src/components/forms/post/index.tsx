import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Editor } from './editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { postService } from '@/services';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { InfiniteLoader } from '@/components/loaders';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { type Post } from '@/types/baseTypes';

export function Post({
  className,
  operation
}: Readonly<{ className?: string; operation: 'create' | 'edit' }>) {
  const { toast } = useToast();
  const { id: postId } = useParams();
  const location = useLocation();
  const post = location.state?.post as Post;

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const FormSchema = z.object({
    title: z.string().min(1, {
      message: 'Required field.'
    }),
    content: z.string().min(1, {
      message: 'Required field.'
    }),
    imageUrl: z.string()
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: 'Post title',
      content: '# Hey there',
      imageUrl: ''
    }
  });

  const imageUrl = form.watch('imageUrl');

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const newPostId = postId
        ? await postService.updatePost(postId, data)
        : await postService.createPost(data);
      navigate(`/post/${newPostId}`);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          navigate('/posts');
          toast({
            title: 'Error',
            variant: 'destructive',
            description: 'Post not found'
          });
        }
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error.response?.data.message
        });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (operation === 'edit' && post) {
      form.setValue('title', post.title);
      form.setValue('content', post.content ?? '');
      form.setValue('imageUrl', post.imgUrl ?? '');
    } else {
      setIsLoading(true);
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
              toast({
                title: 'Error',
                description: 'Post not found'
              });
            }
          })
          .finally(() => setIsLoading(false));
      }, 3000);
    }
  }, [operation, post, postId]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'space-y-6 font-montserrat px-4 py-6 rounded-xl w-full h-full overflow-y-scroll',
          className
        )}
      >
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-center">Create Post</h1>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <InfiniteLoader /> : 'Submit'}
          </Button>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label className="text-lg font-bold">Title</Label>
              <Input placeholder="Title" {...field} />
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
            </FormItem>
          )}
        />
        <FormField
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <Label>Image URL</Label>
              <Input
                placeholder="https://picsum.photos/seed/picsum/1600/1200"
                {...field}
              />
              <img src={imageUrl} alt="Image preview" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
