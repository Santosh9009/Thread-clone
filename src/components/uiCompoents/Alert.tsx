// uiComponents/LoginModal.tsx
import Link from "next/link";
import { Button } from "../ui/button";

interface LoginModalProps {
  onClose: () => void;
}

export const Alert: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center md:p-0 p-5">
      <div className="bg-[#0e0e0e] p-5 md:p-8 rounded-md shadow-lg max-w-lg w-full border-[.05rem] border-[#323232]">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
          Please Log In
        </h2>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          You must be logged in to access other pages.
        </p>
        <div className="flex space-x-4 justify-end text-">
          <Link href="/login">
            <Button className="bg-white text-black hover:bg-slate-300 text-sm">
              Login
            </Button>
          </Link>
          <Button
            onClick={onClose}
            className="bg-[#171717] border border-[#323232] text-gray-400 hover:bg-[#222222] hover:text-white px-4 md:px-6 py-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
