"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RepostIcon } from "../../../public/assests/Images";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { repostThread } from "@/lib/actions/thread.actions";
import { ObjectId } from "mongodb";
import { toast } from "../ui/use-toast";
export default function Repost({
  reposts,
  threadId,
}: {
  reposts: any[];
  threadId: ObjectId;
}) {
  const [count, setCount] = useState<number>(0);
  const session = useSession();
  const [reposted, setReposted] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const check = reposts.find(
      (element) => element.author === session.data?.user._id && element.content===undefined
    );
    setReposted(!!check);
    setCount(reposts.length);
  }, []);

  function handleRepost() {
    repostThread(threadId, session.data?.user._id, undefined)
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
            <span>{reposts.length}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col dark bg-[#181818] w-36 p-3">
          <div className="flex items-center justify-around hover:bg-[#262626] rounded p-2 ">
            <button className="bg-transparent text-white font-semibold">
              Quote
            </button>
            <Quote width={16} height={16} />
          </div>
          {reposted ? (
            <div className="flex items-center justify-around hover:bg-[#262626] rounded p-2 ">
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
