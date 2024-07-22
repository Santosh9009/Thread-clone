// components/MetaThreadCard.tsx
import Image from "next/image";
import {
  CommentIcon,
  RepostIcon,
  ThreeDotIcon,
} from "../../../public/assests/Images";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { timeAgo } from "@/helpers/CalculateTime";
import Link from "next/link";
import { Share2Icon } from "lucide-react";
import LikeButton from "../uiCompoents/LikeButton";

interface ThreadCardProps {
  id: any;
  author: string;
  contentSnippet: string;
  commentsCount: number;
  upvotes: any[]; // Assuming upvotes is an array of user ids
  repostCount: number;
  timestamp: Date;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  author,
  contentSnippet,
  commentsCount,
  upvotes,
  repostCount,
  timestamp,
}) => {
  return (
    <Link href={`/thread/${id}`} passHref>
      <div className="bg-[#181818] shadow-md overflow-hidden border-b-[.05rem] border-[#323232] py-4 px-8">
        <div className="flex items-start">
          <Image
            src={DummyUserIcon}
            alt={author}
            className="w-10 rounded-full object-cover"
          />
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold text-slate-200">
                  {author}
                </h3>
                <p className="text-gray-400 text-sm">
                  {timeAgo(timestamp)}
                </p>
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
            <p className="text-gray-300 mt-2 font-light">
              {contentSnippet}
            </p>
            <div className="flex justify-start mt-4 text-gray-400 space-x-8">
              <div className="flex items-center space-x-2">
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
              <div className="flex items-center space-x-2">
                <button>
                  <Share2Icon fill="#9CA3AF" width={20} height={20} />
                </button>
                <span>{repostCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button>
                  {RepostIcon({
                    fill: "#9CA3AF",
                    width: 20,
                    height: 20,
                  })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
