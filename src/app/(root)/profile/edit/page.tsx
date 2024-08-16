"use client";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import EditUserForm from "@/components/forms/EdituserForm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();

  return (
    <div>
      <div className="md:h-[10vh] md:flex items-center justify-between hidden px-3">
        <button
          className="hover:bg-[#2b2b2b] rounded-full p-1"
          onClick={() => router.back()}
        >
          <ArrowLeft width={25} height={25} />
        </button>
        <p>Thread</p>
        <div></div>
      </div>
      <MainCardWrapper>
        <EditUserForm />
      </MainCardWrapper>
    </div>
  );
}
