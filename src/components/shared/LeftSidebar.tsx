"use client";
import { useSession } from "next-auth/react";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Menu from "../uiCompoents/Menu";
import { useEffect } from "react";
import { ThreadIcon } from "../../../public/assests/Images";

export default function LeftSidebar() {
  const session = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // Update navLinks' `isActive` state based on the current pathname
    navLinks.forEach(link => {
      link.isActive = pathname.includes(link.route) || pathname === link.route;
    });
  }, [pathname]);

  return (
    <div>
      {session.data?.user && (
        <div className="fixed left-0 h-screen hidden md:block">
          <div className="h-screen flex flex-col justify-between items-center py-5 px-1">
          <Link href="/">
            {/* <Image alt="Logo" src={Logo} /> */}
            <div className="w-8">{ThreadIcon()}</div>
          </Link>
          
          <div className="flex flex-col space-y-10">
            {navLinks.map((link, index) => (
              <button
                className={`${
                  link.isActive ? "bg-[#5051F9]" : "hover:bg-[#2b2b2b]"
                } p-3 rounded-md`}
                key={index}
              >
                <div className="w-5">{link.img()}</div>
              </button>
            ))}
          </div>
          <div>
            <Menu/>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
