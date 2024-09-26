"use client";

import { useState, useEffect, useRef } from "react";
import DummyUserIcon from "../../../public/assests/profile-picture.png"; // Fix path
import Image from "next/image";
import { toast } from "../ui/use-toast";
import { QuoteThread, getThreadbyId } from "@/lib/actions/thread.actions";
import { PostType } from "@/types/Thread";
import { timeAgo } from "@/helpers/CalculateTime";
import { useSession } from "next-auth/react";
import { UploadComponent } from "./uploadComponent";
import {  X } from "lucide-react";

interface AddQuoteProps {
  isOpen: boolean;
  onClose: () => void;
  id: any;
}

const AddQuote: React.FC<AddQuoteProps> = ({ isOpen, onClose, id }) => {
  const [thread, setThread] = useState<PostType | null>(null);
  const session = useSession();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      getThreadbyId(id)
        .then((result) => {
          console.log(result.thread.post);
          setThread(result.thread.post);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, isOpen]);

  const handleQuotePost = async () => {
    try {
      const result = await QuoteThread(id, session.data?.user._id, content, images);
      if (result.success) {
        toast({
          title: "Success",
          description: "Quote Posted",
        });
        setContent("");
        setImages([]);
        onClose(); // Close the modal after posting
      } else {
        throw new Error("Failed to post quote");
      }
    } catch (error) {
      toast({
        title: "Failure",
        description: "Unable to post quote",
        variant: "destructive",
      });
    }
  };

  const handleUploadSuccess = (uploadedFile: { secure_url: string; public_id: string }) => {
    const newImage = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };
    setImages([newImage]); // Only allow one image
    console.log("Uploaded image:", newImage);
  };

  if (!isOpen) return null;

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("modal-background")) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 modal-background"
      onClick={handleClickOutside}
    >
      <div
        className="bg-[#181818] h-full md:h-auto max-h-screen rounded-lg shadow-lg w-full max-w-lg border-[0.01rem] border-[#323232] flex flex-col overflow-hidden"
        onClick={(e) => {e.stopPropagation();}}
      >
        <div className="p-6 flex items-center flex-shrink-0 justify-between">
          <div className="flex items-center">
            <Image
              src={DummyUserIcon}
              alt="Avatar"
              className="w-10 h-10 rounded-full mr-4"
            />
            <h2 className="text-lg font-semibold text-white hover:underline">
              @{session.data?.user.username}
            </h2>
          </div>
          <button onClick={onClose} className="text-white">
            <X/>
          </button>
        </div>

        <div className="px-6 flex-grow overflow-y-auto">
          <textarea
            ref={textareaRef}
            className="w-full p-2 bg-[#181818] rounded-lg text-white focus:outline-none resize-none mb-4"
            placeholder="What's on your mind?"
            rows={3}
            minLength={2}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
          />
          {thread && (
            <div className="bg-[#181818] rounded-lg overflow-hidden border-[.05rem] border-[#323232] py-4 px-4 m-2">
              <div className="flex items-start">
                <Image
                  src={DummyUserIcon}
                  alt={thread.author.username || ""}
                  className="w-10 rounded-full object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-semibold text-slate-200 hover:underline">
                        {thread.author.username && "@" + thread.author.username}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {timeAgo(thread.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-2 font-light">
                    {thread.content}
                  </p>
                </div>
              </div>
            </div>
          )}
          <UploadComponent onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="flex justify-end p-4 flex-shrink-0">
          <button
            onClick={handleQuotePost}
            className={`${
              content || images.length > 0 ? "text-white" : "text-slate-600"
            } px-4 py-1 rounded-lg border-[.05rem] border-[#323232]`}
            disabled={!content && images.length === 0} // Disable if no content or images
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuote;
