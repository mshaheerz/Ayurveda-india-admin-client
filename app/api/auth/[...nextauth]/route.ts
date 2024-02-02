
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { User } from "next-auth";
import axios from "@/lib/axios"

 const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
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
        const { username, password } = credentials as any;
        console.log(username,password )
        const dat =  new FormData()
        dat.append('email_id',username)
        dat.append('password',password)
        // const res = await fetch("http://localhost:8000/auth/login", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     username,
        //     password,
        //   }),
        // });

        // const user = await res.json();
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
          }else return null
        } catch (error) {
          console.log(error)
          return null
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
