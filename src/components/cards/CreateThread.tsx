import Image from "next/image";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import Link from "next/link";

export default function CreateThread() {
  return (
    <div className="flex items-center gap-4 px-8 py-4 border-b-[.05rem] border-[#323232]">
      <Link href={"/profile"} passHref>
        <Image
          src={DummyUserIcon}
          alt="author"
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
      <div className="relative w-full">
        <button>
          <input
            type="text"
            className="w-full p-2 pr-16 bg-transparent text-[#5a5a5a] focus:outline-none"
            placeholder="Start a thread...."
          />
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button className="text-white px-4 py-1 rounded-lg border-[.05rem] border-[#323232]">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
