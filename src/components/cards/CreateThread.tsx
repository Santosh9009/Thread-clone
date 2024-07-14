"use client"
import Image from "next/image";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import Link from "next/link";
import { useState } from "react";
import { CreateThreadCard } from "./createModal";
import { useSession } from "next-auth/react";
import { createThread } from "@/lib/actions/thread.actions";
import { toast } from "../ui/use-toast";

export default function CreateThread() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateThread = async(content: string) => {
    const Newthread = await createThread({author:session.data?.user._id,content:content,path:'/'});
    if(Newthread){
      toast({
        title: "Success",
        description: "A new thread posted",
      })
    }else{
      toast({
        title: "Failed",
        description: "Error posting the thread",
        variant:'destructive'
      })
    }
    
  };


  return (
    <div className="hidden md:flex items-center gap-4 px-8 py-4 border-b-[.05rem] border-[#323232]">
      <Link href={"/profile"} passHref>
        <Image
          src={DummyUserIcon}
          alt="author"
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
      <div className="relative w-full" onClick={handleOpenModal}>
        <button>
          <input
            type="text"
            className="w-full p-2 pr-16 bg-transparent text-[#5a5a5a] focus:outline-none"
            placeholder="Start a thread...."
          />
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button className="text-white px-4 py-1 rounded-lg border-[.05rem] border-[#323232]">
            Post
          </button>
        </div>
      </div>
      <CreateThreadCard
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateThread}
        username={session.data?.user.username}
      />
    </div>
  );
}
