import { connectDB } from "@/lib/dbConnect";
import { UserModal } from "@/lib/modals/UserModal";
import { connect } from "mongoose";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";



const handleLoginUser = async (profile)=>{
  await connectDB()
  const user = await UserModal.findOne({email : profile.email});
  if(user) {
    return user;
  }else{
    const obj = {
      fullname : profile.name,
      email : profile.email,
      provider : "google",
      profileImg : profile.picture,
    };
    let newUser = await new UserModal(obj);
    newUser = await newUser.save(); 
    return newUser;
  }
};
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google,
    Credentials({
    credentials: {
      username: { label: "Username" },
      password: { label: "Password", type: "password" },
    },
    async authorize({ request }) {
      const response = await fetch(request)
      if (!response.ok) return null
      return (await response.json()) ?? null
    },
  }),],
  callbacks: {
    async signIn({ account, profile }) {
        console.log("account=>",account);
        console.log("profile=>",profile);
        const user = await handleLoginUser(profile);
      return {...profile, role : user.role} // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token}) {
      console.log("token=>",token);
      const user = await handleLoginUser(token);
      console.log("user in the JWT=>",user);
       token.role = user.role;
       token._id = user._id;
       return token;
      },
     
   
    session({ session, token }) {
      session.user._id = token._id;
      session.user.role = token.role;
      return session;
    },
  },
});