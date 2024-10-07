"use client";
import { useSession } from "next-auth/react";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "../uiCompoents/Alert";
import { Plus } from "lucide-react";
import { CreateThreadCard } from "../cards/createModal";

const Bottombar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    const currentLink = navLinks.find(
      (link) =>
        (pathname.includes(link.route) && link.route.length > 1) ||
        pathname === link.route
    );
    setActiveLink(currentLink ? currentLink.route : "");
  }, [pathname]);

  const handleButtonClick = (e: any) => {
    if (!session?.user) {
      e.preventDefault();
      setIsAlertOpen(true);
    }
  };

  const handleOpen = () => {
    if (session?.user) {
      setIsModalOpen(true);
    } else {
      setIsAlertOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseAlert = () => setIsAlertOpen(false);

  return (
    <>
      <div className="fixed bottom-0 w-screen md:hidden backdrop-blur-md">
        <div className="w-full h-[.05rem] bg-gray-600"></div>
        <div className="flex justify-center items-center space-x-8 my-3">
          {navLinks.map((link, index) => (
            <div key={index} className="flex items-center">
              <Link
                href={
                  link.route === "/profile"
                    ? `${link.route}/${session?.user?._id}`
                    : link.route
                }
                passHref
              >
                <button
                  onClick={(e) => handleButtonClick(e)}
                  className={`${
                    activeLink === link.route
                      ? "bg-[#5051F9] scale-110"
                      : "hover:bg-[#2b2b2b]"
                  } p-2 rounded-md flex items-center justify-center transition-all duration-300 ease-in-out`}
                >
                  <div className="w-5">{link.img()}</div>
                </button>
              </Link>
            </div>
          ))}
          <button
            onClick={() => handleOpen()}
            className="p-2 rounded-md flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <Plus className="w-7 text-white" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <CreateThreadCard
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          username={session?.user?.username}
          authorId={session?.user?._id}
        />
      )}
      {isAlertOpen && <Alert onClose={handleCloseAlert} />}
    </>
  );
};

export default Bottombar;
