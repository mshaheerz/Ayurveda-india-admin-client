import axios from "@/lib/axios";
import { VisuallyHidden } from "@nextui-org/react";
import React from "react";

const columns = [
  { name: "ID", uid: "id" },
  { name: "Name", uid: "name", sortable: true },
  { name: "Email", uid: "email_id", sortable: true },
  { name: "phone", uid: "phone", sortable: true },
  // { name: "Offer Percentage", uid: "offer_persentage", sortable: true },
  { name: "price", uid: "course_price", sortable: true },
  { name: "Course", uid: "course", sortable: true },
  { name: "course code", uid: "course_code", sortable: true },
  { name: "status", uid: "status" },
];

const statusOptions = [
  { name: "Active", uid: 0 },
  { name: "Inactive", uid: 1 },
];

const bookings = [
  {
    "id": "b2644192-f2df-4d85-8c0e-f046a3bec453",
    "course": {
        "id": "180f2bcf-f4ea-4928-8b5a-c4a55fab91ab",
        "name": "ronaldos",
        "short_name": "cr7",
        "description": "best player",
        "location": "portugal",
        "duration": 100,
        "duration_type": "days",
        "seats_available": 1000,
        "actual_course_price": "500000.0000",
        "offer_persentage": 2,
        "course_price": "490000.0000",
        "is_published": true,
        "created_by": "0153398b-fb62-43b9-8b18-6639d430d6f6",
        "updated_by": "null",
        "status": 1,
        "created_at": "2024-02-03T14:52:41.371733Z",
        "updated_at": "2024-02-21T07:16:12.004942Z"
    },
    "bookinguserinformations": {
        "id": "2ba79059-74ca-4f30-aa6a-d4375c0c3415",
        "email_id": "mshaheerkp99@gmail.com",
        "phone_number": "43243244234",
        "first_name": "muhammed",
        "last_name": "shaheer",
        "gender": "male",
        "age": 33,
        "country_code": null,
        "address_line_1": "chemrakattur\nareekode, malappuram",
        "address_line_2": "chemrakattur\nareekode, malappuram",
        "country": "India",
        "state": "Kerala",
        "city": "manjery",
        "zip_code": "673639",
        "status": 1,
        "created_by": null,
        "created_at": "2024-02-22T14:46:06.212289Z",
        "updated_at": "2024-02-22T14:46:06.213278Z"
    },
    "booking_user_type": "unknown",
    "booking_date": "2024-02-22T14:46:06.135000Z",
    "other_information": "",
    "booking_type": "course",
    "status": 1,
    "created_by": null,
    "created_at": "2024-02-22T14:46:06.265565Z",
    "updated_at": "2024-02-22T14:46:06.265565Z",
    "user": null
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
export { columns, bookings, statusOptions };
