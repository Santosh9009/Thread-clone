"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";

import MainCardWrapper from "@/components/cards/MainCardWrapper";
import UserCard from "@/components/cards/UserCard";
import { filterUser } from "@/lib/actions/user.actions";
import { User } from "@/types/Thread";
import SearchBar from "@/components/cards/serachbar";

export default function Search() {
  const session = useSession();
  const [text, setText] = useState("");
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to filter users based on search text
  async function filter(searchText: string) {
    const { res } = await filterUser({
      userId: session.data?.user._id,
      pageNumber: 1,
      pageSize: 10,
      searchText: searchText,
    });
    return res;
  }

  useEffect(() => {
    async function fetchFilteredUsers() {
      if (text) {
        setLoading(true);
        const res = await filter(text);
        setClients(res.users);
        setLoading(false);
      } else {
        setClients([]);
      }
    }

    fetchFilteredUsers();
  }, [text]);

  // Handler for search input changes
  function onchangeHandler(searchString: string) {
    setText(searchString);
  }

  return (
    <div>
      <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        <SearchBar onChange={onchangeHandler} />
        
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <>
            {clients.length > 0 ? (
              clients.map((user, index) => (
                <UserCard
                  key={index}
                  name={user.name}
                  username={user.username}
                  followers={user.followers.length}
                  userId={user._id}
                />
              ))
            ) : (
              text && <div className="text-center">No users found</div>
            )}
          </>
        )}
      </MainCardWrapper>
    </div>
  );
}
