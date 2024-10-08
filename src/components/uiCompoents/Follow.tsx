import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

const Follow = ({
  followers,
  targetId,
}: {
  followers: any[];
  targetId: any;
}) => {
  const [isfollowed, setIsfollowed] = useState(false);
  const { data } = useSession();
  const userId = data?.user._id;

  useEffect(() => {
    const result = followers.find((element) => element === userId);
    setIsfollowed(!!result);
  }, [userId]);

  // const handlefollow = async () => {
  //   setIsfollowed(!isfollowed)
  //   toggleFollowUser(userId, targetId)
  //     .then((res) => {
  //       if (res.isFollowing) {
  //         setIsfollowed(!isfollowed);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };


  const handleFollow = async () => {
    // Optimistically toggle UI state
    const newFollowState = !isfollowed;
    setIsfollowed(newFollowState);
  
    try {
      if (newFollowState) {
        // Call follow API
        const res = await followUser(userId, targetId);
        if (!res.success) throw new Error(res.error); // Handle backend error
      } else {
        // Call unfollow API
        const res = await unfollowUser(userId, targetId);
        if (!res.success) throw new Error(res.error); // Handle backend error
      }
    } catch (error) {
      // Revert UI in case of an error
      console.log(error);
      setIsfollowed(!newFollowState);
    }
  };
  

  return (
    <div className="w-full">
      <Button
        disabled={targetId === userId }
        onClick={handleFollow}
        className="w-full dark rounded-xl p-5"
      >
        {isfollowed ? "Following" : "Follow"}
      </Button>
    </div>
  );
};
export default Follow;
