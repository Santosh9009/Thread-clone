"use client"
import { Search, SearchIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useDebounceValue } from 'usehooks-ts'
export default function SearchBar({onChange}:{onChange:(searchString:string)=>void}) {
  const [debouncedValue, setValue] = useDebounceValue('', 500)

  useEffect(()=>{
    onChange(debouncedValue);
  },[debouncedValue])


  return (
      <div className="relative p-5">
          <input
              type="text"
              placeholder='Search'
              className="w-full px-4 py-2 rounded-xl bg-black text-white focus:outline-none border-gray-600 border-[.05rem]"
              onChange={e=>setValue(e.target.value)}
          />
         <SearchIcon className='absolute right-10 top-8 w-5 h-5'/>
      </div>
  );
}