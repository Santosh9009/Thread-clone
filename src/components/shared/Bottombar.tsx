"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../../../public/assests/icons8-threads.svg";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "../uiCompoents/Alert";

export default function Bottombar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Update navLinks' `isActive` state based on the current pathname
    navLinks.forEach(link => {
      link.isActive = pathname.includes(link.route) || pathname === link.route;
    });
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
          <button
            onClick={() => handleButtonClick(link)}
            className={`${
              link.isActive ? "bg-[#5051F9]" : "hover:bg-[#2b2b2b]"
            } p-3 rounded-md`}
            key={index}
            // disabled={!session?.user}
          >
            <div className="w-5">{link.img()}</div>
          </button>
        ))}
      </div>
      {isModalOpen && <Alert onClose={() => setModalOpen(false)} />}
    </div>
  );
}
