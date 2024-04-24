import axios from 'axios';
import { signOut } from 'next-auth/react';

const instance = axios.create({
  baseURL: "https://muhammedrahil.pythonanywhere.com/api/", // Replace with your actual base URL
});

// instance.interceptors.request.use((config) => {
//     const token = getTokenFromStorage();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// },(error) => Promise.reject(error))

// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token is expired or invalid, log out the user
//       await signOut({ redirect: false, callbackUrl: "/login" });
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;