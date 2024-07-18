import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ProfileCard from "@/components/cards/Profilecard";
import { getUser } from "@/lib/actions/user.actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabs } from "@/constants";

async function Profile({ params }: { params: { id: string } }) {
  const userId = params.id;

  const user = await getUser(userId);

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
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="flex justify-evenly w-full bg-transparent">
              {tabs.map((tab, index) => (
                <TabsTrigger className="data-[state=active]:text-white data-[state=active]:bg-transparent  data-[state=active]:border-b-2 w-1/3 rounded-none" key={index} value={tab.name}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="border-b-[0.01rem] border-[#323232]"></div>
            {tabs.map((tab, index) => (
              <TabsContent className="text-center" key={index} value={tab.name}>
                {!tab.value ? tab.defaultValue : tab.value}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </MainCardWrapper>
    </div>
  );
}

export default Profile;
