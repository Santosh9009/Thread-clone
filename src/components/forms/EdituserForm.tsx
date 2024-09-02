"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
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
import { Loader2, LucideLoader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import Image from "next/image";
import { UpdateUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const UpdateUserSchema = z.object({
  username: z.string().max(20).optional(),
  name: z.string().max(20).optional(),
  bio: z.string().max(150).optional(),
  profilePic: z.instanceof(File).optional(),
});

export default function EditUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const debouncedUsername = useDebounceCallback(setUsername, 800);
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user._id;

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
      profilePic: null || undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof UpdateUserSchema>) => {
    setIsLoading(true);
    try {
      const response = await UpdateUser({
        userId: userId,
        username:username,
        name: data.name,
        bio: data.bio,
        isOnboarded: true,
      });

      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        router.push(`/profile/${userId}`);
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
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files?.[0];
      setProfilePic(file);
    }
  };

  const handleCancelProfilePic = () => {
    setProfilePic(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.post(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axioserror = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axioserror.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [username]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg mx-auto px-10 md:px-0 py-10"
      >
        <div className="flex flex-col items-center space-y-4">
          <Avatar
            className="h-24 w-24"
            key={profilePic ? URL.createObjectURL(profilePic) : "dummy"}
          >
            {profilePic ? (
              <AvatarImage
                src={URL.createObjectURL(profilePic)}
                alt="Profile Picture"
              />
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="bg-gray-700 text-gray-300 rounded-md p-3 border-none"
                  placeholder="Username"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedUsername(e.target.value);
                  }}
                />
              </FormControl>
              {isCheckingUsername && <Loader2 className="animate-spin mt-2" />}
              {!isCheckingUsername && usernameMessage && (
                <p
                  className={`text-sm mt-2 ${
                    usernameMessage === "username is unique"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {usernameMessage}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
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
          {isLoading ? (
            <LucideLoader2 className="animate-spin mr-2" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
