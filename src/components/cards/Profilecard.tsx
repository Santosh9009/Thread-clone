"use client";
// components/ProfileCard.js
import Image from "next/image";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useState } from "react";
import Follow from "../uiCompoents/Follow";
import { People } from "../uiCompoents/People";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Props {
  name: string;
  username: string;
  followers: any[];
  following: any[];
  authorId: string;
  bio: string;
  avatarUrl?: string;
}

const MAX_BIO_LENGTH = 50;

const ProfileCard = ({
  name,
  username,
  followers,
  following,
  authorId,
  bio,
  avatarUrl,
}: Props) => {
  const { data } = useSession();
  const userId = data?.user._id;
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleBio = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedBio =
    bio.length > MAX_BIO_LENGTH ? bio.slice(0, MAX_BIO_LENGTH) + "..." : bio;

  return (
    <div className="flex flex-col items-center p-8 text-white w-full">
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text- md:text-2xl font-bold mb-1">{name || "NA"}</h1>
          <button className="text-gray-400 mb-2 hover:underline">
            @{username || "na"}
          </button>
        </div>

        <Avatar className="h-24 w-24 rounded-full">
          <AvatarImage
            src={avatarUrl ? avatarUrl : DummyUserIcon.src}
            alt="Profile Picture"
            className="rounded-full"
          />
          <AvatarFallback>
            <Image alt="User" src={DummyUserIcon} className="rounded-full" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col mb-5 w-full">
        <p className="text-gray-400 mb-4">{isExpanded ? bio : truncatedBio}</p>
        {bio.length > MAX_BIO_LENGTH && (
          <button
            className="text-blue-500 hover:underline"
            onClick={handleToggleBio}
          >
            {isExpanded ? "See Less" : "See More"}
          </button>
        )}

        <div className="flex justify-start space-x-6 mb-5 w-full">
          <div className="flex items-center space-x-2">
            <p className="text-base font-medium">{followers.length}</p>
            <People userId={authorId} btn={"Followers"} />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-base font-medium">{following.length}</p>
            <People userId={authorId} btn={"Following"} />
          </div>
        </div>
      </div>

      {authorId === userId ? (
        <button
          onClick={() => router.push(`/profile/edit`)}
          className="w-full bg-transparent border-[0.05rem] border-[#3d3d3d] py-2 rounded-xl font-semibold hover:text-slate-300"
        >
          Edit Profile
        </button>
      ) : (
        <div className="flex justify-evenly w-full space-x-4 mt-3">
          <div className="w-1/2">
            <Follow followers={followers} targetId={authorId} />
          </div>
          <Button className="w-1/2 bg-transparent border-[.05rem] border-[#323232] hover:bg-transparent rounded-xl hover:text-slate-400">
            Mention
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
