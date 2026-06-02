import axios from "axios";
//  const BASE_URL = process.env.BASE_URL || "http://localhost:5001/api";

// /* GET ALL USERS */
// export const getUsers = async (accessToken) => {
//   const res = await axios.get(`${BASE_URL}/users`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   return res.data;
// };

// /* GET LOGGED IN USER DETS  */
// export const getUserById = async (id, accessToken) => {
//   console.log(id, "ID ")
//   const res = await axios.get(`${BASE_URL}/users/${id}`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   return res.data;
// };

// /* POST */
// export const createUser = async (payload, accessToken) => {
//   const res = await axios.post(`${BASE_URL}/users`, payload, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   } );

//   return res.data;
// };

import api from "@/lib/axios";

/* GET ALL USERS */
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

/* GET USER BY ID */
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

/* CREATE USER */
export const createUser = async (payload) => {
  const res = await api.post("/users", payload);
  return res.data;
};