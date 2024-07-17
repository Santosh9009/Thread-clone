import MainCardWrapper from "@/components/cards/MainCardWrapper";
import ProfileCard from "@/components/cards/Profilecard";
import { getUser } from "@/lib/actions/user.actions";

async function Profile({params}:{params:{id:string}}) {
  const userId = params.id;

  const user = await getUser(userId);
  console.log(user);


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
      </MainCardWrapper>
    </div>
  );
}

export default Profile;
