import MainCardWrapper from "@/components/cards/MainCardWrapper";
import Image from "next/image";

export default function Activity() {
  return (
    <div>
      <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        <div className="flex flex-col justify-center items-center h-screen space-y-10 bg-white">
          <h1 className="text-2xl font-bold text-black">Under Construction</h1>
          <Image className="rounded-md"
            src="/assests/under-construction.gif"
            alt="Under Construction"
            width={400}
            height={400}
            unoptimized // Prevents Next.js from optimizing the GIF, preserving its animation
          />
        </div>
      </MainCardWrapper>
    </div>
  );
}
