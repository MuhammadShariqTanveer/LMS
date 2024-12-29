import { redirect } from "next/navigation";
import { signIn,auth } from "../../../auth"

 
export default async function SignIn() {
    const session = await auth();
    console.log("session=>",session);
    if(session) redirect('/')
          return (
    <div className="container min-h-screen mx-auto flex justify-center items-center">
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button
      className="border p-3 px-5"
      type="submit">Continue with Google</button>
    </form>
    </div>
  )
} 