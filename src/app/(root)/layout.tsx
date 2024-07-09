import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";
import { Inter } from "next/font/google";
import Provider from "../Provider";
import '../globals.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <Provider>
          <Topbar />
          <main>
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-[10vh] flex justify-center items-center text-xl">
                  
                </div>
                <div className="bg-[#181818] border-[0.01rem] border-[#323232] min-h-[90vh] rounded-xl overflow-y-auto">
                {children}
                </div>
                </div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </Provider>
      </body>
    </html>
  );
}
