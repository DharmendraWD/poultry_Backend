import api from "@/lib/axios";

export const getGallery = async () => {
  const res = await api.get("home/gallery");
  return res.data;
};

export const deleteGallery = async (id) => {
  const res = await api.delete(`home/gallery/${id}`);
  return res.data;
};

export const createGallery = async (formData) => {
  const res = await api.post("home/gallery", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateGallery = async (id, formData) => {
  const res = await api.put(`home/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};