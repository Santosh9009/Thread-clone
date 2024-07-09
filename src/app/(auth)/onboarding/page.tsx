"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UpdateUserForm from '@/components/forms/UpdateuserForm';
import { redirect } from "next/navigation";

export default async function OnboardingPage() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user?._id || session.user.isOnboarded) redirect('/')

  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-sans p-4 bg-gray-900 text-white">
      <div className="w-full max-w-lg mx-auto rounded-lg p-8 shadow-xl space-y-8 bg-gray-800 border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h1>
        <UpdateUserForm userId={session.user._id}/>
      </div>
    </div>
  )
}
