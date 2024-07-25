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
import LikeButton from "../uiCompoents/LikeButton";
import { Sharepop } from "../uiCompoents/Sharepop";
import Threadbutton from "../uiCompoents/Threadbutton";

interface ThreadCardProps {
  br?: boolean;
  id: any;
  author: string;
  contentSnippet: string;
  commentsCount: number;
  upvotes: any[]; // Assuming upvotes is an array of user ids
  repostCount: number;
  timestamp: Date;
  authorId: any;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  br = true,
  id,
  author,
  authorId,
  contentSnippet,
  commentsCount,
  upvotes,
  repostCount,
  timestamp,
}) => {


  // function handleclick(event: React.MouseEvent) {
  //   event.stopPropagation();
  //   event.preventDefault();
  // }

  return (
    <Link href={`/thread/${id}`} passHref>
      <div
        className={`bg-[#181818] shadow-md overflow-hidden ${
          br ? "border-b-[.05rem] border-[#323232" : ""
        }] py-4 px-8`}
      >
        <div className="flex items-start">
          <Image
            src={DummyUserIcon}
            alt={author}
            className="w-10 rounded-full object-cover"
          />
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Link href={`/profile/${authorId}`}>
                  <h3 className="text-base font-semibold text-slate-200 hover:underline">
                    {author && "@" + author}
                  </h3>
                </Link>
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
            <Threadbutton id={id} commentsCount={commentsCount} upvotes={upvotes} repostCount={repostCount}/>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
