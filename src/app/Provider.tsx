"use client"
import { SessionProvider } from "next-auth/react";
import { Children } from "react";

export default function Provider({children}:any) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}