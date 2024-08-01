"use client";
import { useEffect, useState, useRef } from "react";
import CreateThread from "@/components/cards/CreateThread";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchallThreads } from "@/lib/actions/thread.actions";
import { PostType } from "@/types/Thread";
import { Loader, Loader2 } from "lucide-react";

export default function Home() {
  const [threads, setThreads] = useState<PostType[]>([]);
  const [isNext, setIsNext] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchThreads() {
      setLoading(true)
      try {
        const { allposts } = await fetchallThreads(pageNumber);
        setThreads((prevThreads) => [...prevThreads, ...allposts.posts]);
        setIsNext(allposts.isNext);
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      }finally {
        setLoading(false);
      }
    }
    
    fetchThreads();
  }, [pageNumber]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && isNext) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isNext]);

  return (
    <div>
      <div className="md:h-[10vh] justify-center items-center font-medium md:block hidden"></div>
      <div className="hidden md:block"></div>
      <MainCardWrapper>
        <CreateThread />
        {threads.length<1 && <Loader className="w-full mx-auto animate-spin mt-24"/>}
        {threads.map((thread, index) => (
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
          />
        ))}
        <div ref={loadMoreRef} className="load-more-trigger" />
        {loading && threads.length > 0 && <Loader2 className="w-full mx-auto animate-spin mt-4"/>}
      </MainCardWrapper>
    </div>
  );
}
