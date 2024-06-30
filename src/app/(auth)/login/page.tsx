"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninSchema } from "@/ZodSchema/ValidationSchema"
import { toast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader, Loader2Icon, LoaderCircle, LoaderPinwheel, LucideLoader, LucideLoader2 } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof SigninSchema>){
    setIsLoading(true)
    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })
    setIsLoading(false)
    if(response?.error){
      toast({
        title: "Failed",
        description: response.error,
        variant: 'destructive'
      })
      console.log(response.error)
    } else if(response?.ok){
      toast({
        title: "Success",
        description: "Login Successfully",
      })
      router.replace('/')
    }
  }

  return (
    <div className="h-screen flex justify-center items-center font-sans p-4">
      <div className="w-full max-w-md mx-auto rounded-md p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)] space-y-6">
        <h1 className="text-2xl font-semibold text-center my-5">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ?  <LucideLoader2 className="animate-spin mr-2" /> : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
