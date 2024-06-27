import { signIn } from "next-auth/react";

export default function Page() {

  return (
    <div>
      <form action={async()=>{
        "use server"
        signIn()
      }}>
        <input type="what" placeholder="name" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}