import api from "@/lib/axios";

export const getProduct = async () => {
  const res = await api.get("home/product");
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`home/product/${id}`);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await api.post("home/product", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await api.put(`home/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};