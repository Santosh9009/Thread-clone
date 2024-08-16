// components/MetaThreadCard.tsx
"use client";
import Image from "next/image";
import {
  ThreeDotIcon,
} from "../../../public/assests/Images";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { timeAgo } from "@/helpers/CalculateTime";
import Link from "next/link";

import Threadbutton from "../uiCompoents/Threadbutton";
import { useRouter } from "next/navigation";

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
  isRepost:boolean,
  isQuote:boolean,
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
  isQuote
}) => {
  const router = useRouter();

  function handleclick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${authorId}`);
  }

  function handleclick2(e: any) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${originalThread.author._id}`);
  }

  function originalThreadclick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/thread/${originalThread.id}`);
  }

  return (
    <Link href={`/thread/${id}`} passHref>
      <div
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
                <h3
                  onClick={handleclick}
                  className="text-base font-semibold text-slate-200 hover:underline"
                >
                  {author && "@" + author}
                </h3>
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
            {/* original thread */}

            <div onClick={originalThreadclick} className="bg-[#181818] rounded-lg overflow-hidden border-[.05rem] border-[#323232] py-4 px-4 m-2">
              <div className="flex items-start">
                <Image
                  src={DummyUserIcon}
                  alt={originalThread.author || ""}
                  className="w-10 rounded-full object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <h3
                        onClick={handleclick2}
                        className="text-base font-semibold text-slate-200 hover:underline"
                      >
                        {originalThread.author.username && "@" + originalThread.author.username}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {timeAgo(originalThread.createdAt)}
                      </p>
                    </div>
                    <div className="text-gray-400"></div>
                  </div>
                  <p className="text-gray-300 mt-2 font-light">
                    {originalThread.content}
                  </p>
                </div>
              </div>
            </div>

            <Threadbutton
              id={id}
              commentsCount={commentsCount}
              upvotes={upvotes}
              reposts={reposts}
              isRepost={isRepost}
              isQuote = {isQuote}
              originalThreadId={originalThread._id}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuoteCard;
