"use client";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserReposts } from "@/lib/actions/thread.actions";
import { ObjectId } from "mongodb";
import RepostCard from "../cards/RepostCard";

export default function LoadReposts({
  reposts,
  userId,
}: {
  reposts: any[];
  userId: ObjectId;
}) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<any[]>(reposts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getReposts = async () => {
      setLoading(true);
      try {
        const res = await getUserReposts(userId, page);
        if (res.Reposts.length > 0) {
          setData((prevData) => [...prevData, ...res.Reposts]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inView && !loading && hasMore) {
      getReposts();
    }
  }, [inView, hasMore]);

  return (
    <>
      {data.map((thread: any, index: number) => (
        <RepostCard
          key={index}
          id={thread._id}
          authorId={thread.originalThread?.author._id}
          author={thread.originalThread?.author}
          contentSnippet={thread.originalThread?.content}
          commentsCount={thread.originalThread?.comments.length}
          upvotes={thread.originalThread?.likes}
          reposts={thread.originalThread?.reposts}
          timestamp={thread.originalThread?.createdAt}
          repostauthor={thread.author}
          isRepost={thread.isRepost}
          repostTime={thread.createdAt}
          originalThread={thread.originalThread}
          photos={thread.originalThread.photos}
        />
      ))}

      <div ref={ref}>
        {loading && hasMore && (
          <Loader2 className="w-full mx-auto animate-spin my-5" />
        )}
      </div>
    </>
  );
}
