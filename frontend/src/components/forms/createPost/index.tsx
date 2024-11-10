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
import { OutputData } from '@editorjs/editorjs';

export function CreatePost({ className }: Readonly<{ className?: string }>) {
  const { toast } = useToast();
  const FormSchema = z.object({
    title: z.string().min(1, {
      message: 'Required field.'
    }),
    content: z.custom<OutputData>()
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: 'Post title',
      content: {
        blocks: [
          {
            id: 'zbGZFPM-iI',
            type: 'paragraph',
            data: {
              text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.'
            }
          }
        ]
      } as OutputData
    }
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Provided values',
      description: <pre>{JSON.stringify(data, null, 2)}</pre>
    });
  }

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
          <Button type="submit">Submit</Button>
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
      </form>
    </Form>
  );
}
