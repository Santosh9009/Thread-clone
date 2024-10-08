import MainCardWrapper from "@/components/cards/MainCardWrapper";
import { getUser } from "@/lib/actions/user.actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabs } from "@/constants";
import {
  getUserReposts,
  UserComments,
  UserThreads,
} from "@/lib/actions/thread.actions";
import ProfileReplies from "@/components/uiCompoents/Profile-Replies";
import ProfileCard from "@/components/cards/Profilecard";
import { ObjectId } from "mongodb";
import LoadUserThreads from "@/components/Loadmore/LoadUserThread";
import LoadReposts from "@/components/Loadmore/LoadRepost";
import { useEffect, useState } from "react";
import { User } from "@/types/Thread";
import { Loader } from "lucide-react";

async function Profile({ params }: { params: { id: ObjectId } }) {
  const userId = params.id;

  const { user } = await getUser(userId);
  const { userThreads } = await UserThreads(userId, 1);
  const { comments } = await UserComments(userId, 1);
  const { Reposts } = await getUserReposts(userId, 1);


  
  return (
    <div>
      <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        {<><ProfileCard
          authorId={userId.toString()}
          name={user?.name || ""}
          bio={user?.bio || ""}
          username={user?.username || ""}
          followers={user?.followers || []}
          following={user?.following || []}
          avatarUrl={user?.avatarUrl}
        />

        <div className="flex mt-4 w-full">
          <Tabs defaultValue="Threads" className="w-full">
            <TabsList className="flex justify-evenly w-full bg-transparent">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  className="border-b-[.01rem] border-[#323232] data-[state=active]:text-white data-[state=active]:bg-transparent  data-[state=active]:border-b-2 data-[state=active]:border-b-white w-1/3 rounded-none pb-3"
                  key={index}
                  value={tab.name}
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab, index) => (
              <TabsContent className="" key={index} value={tab.name}>
                {/* User threads */}
                {tab.name === "Threads" ? (
                  userThreads && userThreads.length > 0 ? (
                    <LoadUserThreads threads={userThreads} userId={userId} />
                  ) : (
                    <div className="text-center py-3 text-slate-700">{tab.defaultValue}</div>
                  )
                ) : null}

                {/* User comments */}
                {tab.name === "Replies" ? (
                  comments && comments.length > 0 ? (
                    <ProfileReplies
                      user={user}
                      comments={comments}
                      userId={userId}
                    />
                  ) : (
                    <div className="text-center py-3 text-slate-700">{tab.defaultValue}</div>
                  )
                ) : null}

                {/* User reposts */}
                {tab.name === "Reposts" ? (
                  Reposts && Reposts.length > 0 ? (
                    <LoadReposts reposts={Reposts} userId={userId} />
                  ) : (
                    <div className="text-center py-3 text-slate-700">{tab.defaultValue}</div>
                  )
                ) : null}
              </TabsContent>
            ))}
          </Tabs>
        </div></>}
      </MainCardWrapper>
    </div>
  );
}

export default Profile;
