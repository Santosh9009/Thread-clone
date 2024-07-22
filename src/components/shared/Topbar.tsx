import { getServerSession } from "next-auth";
import TopbarClient from "./Topclient";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function Topbar() {
  const session = await getServerSession(authOptions);  

  return (
    <div>
     <TopbarClient session={session}/>
    </div>
  );
}
