import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ThreadCard from "@/components/cards/ThreadCard";
import PostComment from "@/components/forms/CommnetForm";
import { getThread, togglelike } from "@/lib/actions/thread.actions";
import { ThreadType } from "@/lib/Model/Thread";
import { CommentThread, CommentType, ThreadsType } from "@/types/Thread";
import { ObjectId } from "mongoose";

async function Thread({ params }: { params: { id: ObjectId } }) {
  if (!params.id) return null;

  // @ts-ignore
  const {post}:any = await getThread(params.id);
  const thread = post.thread;
  // console.log(post.thread)

  if(!post.thread){
    return <div>Thread not found</div>
  }
  

  return (
    <div>
      <div className="md:h-[10vh] md:flex items-center justify-center hidden">Thread</div>
       <MainCardWrapper>
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
        />
        <div className="p-5 font-medium text-lg border-b-[.05rem] border-[#323232]">Replies</div>
        <PostComment ThreadId={params.id} />
        <div>
        {thread?.comments &&
          thread.comments.map((comment:any, index:number) => (
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
            />
          ))}
        </div>
      </MainCardWrapper>
    </div>
  );
}

export default Thread;
