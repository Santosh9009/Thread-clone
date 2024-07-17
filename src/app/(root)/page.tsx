"use client";
import { useEffect, useState } from "react";
import CreateThread from "@/components/cards/CreateThread";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchallThreads } from "@/lib/actions/thread.actions";
import { PostType } from "@/types/Thread";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [threads, setThreads] = useState<PostType[]>([]);
  const [isNext, setIsNext] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    async function fetchThreads() {
      try {
        const pageSize = 5;
        const { allposts } = await fetchallThreads(pageNumber, pageSize);
        console.log(allposts);
        setThreads(prevthread=>[...prevthread,...allposts.posts]);
        setIsNext(allposts.isNext);
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
        {threads.map((thread, index) => (
          <ThreadCard
            key={index}
            id={thread._id}
            // @ts-ignore
            author={thread.author}
            contentSnippet={thread.content}
            commentsCount={thread.comments.length}
            upvotesCount={thread.likes.length}
            repostCount={thread.reposts.length}
            timestamp={thread.createdAt}
          />
        ))}
         {isNext && (
        <div className="absolute bottom-10 left-24">
          <Button
            className=""
            onClick={() =>
              setPageNumber((prevPageNumber) => prevPageNumber + 1)
            }
          >
            Load More
          </Button>
        </div>
      )}
      </MainCardWrapper>
    </div>
  );
}
