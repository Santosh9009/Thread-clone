import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import LoadActivity from "@/components/Loadmore/LoadActivity";
import { getUserActivities } from "@/lib/actions/activity.actions";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Activity() {
  const session = await getServerSession(authOptions);
  const userId = session?.user._id;

  const { activities } = await getUserActivities(session?.user._id,1);
  console.log(activities)

  return (
    <div>
      <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        {/* <div className="flex flex-col justify-center items-center h-screen space-y-10 bg-white">
          <h1 className="text-2xl font-bold text-black">Under Construction</h1>
          <Image className="rounded-md"
            src="/assests/under-construction.gif"
            alt="Under Construction"
            width={400}
            height={400}
            unoptimized // Prevents Next.js from optimizing the GIF, preserving its animation
          />
        </div> */}
        <LoadActivity userId={userId} activity={activities}/>

      </MainCardWrapper>
    </div>
  );
}
