// components/LikeButton.tsx
"use client"
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
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const check = upvotes.find((element) => element === session.data?.user._id);
    setIsLike(!!check);
    setLikeCount(upvotes.length);
  }, [upvotes, session]);

  const handleLike = useCallback(() => {
    if (!session) {
      setModalOpen(true);
      return;
    }

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

  const handleHeartClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    handleLike();
  };

  return (
    <>
      <button onClick={handleHeartClick}>
        <Heart
          className="transition-colors duration-150"
          height={20}
          width={20}
          color={isLike ? "red" : "#9CA3AF"}
          fill={isLike ? "red" : ""}
        />
      </button>
      <span className="">{likeCount}</span>
      {isModalOpen && <Alert onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default LikeButton;
