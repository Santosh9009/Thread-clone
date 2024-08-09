"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
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
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(true);

  const { ref, inView } = useInView();

  useEffect(() => {
    async function fetchFilteredUsers() {
      if (text) {
        setLoading(true);
        const { res } = await filterUser({
          searchText: text,
          userId: session.data?.user._id,
          pageNumber: page,
        });
        if (page === 1) {
          setClients(res.users);
        } else {
          setClients((prevClients) => [...prevClients, ...res.users]);
        }
        setIsNext(res.isNext);
        setLoading(false);
      } else {
        setClients([]);
        setPage(1); // Reset page number when text is cleared
      }
    }

    fetchFilteredUsers();
  }, [text, page]);

  useEffect(() => {
    if (inView && isNext && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, isNext, loading]);


  function onchangeHandler(searchString: string) {
    setText(searchString);
    setPage(1); 
  }

  return (
    <div>
      <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        <SearchBar onChange={onchangeHandler} />

        {loading && page === 1 ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <>
            {clients.length > 0
              ? clients.map((user, index) => (
                  <UserCard
                    key={index}
                    name={user.name}
                    username={user.username}
                    followers={user.followers.length}
                    userId={user._id}
                  />
                ))
              : text && <div className="text-center">No users found</div>}
            {loading && page > 1 && (
              <div className="flex justify-center items-center">
                <Loader className="animate-spin" />
              </div>
            )}
            <div ref={ref}></div>
          </>
        )}
      </MainCardWrapper>
    </div>
  );
}
