import { ThreadType } from "@/lib/Model/Thread";
import ThreadCard from "../cards/ThreadCard";

export default function ProfileReplies({
  comments,
}: {
  comments: ThreadType[];
}) {
  // console.log(comments);
  return (
    <div>
      {comments &&
        comments.map((thread: any, index: number) => (
          <div key={index}>
            {/* Parent Thread Card (if exists) */}
            <div className="relative">
              {thread.parentId && (
                <ThreadCard
                  key={index}
                  id={thread.parentId._id.toString()}
                  authorId={thread.author._id}
                  author={thread.parentId.author.username}
                  contentSnippet={thread.parentId.content}
                  commentsCount={thread.parentId.comments.length}
                  upvotes={thread.parentId.likes}
                  repostCount={thread.parentId.reposts.length}
                  timestamp={thread.parentId.createdAt}
                />
              )}
              <div
                style={{ height: "calc(100% - 2.5rem)" }}
                className="absolute w-[0.2rem] bg-slate-600 top-14 left-12"
              ></div>
            </div>

            {/* Main Thread Card */}
            <ThreadCard
              key={index}
              id={thread._id.toString()}
              author={thread.author.name}
              authorId={thread.author._id}
              contentSnippet={thread.content}
              commentsCount={thread.comments.length}
              upvotes={thread.likes}
              repostCount={thread.reposts.length}
              timestamp={thread.createdAt}
            />
          </div>
        ))}
    </div>
  );
}
