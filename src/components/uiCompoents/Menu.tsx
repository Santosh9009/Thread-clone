import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import menu from '../../../public/assests/bars-solid.svg';
import { MenuIcon } from "lucide-react";

export default function Menu() {
  return (
    <div>
      <Menubar className="dark">
        <MenubarMenu>
          <MenubarTrigger><MenuIcon/></MenubarTrigger>
          <MenubarContent className="dark">
            <MenubarItem>Appearance</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Settings</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Logout</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
