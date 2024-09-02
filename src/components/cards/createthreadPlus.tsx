"use client"
import { useSession } from "next-auth/react";
import { CreateThreadCard } from "./createModal";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Alert } from "../uiCompoents/Alert";

export default function CreateThreadPlus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const session = useSession();

  const handleOpen = () => {
    if (session.data?.user) {
      // If user session exists, open the modal
      setIsModalOpen(true);
    } else {
      // Otherwise, open the alert
      setIsAlertOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseAlert = () => setIsAlertOpen(false);

  return (
    <div className="hidden md:block">
       <Button onClick={handleOpen} className="absolute right-8 bottom-8 bg-[#181818] hover:scale-110 transition-all duration-200 hover:bg-[#181818] border-[0.1rem] border-[#323333] py-8 px-6 rounded-xl">
        <PlusIcon height={30} width={30}/>
      </Button>
      {isModalOpen && (
        <CreateThreadCard
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          username={session.data?.user.username}
          authorId={session.data?.user._id}
        />
      )}
       {isAlertOpen && <Alert onClose={handleCloseAlert} />}
    </div>
  );
}