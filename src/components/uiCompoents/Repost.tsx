"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RepostIcon } from "../../../public/assests/Images";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { repostThread } from "@/lib/actions/thread.actions";
import { ObjectId } from "mongodb";
import { toast } from "../ui/use-toast";
import QuoteCard from "./Quote";
export default function Repost({
  author,
  authorId,
  contentSnippet,
  reposts,
  threadId,
}: {
  author: string;
  authorId: any;
  contentSnippet: string;
  reposts: any[];
  threadId: ObjectId;
}) {
  const [count, setCount] = useState<number>(0);
  const session = useSession();
  const [reposted, setReposted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const check = reposts.find(
      (element) => element.author === session.data?.user._id
    );
    setReposted(!!check);
    setCount(reposts.length);
  }, []);

  function handleRepost() {
    repostThread(threadId, session.data?.user._id,undefined)
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


  // function handleQuoteRepost() {
  //   repostThread(threadId, session.data?.user._id, quoteContent)
  //     .then((res) => {
  //       if (res.success === true) {
  //         setCount((prev) => prev + 1);
  //         setReposted(true);
  //         toast({
  //           title: "Success",
  //           description: "Quoted and reposted thread",
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error quoting and reposting:", error);
  //     });
  //   setPopoverOpen(false);
  // }

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
          <QuoteCard  author={author} authorId={authorId} contentSnippet={contentSnippet}/>
          {reposted ? (
            <div className="flex items-center justify-center hover:bg-[#262626] rounded p-2 ">
              <button className="bg-transparent text-red-500 font-semibold">
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-around hover:bg-[#262626] rounded  p-2 ">
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
