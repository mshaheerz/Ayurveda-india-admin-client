import { User } from "./AuthTypes";

declare module "next-auth" {
    interface Session{
        user:User
    }
}