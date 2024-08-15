import { timeAgo } from "@/helpers/CalculateTime";
import Image from "next/image";
import Link from "next/link";
import DummyUserIcon from "../../../../public/assests/profile-picture.png";

export default function CommentActivityCard({ activity }: { activity: any }) {
  return (
    <div className="activity-card p-4 rounded-lg mb-4 bg-[#222] hover:bg-[#333] transition-colors duration-200">
      <div className="flex items-start">
        {/* User Avatar */}
        <Image
          src={activity.actor.profilePicture || DummyUserIcon}
          alt={activity.actor.username}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-4 flex-grow">
          {/* Activity Description */}
          <div className="flex justify-between text-gray-200">
            <div>
              <Link href={`/profile/${activity.actor._id}`}>
                <span className="font-semibold hover:underline">
                  @{activity.actor.username}
                </span>
              </Link>
              <span className="ml-1 text-gray-400">commented on your thread</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {timeAgo(activity.createdAt)}
            </div>
          </div>

          {/* View Thread Link */}
          {activity.thread && (
            <Link href={`/thread/${activity.thread}`}>
              <div className="py-2 text-blue-400">
                <p className="text-sm line-clamp-2 hover:underline">
                  View Thread
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}