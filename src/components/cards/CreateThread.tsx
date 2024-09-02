"use client";
import Image from "next/image";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import Link from "next/link";
import { useState } from "react";
import { CreateThreadCard } from "./createModal";
import { useSession } from "next-auth/react";
import { Alert } from "../uiCompoents/Alert";

export default function CreateThread() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { data: session } = useSession();

  const handleOpen = () => {
    if (session?.user) {
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
    <div className="hidden md:flex items-center gap-4 px-8 py-4 border-b-[.05rem] border-[#323232]">
      <Link href={"/profile"} passHref>
        <Image
          src={DummyUserIcon}
          alt="author"
          className="w-12 rounded-full object-cover"
        />
      </Link>
      <div className="relative w-full" onClick={handleOpen}>
        <button>
          <input
            type="text"
            className="w-full p-2 pr-16 bg-transparent text-[#5a5a5a] focus:outline-none"
            placeholder="Start a thread...."
            readOnly
          />
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={handleOpen}
            className="text-white px-4 py-1 rounded-lg border-[.05rem] border-[#323232]"
          >
            Post
          </button>
        </div>
      </div>
      {isModalOpen && (
        <CreateThreadCard
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          username={session?.user.username}
          authorId={session?.user._id}
        />
      )}
      {isAlertOpen && <Alert onClose={handleCloseAlert} />}
    </div>
  );
}
