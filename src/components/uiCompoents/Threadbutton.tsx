"use client";
import LikeButton from "../uiCompoents/LikeButton";
import { Sharepop } from "../uiCompoents/Sharepop";
import { CommentIcon, RepostIcon } from "../../../public/assests/Images";
import Repost from "./Repost";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ThreadbuttonProps {
  commentsCount: number;
  upvotes: any[]; 
  reposts: any[];
  id: any;
  originalThreadId?:any;
  isRepost:boolean,
  isQuote?:boolean,
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
  // const shareId = isRepost ? 

  return (
    <div
      onClick={handler}
      className="flex justify-start mt-4 text-gray-400 space-x-8"
    >
      <div className="">
        <LikeButton threadId={isRepost ? originalThreadId:id } upvotes={upvotes} />
      </div>
      <div onClick={()=>router.push(`/thread/${id}`)} className="flex items-center space-x-2">
          {CommentIcon({
            fill: "#9CA3AF",
            width: 20,
            height: 20,
          })}
        <span>{commentsCount}</span>
      </div>
      <Repost  reposts={reposts} threadId={id} isRepost={isRepost} isQuote={isQuote} originalThreadId={originalThreadId}/>
      <Sharepop id={id} />
    </div>
  );
}
