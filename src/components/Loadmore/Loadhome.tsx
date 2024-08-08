"use client";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "../cards/ThreadCard";
import RepostCard from "../cards/RepostCard";
import QuoteCard from "../cards/QuoteRepostCard";


export default function Loadhome({threads,Next}:{threads:any[],Next:boolean}) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<any[]>(threads);
  const [page, setPage ] = useState(2);
  const [isNext, setIsNext] = useState(Next);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetchAllThreads(page);
        setData((prevData) => [...prevData, ...res.posts]);
        setIsNext(res.isNext);
        if (res.isNext) {
          setPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    if (inView && isNext) {
      fetchThreads();
    }
  }, [inView, isNext]);


 

  return (
    <>
      {data.map((thread: any, index: number) => {
        if (thread.isQuote && thread.originalThread) {
          // It's a quote
          return (
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
          );
        } else if (thread.isRepost && thread.originalThread) {
          // It's a repost
          return (
            <RepostCard
              key={index}
              id={thread._id}
              authorId={thread.originalThread?.author._id}
              author={thread.originalThread.author.username}
              contentSnippet={thread.originalThread?.content}
              commentsCount={thread.originalThread.comments.length}
              upvotes={thread.originalThread?.likes}
              reposts={thread.originalThread?.reposts}
              timestamp={thread.originalThread?.createdAt}
              repostauthor={thread.author}
              isRepost={thread.isRepost}
              repostTime={thread.createdAt}
              originalThread={thread.originalThread}
            />
          );
        } else {
          // It's an original thread
          return (
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
          );
        }
      })}

        <div ref={ref}>
          {isNext && <Loader2 className="w-full mx-auto animate-spin"/>}
        </div>
    </>
  );
}
