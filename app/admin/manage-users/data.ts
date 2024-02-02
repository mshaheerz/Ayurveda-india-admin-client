import axios from "@/lib/axios";
import { VisuallyHidden } from "@nextui-org/react";
import React from "react";

const columns = [
  { name: "ID", uid: "id" },
  { name: "Email", uid: "email_id", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: 0 },
  { name: "Paused", uid: 1 },
  { name: "Vacation", uid: 2 },
];

const users = [
  {
    email_id: "mshaheerkp99@gmail.com",
    first_name: "jhone",
    id: "0153398b-fb62-43b9-8b18-6639d430d6f6",
    is_superadmin: false,
    last_login: null,
    last_name: "honai",
    phone_number: "9746854699",
    profile_image: null,
    roleName:"admin",
    roleId:"admin",
    // role: { id: "98a234f7-d0b8-4fe2-87da-d929196a4bbe", name: "Admin" },
    state: "kerala",
    status: 1,
  },
  {
    email_id: "mshaheerkp99@gmail.com",
    first_name: "jhone",
    id: "015339f8b-fb62-43b9-8b18-6639d430d6f6",
    is_superadmin: false,
    last_login: null,
    last_name: "honai",
    phone_number: "9746854699",
    profile_image: null,
    // role: { id: "98a234f7-d0b8-4fe2-87da-d929196a4bbe", name: "Admin" },
    state: "kerala",
    status: 1,
  },
  {
    email_id: "mshaheerkp99@gmail.com",
    first_name: "jhone",
    id: "01533f98b-fb62-43b9-8b18-6639d430d6f6",
    is_superadmin: false,
    last_login: null,
    last_name: "honai",
    phone_number: "9746854699",
    profile_image: null,
    // role: { id: "98a234f7-d0b8-4fe2-87da-d929196a4bbe", name: "Admin" },
    state: "kerala",
    status: 1,
  },

  
];
// {
//   id: 4,
//   name: "William Howard",
//   role: "C.M.",
//   team: "Marketing",
//   status: "vacation",
//   age: "28",
//   avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
//   email: "william.howard@example.com",
// },
export { columns, users, statusOptions };
