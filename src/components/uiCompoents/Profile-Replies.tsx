"use client";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { UserComments } from "@/lib/actions/thread.actions";
import ThreadCard from "../cards/ThreadCard";
import { ObjectId } from "mongodb";
import { Loader2 } from "lucide-react";

export default function ProfileReplies({
  comments,
  user,
  userId,
}: {
  comments: any[];
  user: string;
  userId: ObjectId;
}) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<any[]>(comments);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await UserComments(userId, page);
        if (res.comments.length > 0) {
          setData((prevData) => [...prevData, ...res.comments]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false); // No more comments to load
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inView && !loading && hasMore) {
      fetchComments();
    }
  }, [inView, loading, hasMore]);

  return (
    <div>
      {data &&
        data.map((thread: any, index: number) => (
          <div key={index}>
            {/* Parent Thread Card (if exists) */}
            <div className="relative">
              {thread.parentId && (
                <ThreadCard
                  id={thread.parentId._id}
                  authorId={thread.parentId.author._id}
                  author={thread.parentId.author.username}
                  contentSnippet={thread.parentId.content}
                  commentsCount={thread.parentId.comments.length}
                  upvotes={thread.parentId.likes}
                  reposts={thread.parentId.reposts}
                  timestamp={thread.parentId.createdAt}
                  br={false}
                />
              )}
              <div
                style={{ height: "calc(100% - 4rem)" }}
                className="absolute w-[0.18rem] bg-[#333638] top-[4rem] left-[3.1rem]"
              ></div>
            </div>

            {/* Main Thread Card */}
            <ThreadCard
              id={thread._id}
              author={user}
              authorId={thread.author._id}
              contentSnippet={thread.content}
              commentsCount={thread.comments.length}
              upvotes={thread.likes}
              reposts={thread.reposts}
              timestamp={thread.createdAt}
            />
          </div>
        ))}
      <div ref={ref}>
        {loading && hasMore && (
          <Loader2 className="w-full mx-auto animate-spin my-5" />
        )}
      </div>
    </div>
  );
}
