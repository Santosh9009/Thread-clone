import ThreadCard from "@/components/cards/ThreadCard";

export default function Home() {
  return (
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
        timestamp={new Date('2024-07-01T10:00:00Z')}
      />
      <ThreadCard
        title="Top 10 React Hooks You Should Know"
        author="John Smith"
        authorUsername="johnsmith"
        contentSnippet="React hooks are a powerful feature for managing state and side effects. Here are the top 10 hooks you should be familiar with."
        commentsCount={25}
        upvotesCount={78}
        repostCount={3}
        authorAvatar="/path/to/avatar2.jpg"
        timestamp={new Date('2024-07-01T12:00:00Z')}
      />
    </div>
  );
}