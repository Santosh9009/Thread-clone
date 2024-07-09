"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Menu from "../uiCompoents/Menu";
import { ThreadIcon } from "../../../public/assests/Images";
import { navLinks } from "@/constants";

export default function LeftSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    // Update the active link based on the current pathname
    const currentLink = navLinks.find(link => pathname === link.route);
    setActiveLink(currentLink?currentLink.route:"");
  }, [pathname]);

  return (
    <div>
      {session?.user && (
        <div className="fixed left-0 h-screen hidden md:block">
          <div className="h-screen flex flex-col justify-between items-center py-5 px-1">
            <Link href="/" passHref>
              <div className="w-8">{ThreadIcon()}</div>
            </Link>

            <div className="flex flex-col space-y-10">
              {navLinks.map((link, index) => (
                <Link href={link.route} key={index} passHref>
                  <button
                    className={`${
                      activeLink === link.route ? "bg-[#5051F9]" : "hover:bg-[#2b2b2b]"
                    } p-3 rounded-md w-full text-left transition-colors duration-200 ease-in-out`}
                  >
                    <div className="w-5">{link.img()}</div>
                  </button>
                </Link>
              ))}
            </div>
            <div>
              <Menu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
