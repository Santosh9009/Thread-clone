"use client";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "../cards/ThreadCard";
import QuoteCard from "../cards/QuoteCard";
import { ObjectId } from "mongodb";

export default function LoadUserThreads({
  threads,
  userId
}: {
  threads: any[];
  userId: ObjectId;
}) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<any[]>(threads);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [ hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const res = await UserThreads(userId, page);
        if (res.userThreads.length > 0) {
          setData((prevData) => [...prevData, ...res.userThreads]);
          setPage((prevPage) => prevPage + 1);
        }else{
          setHasMore(false)
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inView && !loading && hasMore) {
      fetchThreads();
    }
  }, [inView, hasMore]);

  return (
    <>
      {data.map((thread: any, index: number) =>
        thread.isQuote && thread.originalThread ? (
          <QuoteCard
            key={index}
            id={thread._id}
            authorId={thread.author._id}
            author={thread.author.username}
            contentSnippet={thread.content}
            commentsCount={thread.comments.length}
            upvotes={thread.likes}
            reposts={thread.reposts}
            timestamp={thread.createdAt}
            originalThread={thread.originalThread}
            isRepost={thread.isRepost}
            isQuote={thread.isQuote}
          />
        ) : (
          <ThreadCard
            key={index}
            id={thread._id}
            authorId={thread.author._id}
            author={thread.author.username}
            contentSnippet={thread.content}
            commentsCount={thread.comments.length}
            upvotes={thread.likes}
            reposts={thread.reposts}
            timestamp={thread.createdAt}
            isRepost={thread.isRepost}
            isQuote={thread.isQuote}
          />
        )
      )}

      <div ref={ref}>
        {loading && hasMore && <Loader2 className="w-full mx-auto animate-spin my-5" />}
      </div>
    </>
  );
}
