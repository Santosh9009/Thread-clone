import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ProfileCard from "@/components/cards/Profilecard";
import { getUser } from "@/lib/actions/user.actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabs } from "@/constants";
import { UserComments, UserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import ProfileReplies from "@/components/uiCompoents/Profile-Replies";

async function Profile({ params }: { params: { id: string } }) {
  const userId = params.id;

  const user = await getUser(userId);
  const {userThreads} = await UserThreads(userId);
  const {comments} = await UserComments(userId);

  return (
    <div>
      <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        <ProfileCard
          name={user.name}
          username={user.username}
          followers={user.followers.length}
          following={user.following.length}
        />

        <div className="flex mt-4 w-full">
          <Tabs defaultValue="Threads" className="w-full">
            <TabsList className="flex justify-evenly w-full bg-transparent">
              {tabs.map((tab, index) => (
                <TabsTrigger className="border-b-[.01rem] border-[#323232] data-[state=active]:text-white data-[state=active]:bg-transparent  data-[state=active]:border-b-2 data-[state=active]:border-b-white w-1/3 rounded-none pb-3" key={index} value={tab.name}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab, index) => (
              <TabsContent className="" key={index} value={tab.name}>
                {/* User threads */}
               {tab.name === "Threads" && (
                  <>
                    {userThreads && userThreads.map((thread: any, index: number) => (
                      <ThreadCard
                        key={index}
                        id={thread._id.toString()}
                        author={thread.author.username}
                        authorId={thread.author._id}
                        contentSnippet={thread.content}
                        commentsCount={thread.comments.length}
                        upvotes={thread.likes}
                        repostCount={thread.reposts.length}
                        timestamp={thread.createdAt}
                      />
                    ))|| tab.value}
                  </>
                )}

                {/* User comments */}
               {tab.name === "Replies" && (
                  <>
                    {<ProfileReplies comments={comments}/> || tab.value}
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </MainCardWrapper>
    </div>
  );
}

export default Profile;
