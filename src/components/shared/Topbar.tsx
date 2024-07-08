"use client";
import Link from "next/link";
import Menu from "../uiCompoents/Menu";
import { navLinks } from "@/constants";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Alert } from "../uiCompoents/Alert";
import { ThreadIcon } from "../../../public/assests/Images";

export default function Topbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Update navLinks' `isActive` state based on the current pathname
    navLinks.forEach((link) => {
      link.isActive = pathname.includes(link.route) || pathname === link.route;
    });
  }, [pathname]);

  return (
    <div>
      {!session?.user ? (
        <div className="fixed top-0 w-full hidden md:block p-3">
          <div className="flex justify-evenly items-center mx-auto">
            <div>
              <Link href="/">
                {/* <Image src={Logo} alt="Logo" /> */}
                <div className="w-8">{ThreadIcon()}</div>
              </Link>
            </div>
            <div className="flex space-x-10">
              {navLinks.map((link, index) => (
                <button
                  onClick={() =>
                    !link.isDisabled &&
                    link.label !== "Home" &&
                    setModalOpen(true)
                  }
                  className={`${
                    link.isActive ? "bg-[#5051F9]" : "hover:bg-[#2b2b2b]"
                  } p-3 rounded-md ${
                    link.isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  key={index}
                  disabled={!session && link.label === "Home"}
                >
                  <div className="w-5">{link.img()}</div>
                </button>
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
      <div className="fixed top-0 w-full md:hidden ">
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
