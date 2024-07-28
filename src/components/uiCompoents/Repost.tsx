"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RepostIcon } from "../../../public/assests/Images";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
export default function Repost({ reposts }: { reposts: [] }) {
  const [ count, setCount ] = useState<number>(0);
  const session = useSession();
  const [reposted , setReposted ] = useState(false);

  // useEffect(()=>{
  //   const check = reposts.find((element) => element === session.data?.user._id);
  //   setReposted(!!check);
  //   setCount(reposts.length);
  // },[reposted])

  function handleRepost(){
    
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2">
            <button>
              {RepostIcon({
                fill: "#9CA3AF",
                width: 20,
                height: 20,
              })}
            </button>
            <span>{reposts}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col dark bg-[#181818] w-36 p-3">
          <div className="flex items-center justify-around hover:bg-[#262626] rounded p-2 ">
            <button className="bg-transparent text-white font-semibold">
              Quote
            </button>
            <Quote width={16} height={16} />
          </div>
          <div className="flex items-center justify-around hover:bg-[#262626] rounded  p-2 ">
            <button disabled={!session.data?.user} onClick={handleRepost} className="bg-transparent text-white font-semibold">
              Repost
            </button>
            {RepostIcon({
              width: 16,
              height: 16,
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
