"use client";
import { useSession } from "next-auth/react";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "../uiCompoents/Alert";
import { Plus } from "lucide-react";
import { CreateThreadDialog } from "../cards/createDialog";

export default function Bottombar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateThreadOpen, setCreateThreadOpen] = useState(false); // State for thread modal
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    // Update navLinks' `isActive` state based on the current pathname
    const currentLink = navLinks.find(
      (link) =>
        (pathname.includes(link.route) && link.route.length > 1) ||
        pathname === link.route
    );
    setActiveLink(currentLink ? currentLink.route : "");
  }, [pathname]);

  const handleButtonClick = (link: any) => {
    if (!session?.user) {
      setModalOpen(true);
    }
  };

  const handleCreateThreadClick = () => {
    if (!session?.user) {
      setModalOpen(true);
    } else {
      setCreateThreadOpen(true); // Open thread modal
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCreateThreadOpen(false); // Close both modals
  };

  return (
    <div className="fixed bottom-0 w-screen md:hidden backdrop-blur-md">
      <div className="w-full h-[.05rem] bg-gray-600"></div>
      <div className="flex justify-center items-center space-x-8 my-3">
        {navLinks.map((link, index) => (
          <div key={index} className="flex items-center">
            {/* Render each navigation link */}
            <Link
              href={
                link.route === "/profile"
                  ? link.route + "/" + session?.user._id
                  : link.route
              }
              passHref
            >
              <button
                onClick={() => handleButtonClick(link)}
                className={`${
                  activeLink === link.route ? "bg-[#5051F9]" : "hover:bg-[#2b2b2b]"
                } p-2 rounded-md flex items-center justify-center`}
              >
                <div className="w-5">{link.img()}</div>
              </button>
            </Link>
          </div>
        ))}
        {/* Render the Plus icon button separately */}
        {<button
          onClick={handleCreateThreadClick}
          className="p-2 rounded-md flex items-center justify-center"
        >
          <Plus className="w-7 text-white" />
        </button>}
      </div>

      {/* Render the Alert modal */}
      {isModalOpen && <Alert onClose={handleCloseModal} />}

      {/* Render the CreateThreadDialog dialog */}
      {isCreateThreadOpen && (
        <CreateThreadDialog
          isOpen={isCreateThreadOpen}
          onClose={handleCloseModal}
          username={session?.user.username || ""} // Provide fallback for type safety
          authorId={session?.user._id || ""} // Provide fallback for type safety
        />
      )}
    </div>
  );
}

