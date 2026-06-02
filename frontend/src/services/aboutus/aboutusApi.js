import api from "@/lib/axios";

export const getAboutUs = async () => {
  const res = await api.get("aboutus/fixed-content");
  return res.data;
};

export const updateAboutUs = async (formData) => {
  const res = await api.put("aboutus/fixed-content", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};



export const getFeature = async () => {
  const res = await api.get("aboutus/features");
  return res.data;
};

export const deleteFeature = async (id) => {
  const res = await api.delete(`aboutus/features/${id}`);
  return res.data;
};

export const createFeature = async (payload) => {
  const res = await api.post("aboutus/features", payload);
  return res.data;
};

export const updateFeature = async (id, payload) => {
  const res = await api.put(`aboutus/features/${id}`, payload);
  return res.data;
};