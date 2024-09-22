import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CiUser } from "react-icons/ci";
import { MdPassword } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/hooks/redux";
import { profileActions } from "@/redux/profile";
import api from "@/api";
import { useState } from "react";

export function Login({ className }: Readonly<{ className?: string }>) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [submitting, setIsSubmitting] = useState(false);

  const FormSchema = z.object({
    username: z.string().min(1, {
      message: "Required field.",
    }),
    password: z.string().min(1, {
      message: "Required field.",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);
      const response = await api.login(
        data.username.toString(),
        data.password.toString()
      );
      dispatch(profileActions.addProfile(response.data!.user));
      toast({
        title: "Login successful",
        description: "You are now logged in.",
      });
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.response?.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Something went wrong. Please try again later.",
        });
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "sm:w-2/3 xl:w-1/3 space-y-6 font-montserrat border border-borderColor px-4 py-6 rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-h-full",
          className
        )}
      >
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="text-2xl font-montserrat rounded-l-lg bg-black text-white p-2 flex items-center justify-center">
                    <CiUser />
                  </div>
                  <Input
                    placeholder="johndoe"
                    {...field}
                    className="rounded-l-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  />
                </div>
              </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-sm text-secondaryText flex justify-between">
          <Link
            className="hover:underline underline-offset-2"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
          <Link className="hover:underline underline-offset-2" to="/register">
            Register
          </Link>
        </div>
        <Button disabled={submitting} className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
