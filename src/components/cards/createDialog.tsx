import { useState, useRef, useEffect } from "react";
import DummyUserIcon from "../../../public/assests/profile-picture.png";
import Image from "next/image";
import { toast } from "../ui/use-toast";
import { createThread } from "@/lib/actions/thread.actions";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface CreateThreadCardProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  authorId: string;
}

export const CreateThreadDialog: React.FC<CreateThreadCardProps> = ({
  isOpen,
  onClose,
  username,
  authorId,
}) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Add ref for textarea
  const session = useSession();

  const handleCreateThread = async () => {
    if (content.trim()) {
      const Newthread = await createThread({
        author: authorId,
        content: content,
        path: "/",
      });
      setContent("");
      onClose();
      if (Newthread) {
        toast({
          title: "Success",
          description: "A new thread posted",
        });
      } else {
        toast({
          title: "Failed",
          description: "Error posting the thread",
          variant: "destructive",
        });
      }
    }
  };

  // Auto resize the textarea on content change
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to calculate new height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to content size
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset on mount
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust to content
    }
  }, [content]); // Adjust textarea height whenever content changes

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark h-screen flex flex-col justify-start overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <Image
                src={DummyUserIcon}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full mr-4"
              />
              <span>@{username}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-between h-full">
          <DialogDescription>
            <Textarea
              ref={textareaRef} // Attach ref to Textarea
              className="w-full bg-transparent border-none focus-visible:border-none focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-0 resize-none overflow-hidden mb-5" // Added resize-none to disable manual resize handle
              placeholder="What's on your mind?"
              value={content}
              onChange={handleTextareaChange} // Use custom handler
              rows={3}
              minLength={2}
            />
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleCreateThread} disabled={!content.trim()}>
              Post
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

