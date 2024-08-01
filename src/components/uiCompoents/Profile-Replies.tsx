import { ThreadType } from "@/lib/Model/Thread";
import ThreadCard from "../cards/ThreadCard";

export default function ProfileReplies({
  comments,
  user,
}: {
  comments: ThreadType[];
  user: string;
}) {
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
                  id={thread.parentId._id.toJSON()}
                  authorId={thread.author._id.toJSON()}
                  author={thread.parentId.author.username}
                  contentSnippet={thread.parentId.content}
                  commentsCount={thread.parentId.comments.length}
                  upvotes={thread.parentId.likes}
                  reposts={thread.parentId.reposts}
                  timestamp={thread.parentId.createdAt}
                  br={false}
                />
              )}
              <div
                style={{ height: "calc(100% - 4rem)" }}
                className="absolute w-[0.18rem] bg-[#333638] top-[4rem] left-[3.1rem]"
              ></div>
            </div>

            {/* Main Thread Card */}
            <ThreadCard
              key={index}
              id={thread._id.toString()}
              author={user}
              authorId={thread.author._id.toJSON()}
              contentSnippet={thread.content}
              commentsCount={thread.comments.length}
              upvotes={thread.likes}
              reposts={thread.reposts}
              timestamp={thread.createdAt}
            />
          </div>
        ))}
    </div>
  );
}
