import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ".././globals.css";
import Provider from "../Provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads App",
  description: "A Threads app in next js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <Provider>
          {children} <Toaster />
        </Provider>
      </body>
    </html>
  );
}
