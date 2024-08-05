"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { useSession } from "next-auth/react";
import { addCommnet } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";
import { ObjectId } from "mongodb";

const commentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

interface PostCommentProps {
  avatarUrl: string;
  onCommentSubmit: (comment: string) => void;
}


export default function PostComment({ThreadId}:{ThreadId:ObjectId}) {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const pathname = usePathname();


  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });


  const { watch } = form;
  const commentValue = watch("comment");

  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    setIsLoading(true);
    try {
      await addCommnet({threadId:ThreadId,author:session.data?.user._id,commentText:data.comment,path:pathname,});
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-[#323232] border-b-[.05rem]">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-3 px-8">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            {/* <AvatarImage src={DummyUserIcon} alt="User Avatar" /> */}
            <AvatarFallback>
              <Image alt="User" src={DummyUserIcon} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea 
                      placeholder="Write a comment..."
                      {...field}
                      className="bg-transparent resize-none focus:outline-none pt-2 w-full"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 flex justify-end">
              <button
                className={`${!commentValue.trim()?"text-slate-700":""} bg-transparent  px-4 py-2 rounded-md border-[.05rem] border-[#323232]`}
                type="submit"
                disabled={!commentValue.trim() ||  isLoading}
              >
                {isLoading ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Form>
    </div>
  );
}
