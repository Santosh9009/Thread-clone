import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenuIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Menu() {
  return (
    <div>
      <Menubar className="dark">
        <MenubarMenu>
          <MenubarTrigger className=""><MenuIcon/></MenubarTrigger>
          <MenubarContent className="dark">
            <MenubarItem onClick={()=>signOut()}>Logout</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
