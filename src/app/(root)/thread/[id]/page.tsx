import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";

  export default function Page() {
    return (
      <>
      <div className="md:h[10vh]"></div>
        <MainCardWrapper>
          <div>
          <ThreadCard
          title="How to Use Next.js with Tailwind CSS"
          author="Jane Doe"
          authorUsername="janedoe"
          contentSnippet="In this thread, we will explore how to set up Next.js with Tailwind CSS for a great development experience."
          commentsCount={12}
          upvotesCount={45}
          repostCount={3}
          authorAvatar="/path/to/avatar.jpg"
          timestamp={new Date("2024-07-01T10:00:00Z")}
        />  
          </div>  
        </MainCardWrapper>
      </>
    );      
  }