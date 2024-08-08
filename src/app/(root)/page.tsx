import CreateThread from "@/components/cards/CreateThread";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import { fetchAllThreads } from "@/lib/actions/thread.actions";
import Loadhome from "@/components/Loadmore/Loadhome";

async function Home() {

  const { posts, isNext } = await fetchAllThreads(1);

  return (
    <div>
      <div className="md:h-[10vh] justify-center items-center font-medium md:block hidden"></div>
      <div className="hidden md:block"></div>
      <MainCardWrapper>
        <CreateThread />
        <Loadhome threads={posts} Next={isNext} />
      </MainCardWrapper>
    </div>
  );
}

export default Home;
