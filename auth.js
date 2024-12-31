import { connectDB } from "@/lib/dbConnect";
import { UserModal } from "@/lib/modals/UserModal";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const handleLoginUser = async (profile) => {
  try {
    await connectDB();
    let user = await UserModal.findOne({ email: profile.email });
    if (!user) {
      const obj = {
        fullname: profile.name,
        email: profile.email,
        provider: "google",
        profileImg: profile.picture,
      };
      user = new UserModal(obj);
      await user.save();
    }
    return user;
  } catch (error) {
    console.error("Error in handleLoginUser:", error);
    throw new Error("Error handling login user");
  }
};

export default NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await fetch(
            `https://lms-xi-lake.vercel.app/api/user/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();
          if (data.error) {
            throw new Error(data.msg);
          }

          return data.user;
        } catch (error) {
          console.error("Error in authorize:", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (account.provider === "google") {
          await handleLoginUser(profile);
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.role = user.role;
        token.picture = user.profileImg;
        token.fullname = user.fullname;
      }
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
