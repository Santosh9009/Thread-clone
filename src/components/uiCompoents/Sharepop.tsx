import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2Icon } from "lucide-react";
import { toast } from "../ui/use-toast";
import { useState } from "react";

export function Sharepop({ id }: { id: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = () => {
    const linkToCopy = `http://localhost:3000/thread/${id}`; // Replace with the actual link you want to copy
    navigator.clipboard.writeText(linkToCopy).then(() => {
      toast({
        description: "Link copied",
        duration: 700,
      });
      setIsOpen(false); // Close the popover after the toast
    });
  };

  return (
    <div className="">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Share2Icon fill="#9CA3AF" width={20} height={20} />
        </PopoverTrigger>
        <PopoverContent className="w-30 p-3">
          <button onClick={handleCopyLink}>Copy link</button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
