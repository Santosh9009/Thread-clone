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
import { toast } from "@/components/ui/use-toast";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProfilePicUploadComponent } from "../uiCompoents/ProfilePicUpload";
import { UpdateUser } from "@/lib/actions/user.actions";

const onboardSchema = z.object({
  name: z.string().min(2).max(20),
  bio: z.string().max(150),
  avatarUrl: z.string().url().optional(),
  avatarPublicId: z.string().optional(),
});

export default function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user._id;

  // Profile picture upload success handler
  const handleProfilePicUploadSuccess = (uploadedFile: { secure_url: string; public_id: string }) => {
    form.setValue("avatarUrl", uploadedFile.secure_url);
    form.setValue("avatarPublicId", uploadedFile.public_id);
  };

  const form = useForm<z.infer<typeof onboardSchema>>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      name: "",
      bio: "",
      avatarUrl: "",
      avatarPublicId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof onboardSchema>) => {
    setIsLoading(true);
    try {
      const response = await UpdateUser({
        userId,
        name: data.name,
        bio: data.bio,
        isOnboarded: true,
        avatarUrl: data.avatarUrl || "",
        avatarPublicId: data.avatarPublicId || "",
      });

      if (response.success) {
        toast({
          title: "Onboarding Complete",
          description: "Your profile has been set up successfully.",
        });
        router.push("/"); // Navigate to the homepage
      } else {
        toast({
          title: "Failed",
          description: "Failed to complete onboarding. Please try again later.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto px-10 md:px-0 py-10">
        <ProfilePicUploadComponent onUploadSuccess={handleProfilePicUploadSuccess} />

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
                  className="bg-gray-700 text-gray-300 rounded-md p-3 border-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Tell us about yourself"
                  {...field}
                  className="bg-gray-700 text-gray-300 rounded-md p-3 h-32 resize-none w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full bg-main hover:bg-mainhover rounded-md py-3"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <LucideLoader2 className="animate-spin mr-2" /> : "Complete Onboarding"}
        </Button>
      </form>
    </Form>
  );
}
