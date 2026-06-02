// home/homefeaturecard

import api from "@/lib/axios";

/* GET feature card */
export const getFeatureCard = async () => {
  const res = await api.get("home/homefeaturecard");
  return res.data;
};
// DELETE feature card
export const deleteFeatureCard  = async (id) => {
  const res = await api.delete(`home/homefeaturecard/${id}`);
  return res.data;
};

/* CREATE feature card */
export const createFeatureCard = async (formData) => {
  const res = await api.post("home/homefeaturecard", formData);
  return res.data;
};
export const updateFeatureCard = async (id, payload) => {
  const res = await api.put(`home/homefeaturecard/${id}`, payload);
  return res.data;
};