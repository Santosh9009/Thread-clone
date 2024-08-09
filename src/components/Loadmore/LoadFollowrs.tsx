"use client";
import { useInView } from "react-intersection-observer";
import { Loader } from "lucide-react";
import { useEffect,useState } from "react";
import { ObjectId } from "mongodb";
import { getFollowers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";

export default function LoadFollowers({
  userId,
}: {
  userId: string;
}) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const res = await getFollowers(userId, page);
        if (res.Followers.length > 0) {
          setData((prevData) => [...prevData, ...res.Followers]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      } finally {
        setLoading(false);
      }
    };


    if (inView && !loading) {
      fetchFollowers();
    }
  }, [inView, loading]);

  return (
    <>
      {data.length > 0
        ? data.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              username={user.username}
              followers={user.followers}
              userId={user._id}
            />
          ))
        : !data && <div className="text-center">No users found</div>}

      <div ref={ref}>
        {loading && hasMore && (
          <Loader className="w-full mx-auto animate-spin my-5" />
        )}
      </div>
    </>
  );
}
