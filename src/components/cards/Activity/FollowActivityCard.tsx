import { timeAgo } from "@/helpers/CalculateTime";
import Image from "next/image";
import Link from "next/link";
import DummyUserIcon from "../../../../public/assests/profile-picture.png";
import { UserPlus, UserPlus2 } from "lucide-react";

export default function FollowActivityCard({ activity }: { activity: any }) {
  return (
    <div className="activity-card follow-activity p-4 rounded-lg mb-4 bg-[#181818] border border-[#2e2e2e]">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <Image
            src={DummyUserIcon}
            alt={activity.actor.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex items-center text-gray-300 space-x-2">
          <div>
            <Link href={`/profile/${activity.actor._id}`}>
              <span className="font-semibold hover:underline">
                @{activity.actor.username}
              </span>{" "}
            </Link>
            <span>started following you</span>
          </div>
          <div className="text-sm text-gray-500">
            {timeAgo(activity.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
