"use client";
import { useSession } from "next-auth/react";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "../uiCompoents/Alert";

export default function Bottombar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");


  useEffect(() => {
    // Update navLinks' `isActive` state based on the current pathname
    const currentLink = navLinks.find(link =>(pathname.includes(link.route) && link.route.length > 1) ||pathname === link.route);
    setActiveLink(currentLink?currentLink.route:"");
  }, [pathname]);

  const handleButtonClick = (link:{}) => {
    if (!session?.user) {
      setModalOpen(true);
    } 
  };

  return (
    <div className="fixed bottom-0 w-screen md:hidden backdrop-blur-md">
      <div className="w-full h-[.05rem] bg-gray-600"></div>
      <div className="flex justify-center items-start space-x-10 my-3">
        {navLinks.map((link, index) => (
          <Link href={link.route==="/profile"?link.route+"/"+session?.user._id:link.route} key={index} passHref>
          <button
            onClick={() => handleButtonClick(link)}
            className={`${
              activeLink===link.route? "bg-[#5051F9]" : "hover:bg-[#2b2b2b]"
            } p-3 rounded-md`}
            key={index}
            // disabled={!session?.user}
          >
            <div className="w-5">{link.img()}</div>
          </button>
          </Link>
        ))}
      </div>
      {isModalOpen && <Alert onClose={() => setModalOpen(false)} />}
    </div>
  );
}
