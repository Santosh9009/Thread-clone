
import { ThreadType } from "@/lib/Model/Thread";
import ThreadCard from "../cards/ThreadCard";

export default function ProfileReplies({ comments }: { comments: ThreadType[] }) {
  // console.log(comments);
  return (
    <div>
      {comments &&
        comments.map((thread: any, index: number) => (
          <div className="relative" key={index}>
            {/* Parent Thread Card (if exists) */}
            {thread.parentId && (
              <ThreadCard
                key={index}
                id={thread.parentId._id.toString()}
                author={thread.parentId.author.name}
                contentSnippet={thread.parentId.content}
                commentsCount={thread.parentId.comments.length}
                upvotes={thread.parentId.likes}
                repostCount={thread.parentId.reposts.length}
                timestamp={thread.parentId.createdAt}
              />
            )}

            {/* Main Thread Card */}
            <ThreadCard
              key={index}
              id={thread._id.toString()}
              author={thread.author.name}
              contentSnippet={thread.content}
              commentsCount={thread.comments.length}
              upvotes={thread.likes}
              repostCount={thread.reposts.length}
              timestamp={thread.createdAt}
            />
            <div className="absolute h-[60%] w-1 bg-slate-400 top-5 left-10"></div>
          </div>
        ))}
    </div>
  );
}
