// home/whychooseus

import api from "@/lib/axios";

/* GET whychooseus */
export const getWhyChooseUs = async () => {
  const res = await api.get("home/whychooseus");
  return res.data;
};
// DELETE whychooseus
export const deleteWhyChooseUs  = async (id) => {
  const res = await api.delete(`home/whychooseus/${id}`);
  return res.data;
};

/* CREATE whychooseus */
export const createWhyChooseUs = async (formData) => {
  const res = await api.post("home/whychooseus", formData);
  return res.data;
};
export const updateWhyChooseUs = async (id, payload) => {
  const res = await api.put(`home/whychooseus/${id}`, payload);
  return res.data;
};