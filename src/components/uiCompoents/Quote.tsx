"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Quote } from "lucide-react";

export default function AddQuote({
  author,
  authorId,
  contentSnippet,
}: {
  author: string;
  authorId: any;
  contentSnippet: string;
}) {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="w-full">
          <div className="flex items-center justify-around hover:bg-[#262626] rounded p-2">
            <button className="bg-transparent text-white font-semibold">
              Quote
            </button>
            <Quote width={16} height={16} />
          </div>
        </DialogTrigger>
        <DialogContent className="dark">
          <DialogHeader></DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
