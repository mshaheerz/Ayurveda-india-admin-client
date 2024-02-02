// export interface User {
//     name?: string | null | undefined;
//     role?: string;
//     userName?:string;
//     access_token?:string;
    
// }

export interface User {
    name?: string | null | undefined;
    userId?:string;
    roleId?: string;
    roleName?:string;
    email_id?:string;
    phone_number?:string;
    access_token?:string;
    refresh_token?:string;
}