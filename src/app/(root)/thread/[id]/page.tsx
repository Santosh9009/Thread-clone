import MainCardWrapper from "@/components/cards/MainCardWrapper";
import QuoteCard from "@/components/cards/QuoteCard";
import RepostCard from "@/components/cards/RepostCard";
import ThreadCard from "@/components/cards/ThreadCard";
import PostComment from "@/components/forms/CommnetForm";
import { getThread } from "@/lib/actions/thread.actions";
import { ArrowLeft } from "lucide-react";
import { ObjectId } from "mongodb";
import Link from "next/link";

async function Thread({ params }: { params: { id: ObjectId } }) {
  if (!params.id) return null;

  // @ts-ignore
  const { post }: any = await getThread(params.id);
  const thread = post.thread;

  if (!post.thread) {
    return <div>Thread not found</div>;
  }

  const comments = thread.isRepost
    ? thread.originalThread?.comments || []
    : thread.comments || [];

  return (
    <div>
      <div className="md:h-[10vh] md:flex items-center justify-between hidden px-3">
        <Link href={'/'} className="hover:bg-[#2b2b2b] rounded-full p-1">
          <ArrowLeft width={25} height={25} />
        </Link>
        <p>Thread</p>
        <div></div>
      </div>
      <MainCardWrapper>
        {thread.isQuote && thread.originalThread ? (
          <QuoteCard
            // @ts-ignore
            id={thread._id}
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
            id={thread._id}
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
            photos={thread?.photos}
          />
        )}
        <div className="p-5 font-medium text-lg border-b-[.05rem] border-[#323232]">
          Replies
        </div>
        <PostComment
          ThreadId={thread.isRepost ? thread.originalThread._id : params.id}
        />
        <div>
          {comments.map((comment: any, index: number) => (
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
          ))}
        </div>
      </MainCardWrapper>
    </div>
  );
}

export default Thread;
