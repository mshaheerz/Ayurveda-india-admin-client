import axios from "@/lib/axios";
import { VisuallyHidden } from "@nextui-org/react";
import React from "react";

const columns = [
  { name: "ID", uid: "id" },
  { name: "Name", uid: "name", sortable: true },
  { name: "Short Name", uid: "short_name", sortable: true },
  { name: "Duration", uid: "duration", sortable: true },
  { name: "Price", uid: "course_price", sortable: true },
  // { name: "Offer Percentage", uid: "offer_persentage", sortable: true },
  { name: "Available", uid: "seats_available", sortable: true },
  { name: "Published", uid: "is_published", sortable: true },
  { name: "status", uid: "status" },
];

const statusOptions = [
  { name: "Active", uid: 0 },
  { name: "Inactive", uid: 1 },
];

const courses = [
  {
    id: "3bad2a46-79a9-44e4-9311-6d42c389b174",
    name: "BASICS OF AYURVEDA AND BEAUTY THERAPY",
    short_name: "BABT",
    description: "Ayurveda Course",
    location: "Chennai",
    duration: 2,
    duration_type: "weeks",
    seats_available: 10,
    actual_course_price: "3000.0000",
    offer_persentage: 0,
    course_price: "3000.0000",
    is_published: false,
    "created_by": "0153398b-fb62-43b9-8b18-6639d430d6f6",
    "updated_by": null,
    "status": 1,
    "created_at": "2024-01-20T17:56:16.097136Z",
    "updated_at": "2024-01-20T17:56:16.098139Z"
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
export { columns, courses, statusOptions };
