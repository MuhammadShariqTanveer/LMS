import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";

export default async function SignIn() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="container min-h-screen mx-auto flex flex-col gap-4 justify-center items-center">
      <form
        className="flex flex-col gap-3 shadow p-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
          });
          if (result.ok) redirect("/");
        }}
      >
        <input
          className="border p-2"
          required
          name="email"
          placeholder="Enter your Email"
        />
        <input
          className="border p-2"
          required
          name="password"
          type="password"
          placeholder="Enter your Password"
        />
        <button className="border p-1 px-2" type="submit">
          Login
        </button>
      </form>

      <button
        className="border p-3 px-5"
        onClick={() => signIn("google")}
      >
        Continue with Google
      </button>
    </div>
  );
}
