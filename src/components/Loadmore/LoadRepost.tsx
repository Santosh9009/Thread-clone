"use client";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserReposts, UserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "../cards/ThreadCard";
import QuoteCard from "../cards/QuoteCard";
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
    const fetchThreads = async () => {
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

    if (inView && !loading) {
      fetchThreads();
    }
  }, [inView, loading]);

  return (
    <>
      {data.map((thread: any, index: number) => (
        <RepostCard
          key={index}
          id={thread._id}
          authorId={thread.originalThread?.author._id}
          author={thread.originalThread?.author?.username}
          contentSnippet={thread.originalThread?.content}
          commentsCount={thread.originalThread?.comments.length}
          upvotes={thread.originalThread?.likes}
          reposts={thread.originalThread?.reposts}
          timestamp={thread.originalThread?.createdAt}
          repostauthor={thread.author.username}
          isRepost={thread.isRepost}
          repostTime={thread.createdAt}
          originalThread={thread.originalThread}
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
