import api from "@/lib/axios";

export const getAllUsers = async () => {
  const res = await api.get("users");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`users/${id}`);
  return res.data;
};

export const createUser = async (formData) => {
  const res = await api.post("auth/create-user", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`auth/delete-user/${id}`);
  return res.data;
};