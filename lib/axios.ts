import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Replace with your actual base URL
});

// instance.interceptors.request.use((config) => {
//     const token = getTokenFromStorage();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// },(error) => Promise.reject(error))

export default instance;