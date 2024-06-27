import Appbar from "./user/page";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex items-center w-full h-5 bg-blue-800 p-5 gap-5">
        <div>appbar</div>
      </div>
     <Appbar/>
    </main>
  );
}
