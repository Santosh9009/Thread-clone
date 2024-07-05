"use client";
import { useSession } from "next-auth/react";

export default function LeftSidebar() {
  const session = useSession();

  return (
    <div>
      {!session && (
        <div className="fixed left-0 h-full bg-white hidden md:block">
          <div className="flex flex-col items-stretch">

          </div>
        </div>
      )}
    </div>
  );
}
