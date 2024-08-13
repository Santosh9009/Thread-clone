"use client";
import { Loader } from "lucide-react";
import { getUserActivities } from "@/lib/actions/activity.actions";
import { useEffect, useId, useState } from "react";
import { useInView } from "react-intersection-observer";
import LikeActivityCard from "../cards/Activity/LikeActivityCard";
import CommentActivityCard from "../cards/Activity/CommentActivityCard";
import RepostActivityCard from "../cards/Activity/RepostActivityCard";
import FollowActivityCard from "../cards/Activity/FollowActivityCard";
import QuoteActivityCard from "../cards/Activity/QuoteActivityCard";
import { ObjectId } from "mongodb";

export default function LoadActivity({
  userId,
  activity,
}: {
  userId: ObjectId;
  activity: any[];
}) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<any[]>(activity);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await getUserActivities(userId, page);
        if (res.activities.length > 0) {
          setData((prevData) => [...prevData, ...res.activities]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inView && !loading && hasMore) {
      fetchActivities();
    }
  }, [inView, hasMore]);

  return (
    <>
      {data.length > 0 ? (
        <ul>
          {data.map(
            (activity) =>
              activity.actor._id !== activity.recipient._id && (
                <li key={activity._id}>
                  {activity.type === "like" && (
                    <LikeActivityCard activity={activity} />
                  )}
                  {activity.type === "comment" && (
                    <CommentActivityCard activity={activity} />
                  )}
                  {activity.type === "repost" && (
                    <RepostActivityCard activity={activity} />
                  )}
                  {activity.type === "follow" && (
                    <FollowActivityCard activity={activity} />
                  )}
                  {activity.type === "quote" && (
                    <QuoteActivityCard activity={activity} />
                  )}
                </li>
              )
          )}
        </ul>
      ) : (
        <div className="flex justify-center items-start h-screen py-20 font-medium">
          No Activity
        </div>
      )}

      <div ref={ref}>
        {loading && hasMore && (
          <Loader className="w-full mx-auto animate-spin my-5" />
        )}
      </div>
    </>
  );
}
