import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";

  export default function Thread({params}:{params:{id:string}}) {


    return (
      <>
      <div className="md:h[10vh]"></div>
        <MainCardWrapper>
          <div>
          <ThreadCard
          author="Jane Doe"
          contentSnippet="In this thread, we will explore how to set up Next.js with Tailwind CSS for a great development experience."
          commentsCount={12}
          upvotesCount={45}
          repostCount={3}
          timestamp={new Date("2024-07-01T10:00:00Z")}
        />  
          </div>  
        </MainCardWrapper>
      </>
    );      
  }