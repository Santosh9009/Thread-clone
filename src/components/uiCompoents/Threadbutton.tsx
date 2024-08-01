"use client";
import LikeButton from "../uiCompoents/LikeButton";
import { Sharepop } from "../uiCompoents/Sharepop";
import { CommentIcon, RepostIcon } from "../../../public/assests/Images";
import Repost from "./Repost";

interface ThreadbuttonProps {
  author: string;
  authorId: any;
  contentSnippet: string;
  commentsCount: number;
  upvotes: any[]; // Assuming upvotes is an array of user ids
  reposts: any[];
  id: any;
}
export default function Threadbutton({
  author,
  authorId,
  contentSnippet,
  commentsCount,
  upvotes,
  reposts,
  id,
}: ThreadbuttonProps) {
  function sharehandler(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  return (
    <div
      onClick={sharehandler}
      className="flex justify-start mt-4 text-gray-400 space-x-8"
    >
      <div className="">
        <LikeButton threadId={id} upvotes={upvotes} />
      </div>
      <div className="flex items-center space-x-2">
        <button>
          {CommentIcon({
            fill: "#9CA3AF",
            width: 20,
            height: 20,
          })}
        </button>
        <span>{commentsCount}</span>
      </div>
      <Repost author={author} authorId={authorId} contentSnippet={contentSnippet}  reposts={reposts} threadId={id}/>
      <Sharepop id={id} />
    </div>
  );
}
