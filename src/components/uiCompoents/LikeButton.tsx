// components/LikeButton.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { togglelike } from "@/lib/actions/thread.actions";
import { Alert } from "../uiCompoents/Alert";

interface LikeButtonProps {
  threadId: any;
  upvotes: any[]; // Assuming upvotes is an array of user ids
}

const LikeButton: React.FC<LikeButtonProps> = ({ threadId, upvotes }) => {
  const session = useSession();
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    const check = upvotes.find((element) => element === session.data?.user._id);
    setIsLike(!!check);
    setLikeCount(upvotes.length);
  }, [upvotes, session]);

    const handleLike = useCallback(() => {

    togglelike({ threadId, userId: session.data?.user._id })
      .then((result: any) => {
        if (result) {
          setLikeCount((prev) => (isLike ? prev - 1 : prev + 1));
          setIsLike(!isLike);
        }
      })
      .catch((error) => {
        console.error("Failed to toggle like:", error);
      });
  }, [isLike]);

  

  return (
    <>
      <button
        className="flex items-center space-x-2"
        onClick={handleLike}
        disabled={!session.data?.user}
      >
        <Heart
          className="transition-colors"
          height={20}
          width={20}
          color={isLike ? "red" : "#9CA3AF"}
          fill={isLike ? "red" : ""}
        />
        <span className="">{likeCount}</span>
      </button>
    </>
  );
};

export default LikeButton;
