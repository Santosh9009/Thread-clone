"use client"
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";
import  PostComment  from "@/components/forms/CommnetForm";

  export default function Thread({params}:{params:{id:string}}) {

    return (
      <div>
      <div className="md:h-[10vh] flex items-center justify-center">Thread    </div>
        <MainCardWrapper>
          <ThreadCard
          // @ts-ignore
          id={params.id}
          author={{name:"santosh"}}
          contentSnippet="In this thread, we will explore how to set up Next.js with Tailwind CSS for a great development experience."
          commentsCount={12}
          upvotesCount={45}
          repostCount={3}
          timestamp={new Date("2024-07-01T10:00:00Z")}
        />    
        <PostComment ThreadId={params.id}/>
        </MainCardWrapper>
      </div>
    );      
  }