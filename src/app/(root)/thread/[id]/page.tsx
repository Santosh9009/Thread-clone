import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";
import PostComment from "@/components/forms/CommnetForm";
import { getThread } from "@/lib/actions/thread.actions";
import { CommentThread, ThreadsType } from "@/types/Thread";

async function Thread({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  // @ts-ignore
  const thread:ThreadsType | null = await getThread({ threadId: params.id });
  console.log(thread);

  if(!thread){
    return <div>Thread not found</div>
  }
  

  return (
    <div>
      <div className="md:h-[10vh] md:flex items-center justify-center hidden">Thread</div>
       <MainCardWrapper>
        <ThreadCard
          id={params.id}
          author={thread?.author}
          contentSnippet={thread?.content}
          commentsCount={thread?.comments.length}
          upvotesCount={thread?.likes.length}
          repostCount={thread?.reposts.length}
          timestamp={thread?.createdAt}
        />
        <div className="p-5 font-medium text-lg border-b-[.05rem] border-[#323232]">Replies</div>
        <PostComment ThreadId={params.id} />
        <div>
        {thread?.comments &&
          thread.comments.map((comment:CommentThread, index:number) => (
            <ThreadCard
              key={index}
              id={params.id}
              author={comment?.author}
              contentSnippet={comment?.content}
              commentsCount={comment?.comments.length}
              upvotesCount={comment?.likes.length}
              repostCount={comment?.reposts.length}
              timestamp={comment?.createdAt}
            />
          ))}
        </div>
      </MainCardWrapper>
    </div>
  );
}

export default Thread;
