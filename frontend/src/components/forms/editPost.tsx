import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';

export function EditPost({ className }: Readonly<{ className?: string }>) {
  const { toast } = useToast();
  const FormSchema = z.object({
    username: z.string().min(1, {
      message: 'Required field.'
    }),
    password: z.string().min(1, {
      message: 'Required field.'
    })
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: ''
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
          'w-2/3 xl:w-1/3 space-y-6 font-montserrat border border-borderColor px-4 py-6 rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-h-full',
          className
        )}
      >
        <h1 className="text-3xl font-bold text-center">Edit Post</h1>
      </form>
    </Form>
  );
}
