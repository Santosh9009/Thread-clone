"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { LucideLoader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DummyUserIcon from "../../../public/assests/profile-picture.png"
import Image from "next/image"
import { UpdateUser } from "@/lib/actions/user.actions"
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"

const onboardSchema = z.object({
  name: z.string().min(2).max(20),
  bio: z.string().max(150),
  profilePic: z.instanceof(File).optional(),
});

export default function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof onboardSchema>>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      name: "",
      bio: "",
      profilePic: null || undefined,
    },
  })

  const onSubmit = async (data: z.infer<typeof onboardSchema>) => {
    setIsLoading(true);
    try {
      const response = await UpdateUser({
        userId: session?.user._id,
        name: data.name,
        bio: data.bio,
        isOnboarded: true
      });

      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        router.push('/'); // Use client-side navigation
      } else {
        toast({
          title: "Failed",
          description: "Failed to update your profile. Please try again later.",
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again later.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files?.[0];
      setProfilePic(file);
    }
  }

  const handleCancelProfilePic = () => {
    setProfilePic(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24" key={profilePic ? URL.createObjectURL(profilePic) : "dummy"}>
            {profilePic ? (
              <AvatarImage src={URL.createObjectURL(profilePic)} alt="Profile Picture" />
            ) : (
              <AvatarFallback>
                <Image alt="User" src={DummyUserIcon} />
              </AvatarFallback>
            )}
          </Avatar>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleProfilePicChange} 
            ref={fileInputRef}
            className="text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-400 hover:file:bg-gray-600" 
          />
          {profilePic && (
            <button 
              type="button" 
              onClick={handleCancelProfilePic} 
              className="text-red-500 mt-2"
            >
              Cancel
            </button>
          )}
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="bg-gray-700 text-gray-300 rounded-md p-3 border-none" />
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
        <Button className="w-full bg-main hover:bg-mainhover rounded-md py-3" type="submit" disabled={isLoading}>
          {isLoading ? <LucideLoader2 className="animate-spin mr-2" /> : "Complete Onboarding"}
        </Button>
      </form>
    </Form>
  )
}
