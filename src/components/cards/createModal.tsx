import { useState } from 'react';
import DummyUserIcon from '../../../public/assests/profile-picture.png';
import Image from 'next/image';

interface CreateThreadCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  // avatarUrl: string;
  username: string;
}

export const CreateThreadCard: React.FC<CreateThreadCardProps> = ({ isOpen, onClose, onSubmit, username }) => {
  const [content, setContent] = useState('');
  const [post , setPost ] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
      onClose();
    } else {
      alert("Content can't be empty");
    }
  };

  if (!isOpen) return null;

  // Function to handle clicks outside the modal
  const handleClickOutside = (e: React.MouseEvent) => {
    // Check if the click is outside the modal content area
    if ((e.target as HTMLElement).classList.contains('modal-background')) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 modal-background"
      onClick={handleClickOutside}
    >
      <div
        className="bg-[#181818] rounded-lg shadow-lg w-full max-w-lg border-[0.01rem] border-[#323232]"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="p-6 flex items-center">
          <Image src={DummyUserIcon} alt="Avatar" className="w-10 h-10 rounded-full mr-4" />
          <h2 className="text-lg font-semibold text-white">{username}</h2>
        </div>
        <div className="px-6">
          <textarea
            className="w-full p-2 bg-[#181818] rounded-lg text-white focus:outline-none resize-none"
            placeholder="What's on your mind?"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end p-4">
          <button
            onClick={handleSubmit}
            className={`${content?"text-white":"text-slate-600"} px-4 py-1 rounded-lg border-[.05rem] border-[#323232]`}
            disabled={!content}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
