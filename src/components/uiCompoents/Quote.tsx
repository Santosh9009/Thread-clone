"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getThreadbyId, QuoteThread } from "@/lib/actions/thread.actions";
import { PostType } from "@/types/Thread";
import { Quote } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import { timeAgo } from "@/helpers/CalculateTime";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

export default function AddQuote({ id }: { id: any }) {
  const [thread, setThread] = useState<PostType | null>(null);
  const session = useSession();
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getThreadbyId(id)
      .then((result) => {
        console.log(result.thread.post);
        // @ts-ignore
        setThread(result.thread.post);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  function handleQuotePost() {
    QuoteThread(id, session.data?.user._id, content)
      .then((result) => {
        if (result.success) {
          toast({
            title: "Success",
            description: "Quote Posted",
          });
          setIsOpen(false);  // Close the dialog
        }
      })
      .catch((error) => {
        toast({
          title: "Failure",
          description: "Unable to post quote",
        });
      });
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full">
          <div className="flex items-center justify-around hover:bg-[#262626] rounded p-2">
            <div className="bg-transparent text-white font-semibold">Quote</div>
            <Quote width={16} height={16} />
          </div>
        </DialogTrigger>
        <DialogContent className="bg-[#181818] dark">
          <DialogTitle />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Image
                src={DummyUserIcon}
                alt={""}
                className="w-10 rounded-full object-cover"
              />
              <div>@{session.data?.user.username}</div>
            </div>
            <textarea
              className="w-full py-4 px-2 bg-[#181818] rounded-lg text-white focus:outline-none resize-none"
              placeholder="What's on your mind?"
              rows={3}
              minLength={2}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          {/* Original thread */}
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
                    <div className="text-gray-400"></div>
                  </div>
                  <p className="text-gray-300 mt-2 font-light">
                    {thread.content}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end p-4">
            <button
              onClick={handleQuotePost}
              className={`${
                content ? "text-white" : "text-slate-600"
              } px-4 py-1 rounded-lg border-[.05rem] border-[#323232]`}
              disabled={!content}
            >
              Post
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
