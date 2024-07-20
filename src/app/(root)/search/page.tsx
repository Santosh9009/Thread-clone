"use client"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MainCardWrapper from "@/components/cards/MainCardWrapper";
import SearchBar from "@/components/cards/serachbar";
import UserCard from "@/components/cards/UserCard";
import { filterUser } from "@/lib/actions/user.actions";
import { User } from "@/types/Thread";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Search() {
  const session = useSession();
  const [text , setText ]= useState('');
  const [clients, setClients] = useState<User[]>();

  async function filter(searchText:string){
    const { res }= await filterUser({userId:session.data?.user._id,pageNumber:1,pageSize:10,searchText:searchText})
    return res;
  }
  
  useEffect(() => {
    async function fetchFilteredUsers() {
      if (text) {
        const res = await filter(text);
        setClients(res.users);
      } else {
        setClients([]);
      }
    }

    fetchFilteredUsers();
  }, [text]);


  function onchangeHandler(searchString:string){
      setText(searchString)
  }


  return (
    <div>
       <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        <SearchBar onChange={onchangeHandler}/>
        
        {clients && clients.map((user,index)=>(
        <UserCard key={index} name={user.name} username={user.username} followers={user.followers.length} userId={user._id}/>
        ))}
      </MainCardWrapper>
    </div>
  );
}
