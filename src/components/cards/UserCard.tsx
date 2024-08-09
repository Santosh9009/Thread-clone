import Image from "next/image";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { Button } from "../ui/button";
import Link from "next/link";

interface props {
  username: string;
  name: string;
  followers: number;
  userId: string | unknown;
}

export default function UserCard({ username, name, followers, userId }: props) {
  return (
    <>
      <div
        className="flex p-4 bg-transparent"
        // onClick={handleProfileClick}
      >
        <Image
          src={DummyUserIcon}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="w-full border-b-[.05rem] border-[#323232] pb-2">
          <div className="pl-4 w-full flex justify-between items-center">
            <div className="flex flex-col ">
              <h2 className="text-base font-semibold text-white">{username}</h2>
              <p className="text-gray-400 text-sm">{!name ? "Na" : name}</p>
              <p className="text-white text-sm">
                <span className="mr-2">{followers}</span>followers
              </p>
            </div>
            <Link href={`/profile/${userId}`} passHref>
              <Button className="dark">View</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
