"use client";
import Link from "next/link";
import Menu from "../uiCompoents/Menu";
import Logo from "../../../public/assests/icons8-threads.svg";
import Image from "next/image";
import { navLinks } from "@/constants";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { Alert } from "../uiCompoents/Alert";


export default function Topbar() {
  const session = useSession();
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);  

  return (
    <div className="">
      {!session.data?.user ? (
        <div className="fixed top-0 w-full hidden md:block p-3">
          <div className="flex justify-evenly items-center mx-auto">
            <div>
              <Link href="/">
                <Image src={Logo} alt="" />
              </Link>
            </div>
            <div className="flex space-x-10">
              {navLinks.map((link, index) => {
                const isActive =
                  pathname.includes(link.route) || pathname === link.route;

                return (
                  <button onClick={()=> link.label!='Home' && setModalOpen(true)}
                    className={`hover:bg-[#2b2b2b] p-3 rounded-md ${
                      isActive && "bg-[#5051F9]"
                    }`}
                    key={index}
                  >
                    <div className="w-5">{link.img()}</div>
                  </button>
                );
              })}
            </div>
            <Button className="bg-white text-black hover:bg-slate-300">Login</Button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="fixed top-0 w-full md:hidden">
        <div className="flex justify-center items-center p-3">
          <Link href="/"></Link>
        </div>
      </div>
      {session.data?.user && (
        <div className="absolute top-0 right-0 md:hidden p-3">
          {" "}
          <Menu />
        </div>
      )}
      {isModalOpen && <Alert onClose={() => setModalOpen(false)} />}
    </div>
  );
}
