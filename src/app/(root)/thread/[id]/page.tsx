import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import QuoteCard from "@/components/cards/QuoteCard";
import RepostCard from "@/components/cards/RepostCard";
import ThreadCard from "@/components/cards/ThreadCard";
import PostComment from "@/components/forms/CommnetForm";
import { getThread, togglelike } from "@/lib/actions/thread.actions";
import { ThreadType } from "@/lib/Model/Thread";
import { CommentThread, CommentType, ThreadsType } from "@/types/Thread";
import { ObjectId } from "mongodb";

async function Thread({ params }: { params: { id: ObjectId } }) {
  if (!params.id) return null;

  // @ts-ignore
  const { post }: any = await getThread(params.id);
  const thread = post.thread;

  if (!post.thread) {
    return <div>Thread not found</div>;
  }

  const originalComments = thread?.originalThread?.comments || thread?.comments;

  return (
    <div>
      <div className="md:h-[10vh] md:flex items-center justify-center hidden">
        Thread
      </div>
      <MainCardWrapper>
        {thread.isQuote && thread.originalThread ? (
          <QuoteCard
            // @ts-ignore
            id={params._id}
            authorId={thread.author._id}
            author={thread.author.username}
            contentSnippet={thread.content}
            commentsCount={thread.comments.length}
            upvotes={thread.likes}
            reposts={thread.reposts}
            timestamp={thread.createdAt}
            originalThread={thread.originalThread}
            isRepost={thread.isRepost}
            isQuote={thread.isQuote}
          />
        ) : thread.isRepost && thread.originalThread ? (
          <RepostCard
            id={thread._id}
            authorId={thread.originalThread?.author._id}
            author={thread.originalThread.author.username}
            contentSnippet={thread.originalThread?.content}
            commentsCount={thread.originalThread.comments.length}
            upvotes={thread.originalThread?.likes}
            reposts={thread.originalThread?.reposts}
            timestamp={thread.originalThread?.createdAt}
            repostauthor={thread.author}
            isRepost={thread.isRepost}
            repostTime={thread.createdAt}
            originalThread={thread.originalThread}
            isQuote={thread.isQuote}
          />
        ) : (
          <ThreadCard
            id={params.id}
            // @ts-ignore
            author={thread?.author.username}
            authorId={thread.author._id}
            contentSnippet={thread?.content}
            commentsCount={thread?.comments.length}
            upvotes={thread?.likes}
            reposts={thread?.reposts}
            timestamp={thread?.createdAt}
            isRepost={thread?.isRepost}
            isQuote={thread?.isQuote}
          />
        )}
        <div className="p-5 font-medium text-lg border-b-[.05rem] border-[#323232]">
          Replies
        </div>
        <PostComment ThreadId={thread.isRepost?thread.originalThread._id:params.id} />
        <div>
          {originalComments &&
            originalComments.map(
              (comment: any, index: number) => (
                <ThreadCard
                  key={index}
                  id={comment?._id}
                  author={comment?.author.username}
                  authorId={comment.author._id}
                  contentSnippet={comment?.content}
                  commentsCount={comment.comments.length}
                  upvotes={comment?.likes}
                  reposts={comment?.reposts}
                  timestamp={comment?.createdAt}
                  isRepost={thread?.isRepost}
                />
              )
            )}
        </div>
      </MainCardWrapper>
    </div>
  );
}

export default Thread;
