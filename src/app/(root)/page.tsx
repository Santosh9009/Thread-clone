"use client"
import { useEffect, useState } from 'react';
import CreateThread from "@/components/cards/CreateThread";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchallThreads } from '@/lib/actions/thread.actions';
import { ThreadType } from '@/lib/Model/Thread';

export default function Home() {
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [isNext, setIsNext] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    async function fetchThreads() {
      try {
        const { posts, isNext } = await fetchallThreads(pageNumber, 20);
        setThreads(prevThreads => [...prevThreads, ...posts]);
        setIsNext(isNext);
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      }
    }

    fetchThreads();
  }, [pageNumber]);

  return (
    <div>
      <div className="md:h-[10vh] justify-center items-center font-medium md:block hidden"></div>
      <MainCardWrapper>
        <CreateThread />
        {threads.map((thread,index) => (
          <ThreadCard
            key={index}
            author={thread.author.toString()}
            contentSnippet={thread.content}
            commentsCount={thread.comments.length}
            upvotesCount={thread.likes.length}
            repostCount={thread.reposts.length}
            timestamp={thread.createdAt}
          />
        ))}
      </MainCardWrapper>
      {isNext && <button onClick={() => setPageNumber(prevPageNumber => prevPageNumber + 1)}>Load More</button>}
    </div>
  );
}
