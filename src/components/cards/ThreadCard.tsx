// components/MetaThreadCard.tsx
import React from 'react';
import Image from 'next/image';
import { CommentIcon, RepostIcon } from '../../../public/assests/Images';
import { Share2Icon } from 'lucide-react';
import DummyUserIcon from '../../../public/assests/profile-picture.png';

interface MetaThreadCardProps {
  title: string;
  author: string;
  authorUsername: string;
  contentSnippet: string;
  commentsCount: number;
  upvotesCount: number;
  repostCount: number;
  authorAvatar: string;
  timestamp: Date;
}

const ThreadCard: React.FC<MetaThreadCardProps> = ({
  title,
  author,
  authorUsername,
  contentSnippet,
  commentsCount,
  upvotesCount,
  repostCount,
  authorAvatar,
  timestamp,
}) => {
  return (
    <div className="bg-[181818] shadow-md overflow-hidden border-b-[.05rem] border-[#323232] p-5">
      <div className="flex items-start">
        <Image
          src={DummyUserIcon}
          alt={author}
          className="w-10 rounded-full object-cover"
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-white">{author}</h3>
              {/* <p className="text-gray-400 text-sm">@{authorUsername} • {new Date(timestamp).toLocaleDateString()}</p> */}
            </div>
            <div className="text-gray-400">
              {/* Add options icon here */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <p className="text-gray-300 mt-2">{contentSnippet}</p>
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
