"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RepostIcon } from "../../../public/assests/Images";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { repostThread, removeRepostThread } from "@/lib/actions/thread.actions";
import { ObjectId } from "mongodb";
import { toast } from "../ui/use-toast";
import QuoteCard from "./Quote";

export default function Repost({
  reposts,
  threadId,
  originalThreadId,
  isRepost,
  isQuote
}: {
  reposts: any[];
  threadId: ObjectId;
  originalThreadId?:any;
  isRepost?:boolean,
  isQuote?:boolean,
}) {
  const [count, setCount] = useState<number>(0);
  const session = useSession();
  const [reposted, setReposted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

 const mainthread = isRepost ? originalThreadId : threadId

  useEffect(() => {
    const check = reposts.find(
      (element) => element.author === session.data?.user._id && !element.content
    )
    if (check) {
      setReposted(true)
    } else {
      setReposted(false)
    }
    setCount(reposts.length);
  }, [reposts, session.data?.user._id])


  function handleRepost() {
    repostThread(mainthread, session.data?.user._id)
      .then((res) => {
        if (res.success === true) {
          setCount((prev) => prev + 1);
          setReposted(true);
          toast({
            title: "Success",
            description: "Reposted thread",
          });
        }
      })
      .catch((error) => {
        console.error("Error reposting:", error);
      });
    setPopoverOpen(false);
  }

  function handleRemoveRepost() {
    removeRepostThread( mainthread, session.data?.user._id)
      .then((res) => {
        if (res.success === true) {
          setCount((prev) => prev - 1);
          setReposted(false);
          toast({
            title: "Success",
            description: "Removed repost",
          });
        }
      })
      .catch((error) => {
        console.error("Error removing repost:", error);
      });
    setPopoverOpen(false);
  }

  return (
    <div>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2">
            <button disabled={!session.data?.user}>
              {RepostIcon({
                fill: reposted ? "#08A045" : "#9ba2af",
                width: 20,
                height: 20,
              })}
            </button>
            <span>{count}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col dark bg-[#181818] w-36 p-2">
          <QuoteCard id={(isRepost)?originalThreadId:threadId}/>
          {reposted ? (
            <div className="flex items-center justify-center hover:bg-[#262626] rounded p-2 ">
              <button
                onClick={handleRemoveRepost}
                className="bg-transparent text-red-500 font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-around hover:bg-[#262626] rounded p-2 ">
                <button
                  onClick={handleRepost}
                  className="bg-transparent text-white font-semibold"
                >
                  Repost
                </button>
                {RepostIcon({
                  width: 16,
                  height: 16,
                })}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
