import { connectDB } from "@/lib/dbConnect";
import { UserModal } from "@/lib/modals/UserModal";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const handleLoginUser = async (profile) => {
  await connectDB();
  const user = await UserModal.findOne({ email: profile.email });
  if (user) {
    return user;
  } else {
    const obj = {
      fullname: profile.name,
      email: profile.email,
      provider: "google",
      profileImg: profile.picture,
    };
    let newUser = await new UserModal(obj);
    newUser = await newUser.save();
    return newUser;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`https://lms-xi-lake.vercel.app/api/user/login`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
    
          const data = await res.json();
          if (res.ok && data.user) {
            return {
              ...data.user,
              token: data.token,
            };
          }
          throw new Error(data.msg || "Invalid credentials");
        } catch (error) {
          console.error("Error in credentials authorize:", error);
          return null;
        }
      },
    }),
    
  ],
  callbacks: {
    // async signIn({ account, profile }) {
    //   console.log("account=>", account);
    //   if (account.provider == "google") {
    //     console.log("profile=>", profile);
    //     const user = await handleLoginUser(profile);

    //     return { ...profile, role: user.role }; // Do different verification for other providers that don't have `email_verified`
    //   }
    //   return true;
    // },
    async redirect({ url, baseUrl }) {
      // Default redirect logic
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async jwt({ token }) {
      console.log("token=>", token);
      const user = await handleLoginUser(token);
      console.log("user in the JWT=>", user);
      token.role = user.role;
      token._id = user._id;
      token.picture = user?.profileImg;
      token.fullname = user?.fullname;
      return token;
    },
    session({ session, token }) {
      session.user._id = token._id;
      session.user.role = token.role;
      session.user.image = token.picture;
      session.user.name = token.fullname;
      return session;
    },
  },
});
