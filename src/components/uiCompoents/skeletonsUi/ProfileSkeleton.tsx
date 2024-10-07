import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center p-8 text-white w-full">
      <div className="w-full flex justify-between items-center">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>

        <Skeleton className="h-24 w-24 rounded-full" />
      </div>

      <div className="flex flex-col mb-5 w-full">
        <Skeleton className="h-4 w-full mt-4 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />

        <div className="flex justify-start space-x-6 mb-5 w-full">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>

      <div className="flex justify-evenly w-full space-x-4 mt-3">
        <Skeleton className="h-10 w-1/2 rounded-xl" />
        <Skeleton className="h-10 w-1/2 rounded-xl" />
      </div>
    </div>
  );
};
