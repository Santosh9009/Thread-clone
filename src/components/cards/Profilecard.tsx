// components/ProfileCard.js

import Image from "next/image";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { Button } from "../ui/button";

interface props {
  // avatarUrl: string
  name: string;
  username: string;
  followers: number;
  following: number;
  // onEdit: () => void;
}
const ProfileCard = ({
  // avatarUrl,
  name,
  username,
  followers,
  following,
}: // onEdit,
props) => {
  return (
    <div className="flex flex-col items-center p-8 text-white w-full ">
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          <p className="text-gray-400 mb-2">@{username}</p>
        </div>

        <Image
          src={DummyUserIcon}
          alt={`${name}'s avatar`}
          className="w-24 h-24 mb-4"
        />
      </div>

      <div className="flex justify-start space-x-6 mb-5 w-full">
        <div className="flex items-center space-x-2">
          <p className="text-lg font-semibold">{followers}</p>
          <p className="text-gray-400">Followers</p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-lg font-semibold">{following}</p>
          <p className="text-gray-400">Following</p>
        </div>
      </div>

      <button className="w-full bg-transparent border-[0.05rem] border-[#3d3d3d] py-2 rounded-xl font-semibold">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
