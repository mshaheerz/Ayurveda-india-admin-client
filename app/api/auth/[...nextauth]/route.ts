
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import axios from "@/lib/axios"

 const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        console.log("foooooo")
        const { username, password } = credentials as any;
        console.log(username,password )
        const dat =  new FormData()
        dat.append('email_id',username)
        dat.append('password',password)
        try {
          const {data} = await axios.post('/login/',dat) 
          console.log({ data });
          const user = {
            userId:data?.data?.token_items?.id,
            roleId:data?.data?.token_items?.role.id,
            roleName:data?.data?.token_items?.role.name,
            email_id:data?.data?.token_items?.email_id,
            access_token:data?.data?.access_token,
            refresh_token:data?.data?.refresh_token
          }
          console.log(user,"userssssssss")
          

          if(user) {
            return user;
          }else throw new Error("Invalid credentials. Please try again.")
        } catch (error:any) {
          console.log(error)
          throw new Error(error.response.data.msg || "Invalid credentials. Please try again.");
        }

       
        
        
        const user = {
          userName: "admin",
          phone: null,
          email: "mm@gmail.com",
          name: "admin user",
          address: null,
          zip: null,
          role: "admin",
          accessToken:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTcwNDkwMDc2MywiZXhwIjoxNzA0OTA0MzYzfQ.-ibNeHqoC5-rjnCL8S00wq2D7A7MPf50vddXpAMKd28.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        } as any;

      

        if (user) {
          return user;
        } else return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token;

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };