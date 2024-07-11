export default function MainCardWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="bg-[#181818] border-[0.01rem] border-[#323232] rounded-xl h-[90vh]
    overflow-y-auto scrollbar-hide"
    >
      {children}
    </div>
  );
}
