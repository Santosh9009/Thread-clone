import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2Icon } from "lucide-react";
import { toast } from "../ui/use-toast";

export function Sharepop({id}:{id:any}) {

  const handleCopyLink = () => {
    const linkToCopy = `http://localhost:3000/thread/${id}`; // Replace with the actual link you want to copy
    navigator.clipboard.writeText(linkToCopy).then(() => {
     toast({
      description:"Link copied"
     })
    });
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Share2Icon fill="#9CA3AF" width={20} height={20} />
      </PopoverTrigger>
      <PopoverContent className="w-30 p-3">
        <button onClick={handleCopyLink}>copy link</button>
      </PopoverContent>
    </Popover>
  );
}
