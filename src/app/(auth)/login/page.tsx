"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { SigninSchema } from "@/ZodSchema/ValidationSchema";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LucideLoader2 } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
      ProfilePic: null,
    },
  });

  async function onSubmit(data: z.infer<typeof SigninSchema>) {
    setIsLoading(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsLoading(false);
    if (response?.error) {
      toast({
        title: "Failed",
        description: response.error,
        variant: "destructive",
      });
      console.log(response.error);
    } else if (response?.ok) {
      toast({
        title: "Success",
        description: "Login Successfully",
      });
      router.replace("/onboarding");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center font-sans p-4">
      <div className="w-full max-w-sm mx-auto rounded-lg p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white">
        <h1 className="text-2xl font-semibold text-center my-4">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John@gmail.com or John_doe"
                      {...field}
                    />
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
                    <Input type="password" placeholder="John@123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <LucideLoader2 className="animate-spin mr-2" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-5 text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <Link className="text-blue-500" href="/signup">
            Signup
          </Link>
        </div>
        <div className="text-center mt-1">
          <Link
            href={"/forgot-password"}
            className="text-red-500 text-sm"
          >
            Forgot Passowrd?
          </Link>
        </div>
      </div>
    </div>
  );
}
