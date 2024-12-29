import { connectDB } from "@/lib/dbConnect";
import { UserModal } from "@/lib/modals/UserModal"
import { connect } from "mongoose"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
        console.log("account=>",account);
        console.log("profile=>",profile);
        const user = await handleLoginUser(profile);
      return {...profile, role : user.role} // Do different verification for other providers that don't have `email_verified`
    },
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
});