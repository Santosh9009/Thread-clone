// components/MetaThreadCard.tsx
"use client";
import Image from "next/image";
import {
  CommentIcon,
  RepostIcon,
  ThreeDotIcon,
} from "../../../public/assests/Images";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { timeAgo } from "@/helpers/CalculateTime";
import Link from "next/link";
import Threadbutton from "../uiCompoents/Threadbutton";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

interface photo {
  url: string;
  publicId: string;
}
interface ThreadCardProps {
  br?: boolean;
  id: any;
  author: any;
  contentSnippet: string;
  commentsCount: number;
  upvotes: any[];
  reposts: any[];
  timestamp: Date;
  authorId: any;
  isRepost?: boolean;
  repostauthor?: any;
  repostTime?: any;
  isQuote?: boolean;
  photos?: photo[];
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  br,
  id,
  author,
  authorId,
  contentSnippet,
  commentsCount,
  upvotes,
  reposts,
  timestamp,
  isRepost,
  repostauthor,
  repostTime,
  isQuote,
  photos,
}) => {
  const border = br===false ? br : true;
  const router = useRouter();
  const MAX_PHOTOS_DISPLAY = 4; 

  function handleclick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${authorId}`);
  }

  function handleUsernameClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${repostauthor._id}`);
  }

  return (
    <div>
      {isRepost && repostauthor && (
        <div className="flex gap-2 items-center justify-start text-slate-400 px-5 py-2">
          {RepostIcon({
            fill: "#9CA3AF",
            width: 16,
            height: 16,
          })}
          <button className="hover:underline" onClick={handleUsernameClick}>
            @{repostauthor.username}
          </button>
          <span>reposted {timeAgo(repostTime)}</span>
        </div>
      )}
      {/* <Link href={`/thread/${id}`}> */}
        <div onClick={()=>router.push(`/thread/${id}`)}
          className={`bg-[#181818] overflow-hidden ${
            border ? "border-b-[.05rem] border-[#323232]" : ""
          } py-4 px-8`}
        >
          <div className="flex items-start">
            <Image
            width={20}
            height={20}
            src={author.avatarUrl || DummyUserIcon}
            alt={author.username || ""}
            className="w-10 rounded-full object-cover"
            />
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleclick}
                    className="text-base font-semibold text-slate-200 hover:underline"
                  >
                    {author.username && "@" + author.username}
                  </button>
                  <p className="text-gray-400 text-sm">{timeAgo(timestamp)}</p>
                </div>
                <div className="text-gray-400">
                  <button>
                    {ThreeDotIcon({
                      fill: "#9CA3AF",
                      width: 15,
                      height: 18,
                    })}
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mt-2 font-light">{contentSnippet}</p>

              {/* Map through the photos array and display images */}
              {photos && photos.length > 0 && (
                <div className="mt-2">
                  <div className="flex ">
                    {photos.slice(0, MAX_PHOTOS_DISPLAY).map((photo, index) => (
                      <CldImage
                        key={photo.publicId}
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        className="w-[30%] h-auto rounded-md object-cover"
                        width={300} // Set your desired width
                        height={200} // Set your desired height
                      />
                    ))}
                  </div>
                  {photos.length > MAX_PHOTOS_DISPLAY && (
                    <button className="mt-2 text-blue-500 hover:underline">
                      View more ({photos.length - MAX_PHOTOS_DISPLAY})
                    </button>
                  )}
                </div>
              )}

              <Threadbutton
                id={id}
                commentsCount={commentsCount}
                upvotes={upvotes}
                reposts={reposts}
                isRepost={isRepost}
                isQuote={isQuote}
              />
            </div>
          </div>
        </div>
      {/* </Link> */}
    </div>
  );
};

export default ThreadCard;
