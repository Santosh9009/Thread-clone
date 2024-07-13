export default function MainCardWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen md:-h-0 flex justify-center items-end">
      <div className="bg-[#181818] border-[0.01rem] border-[#323232] rounded-xl h-[90vh] overflow-y-auto scrollbar-hide scroll-smooth">
        {children}
      </div>
    </div>
  );
}
