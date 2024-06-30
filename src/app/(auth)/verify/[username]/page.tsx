"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { verifySchema } from "@/ZodSchema/ValidationSchema"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"

export default function VerifyForm({params}:{params:{username:string}}) {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verifyCode: "",
    },
  })
  
  async function onSubmit(data: z.infer<typeof verifySchema>){
    try{
      const response = await axios.post(`/api/verify/${params.username}`,data)
      if(response.status===200){
        router.replace('/login')
      }
      toast({
        title:response.status===200?"Success":"Failure",
        description:response.data.messgage,
        variant:response.status===200?'default':'destructive'
      })
     
    }catch(error){
      const axioserror = error as AxiosError<ApiResponse>
      toast({
        title:"Failure",
        description:axioserror.response?.data.message,
        variant:"destructive"
      })
    }
  }
  
  return (
    <div className="h-screen flex justify-center items-center font-sans p-4">
      <div className="w-full max-w-md mx-auto rounded-md p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)] space-y-6">
        <h1 className="text-2xl font-semibold text-center my-5">Verify your Account</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="verifyCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormDescription>
                 Verification code sent to your email 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}
