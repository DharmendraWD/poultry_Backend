// home/firstcard

import api from "@/lib/axios";

/* GET home card */
export const getHomeCard = async () => {
  const res = await api.get("home/firstcard");
  return res.data;
};
// DELETE home card
export const deleteHomeCard  = async (id) => {
  const res = await api.delete(`home/firstcard/${id}`);
  return res.data;
};

/* CREATE home card */
export const createHomeCard = async (formData) => {
  const res = await api.post("home/firstcard", formData);
  return res.data;
};
export const updateHomeCard = async (id, payload) => {
  const res = await api.put(`home/firstcard/${id}`, payload);
  return res.data;
};