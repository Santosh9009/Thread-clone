"use client";
import LikeButton from "../uiCompoents/LikeButton";
import { Sharepop } from "../uiCompoents/Sharepop";
import { CommentIcon } from "../../../public/assests/Images";
import Repost from "./Repost";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ThreadbuttonProps {
  commentsCount: number;
  upvotes: any[];
  reposts: any[];
  id: any;
  originalThreadId?: any;
  isRepost?: boolean;
  isQuote?: boolean;
}
export default function Threadbutton({
  commentsCount,
  upvotes,
  reposts,
  id,
  originalThreadId,
  isRepost,
  isQuote,
}: ThreadbuttonProps) {
  const router = useRouter();
  function handler(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  return (
    <div
      onClick={handler}
      className="flex justify-start text-gray-400 space-x-2 mt-4"
    >
      <div className="flex items-center hover:bg-[#242424] rounded-3xl py-1 px-3">
        <LikeButton
          threadId={isRepost ? originalThreadId : id}
          upvotes={upvotes}
        />
      </div>
      <div
        onClick={() => router.push(`/thread/${id}`)}
        className="flex items-center hover:bg-[#242424] space-x-2 rounded-3xl py-1 px-3"
      >
        {CommentIcon({
          fill: "#9CA3AF",
          width: 20,
          height: 20,
        })}
        <span>{commentsCount}</span>
      </div>
      <div className="flex items-center hover:bg-[#242424] rounded-3xl py-1 px-3">
        <Repost
          reposts={reposts}
          threadId={id}
          isRepost={isRepost}
          isQuote={isQuote}
          originalThreadId={originalThreadId}
        />
      </div>
      <div className="flex items-center hover:bg-[#242424] rounded-3xl py-1 px-3">
        <Sharepop id={id} />
      </div>
    </div>
  );
}
