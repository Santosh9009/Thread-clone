// components/MetaThreadCard.tsx
"use client";
import Image from "next/image";
import { ThreeDotIcon } from "../../../public/assests/Images";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { timeAgo } from "@/helpers/CalculateTime";
import Link from "next/link";

import Threadbutton from "../uiCompoents/Threadbutton";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { photo } from "@/types/Thread";

interface ThreadCardProps {
  br?: boolean;
  id: any;
  author: string;
  contentSnippet: string;
  commentsCount: number;
  upvotes: any[]; // Assuming upvotes is an array of user ids
  reposts: any[];
  timestamp: Date;
  authorId: any;
  originalThread: any;
  isRepost: boolean;
  isQuote: boolean;
  photos: photo[];
}

const QuoteCard: React.FC<ThreadCardProps> = ({
  br = true,
  id,
  author,
  authorId,
  contentSnippet,
  commentsCount,
  upvotes,
  reposts,
  timestamp,
  originalThread,
  isRepost,
  isQuote,
  photos,
}) => {
  const router = useRouter();

  const MAX_PHOTOS_DISPLAY = 4;

  function handleclick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${authorId}`);
  }

  function handleclick2(e: any) {
    // e.preventDefault();
    // e.stopPropagation();
    router.push(`/profile/${originalThread.author._id}`);
  }

  function originalThreadclick(e: any) {
    // e.preventDefault();
    // e.stopPropagation();
    router.push(`/thread/${originalThread.id}`);
  }

  return (
    // <Link href={`/thread/${id}`}>
    <div
      onClick={() => router.push(`/thread/${id}`)}
      className={`bg-[#181818] overflow-hidden ${
        br ? "border-b-[.05rem] border-[#323232]" : ""
      } py-4 px-8`}
    >
      <div className="flex items-start">
        <Image
          src={DummyUserIcon}
          alt={author || ""}
          className="w-10 rounded-full object-cover"
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleclick}
                className="text-base font-semibold text-slate-200 hover:underline"
              >
                {author && "@" + author}
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
          {photos && photos.length > 0 && (
            <div className="mt-2">
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, MAX_PHOTOS_DISPLAY).map((photo, index) => (
                  <CldImage
                    key={photo.publicId}
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-auto rounded-md object-cover"
                    width={300}
                    height={200}
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

          {/* original thread */}

          <div
            onClick={originalThreadclick}
            className="bg-[#181818] rounded-lg overflow-hidden border-[.05rem] border-[#323232] py-4 px-4 m-2"
          >
            <div className="flex items-start">
              <Image
                src={DummyUserIcon}
                alt={originalThread.author || ""}
                className="w-10 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleclick2}
                      className="text-base font-semibold text-slate-200 hover:underline"
                    >
                      {originalThread.author.username &&
                        "@" + originalThread.author.username}
                    </button>
                    <p className="text-gray-400 text-sm">
                      {timeAgo(originalThread.createdAt)}
                    </p>
                  </div>
                  <div className="text-gray-400"></div>
                </div>
                <p className="text-gray-300 mt-2 font-light">
                  {originalThread.content}
                </p>
                {/* originalthread photos */}
                {originalThread.photos && originalThread.photos.length > 0 && (
                  <div className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      {originalThread.photos
                        .slice(0, MAX_PHOTOS_DISPLAY)
                        .map((photo:any, index:number) => (
                          <CldImage
                            key={photo.publicId}
                            src={photo.url}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-auto rounded-md object-cover"
                            width={300}
                            height={200}
                          />
                        ))}
                    </div>
                    {originalThread.photos.length > MAX_PHOTOS_DISPLAY && (
                      <button className="mt-2 text-blue-500 hover:underline">
                        View more ({originalThread.photos.length - MAX_PHOTOS_DISPLAY})
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Threadbutton
            id={id}
            commentsCount={commentsCount}
            upvotes={upvotes}
            reposts={reposts}
            isRepost={isRepost}
            isQuote={isQuote}
            originalThreadId={originalThread._id}
          />
        </div>
      </div>
    </div>
    // </Link>
  );
};

export default QuoteCard;
