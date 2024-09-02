"use client";

import Link from "next/link";
import Menu from "../uiCompoents/Menu";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Alert } from "../uiCompoents/Alert";
import { ThreadIcon } from "../../../public/assests/Images";

export default function TopbarClient({ session }:{session:any}) {
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);


  return (
    <div>
      {!session?.user ? (
        <div className="fixed top-0 w-screen hidden md:block p-3">
          <div className="flex justify-evenly items-center mx-auto">
            <div>
              <Link href="/">
                {/* <Image src={Logo} alt="Logo" /> */}
                <div className="w-8">{ThreadIcon()}</div>
              </Link>
            </div>
            <div className="flex space-x-10">
              
            {navLinks.map((link, index) => (
          <div key={index}> {/* Add key to parent div to avoid warning */}
            {/* Render each navigation link */}
              <button
                onClick={() =>  setModalOpen(true)}
                className={` p-3 rounded-md`}
                disabled={!session && link.label === "Home"}
              >
                <div className="w-5">{link.img()}</div>
              </button>
          </div>
        ))}
            </div>
            <Link href="/login">
              <Button className="bg-white text-black hover:bg-slate-300 text-sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full md:hidden bg-[#181818]">
        <div className="flex justify-between items-center py-3 px-5">
          <Link href="/">
            {/* <Image alt="Logo" src={Logo} /> */}
            <div className="w-8">{ThreadIcon()}</div>
          </Link>
          <div className="md:hidden">
            {session ? (
              <Menu />
            ) : (
              <Link href="/login">
                <Button className="bg-white text-black active:bg-slate-300 text-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="w-full h-[.05rem] bg-gray-600"></div>
      </div>

      {isModalOpen && <Alert onClose={() => setModalOpen(false)} />}
    </div>
  );
}
