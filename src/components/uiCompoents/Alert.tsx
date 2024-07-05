// uiComponents/LoginModal.tsx
import Link from "next/link";
import { Button } from "../ui/button";

interface LoginModalProps {
  onClose: () => void;
}

export const Alert: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#161616] p-8 rounded-md shadow-lg max-w-md w-full ">
        <h2 className="text-2xl font-semibold text-white mb-6">Please Log In</h2>
        <p className="text-gray-400 mb-6">
          You must be logged in to access other pages.
        </p>
        <div className="flex space-x-4 justify-end">
          <Button className="bg-white text-black hover:bg-slate-300 px-6 py-2">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            onClick={onClose}
            className="bg-transparent border border-gray-600 text-gray-400 hover:bg-[#242424] hover:text-white px-6 py-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
