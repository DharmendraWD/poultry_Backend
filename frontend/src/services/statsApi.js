import api from "@/lib/axios";

export const getStats = async () => {
  const res = await api.get("home/stats");
  return res.data;
};

export const deleteStats = async (id) => {
  const res = await api.delete(`home/stats/${id}`);
  return res.data;
};

export const createStats = async (formData) => {
  const res = await api.post("home/stats", formData);
  return res.data;
};

export const updateStats = async (id, payload) => {
  const res = await api.put(`home/stats/${id}`, payload);
  return res.data;
};