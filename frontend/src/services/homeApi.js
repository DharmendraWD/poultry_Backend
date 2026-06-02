// home/hero

import api from "@/lib/axios";

/* GET hero section */
export const getHeroSection = async () => {
  const res = await api.get("home/hero");
  return res.data;
};
// DELETE hero section
export const deleteHeroSection = async (id) => {
  const res = await api.delete(`home/hero/${id}`);
  return res.data;
};

/* CREATE hero section */
export const createHeroSection = async (formData) => {
  const res = await api.post("home/hero", formData);
  return res.data;
};
export const updateHeroSection = async (id, payload) => {
  const res = await api.put(`home/hero/${id}`, payload);
  return res.data;
};