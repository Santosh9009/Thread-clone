// components/MetaThreadCard.tsx
import React from 'react';
import Image from 'next/image';
import { CommentIcon, RepostIcon, ThreeDotIcon } from '../../../public/assests/Images';
import { Share2Icon } from 'lucide-react';
import DummyUserIcon from '../../../public/assests/profile-picture.png';

interface MetaThreadCardProps {
  author: string,
  contentSnippet: string;
  commentsCount: number;
  upvotesCount: number;
  repostCount: number;
  timestamp: Date;
}

const ThreadCard: React.FC<MetaThreadCardProps> = ({
  author,
  contentSnippet,
  commentsCount,
  upvotesCount,
  repostCount,
  timestamp,
}) => {
  return (
    <div className="bg-[#181818] shadow-md overflow-hidden border-b-[.05rem] border-[#323232] py-4 px-8">
      <div className="flex items-start">
        <Image
          src={DummyUserIcon}
          alt={author}
          className="w-10 rounded-full object-cover"
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-slate-200">{author}</h3>
              {/* <p className="text-gray-400 text-sm">@{authorUsername} • {new Date(timestamp).toLocaleDateString()}</p> */}
            </div>
            <div className="text-gray-400">
              {/* Add options icon here */}
              <button>
              {ThreeDotIcon({ fill: "#9CA3AF",width:15,  height: 18 })}
              </button>
            </div>
          </div>
          <p className="text-gray-300 mt-2 font-light">{contentSnippet}</p>
          <div className="flex justify-start mt-4 text-gray-400 space-x-8">
            <div className="flex items-center space-x-2">
              <button>
              {CommentIcon({ fill: "#9CA3AF", width: 20, height: 20 })}
              </button>
              <span>{commentsCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button>
              <Share2Icon fill="#9CA3AF" width={20} height={20} />
              </button>
              <span>{upvotesCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button>
              {RepostIcon({ fill: "#9CA3AF", width: 20, height: 20 })}
              </button>
              <span>{repostCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
