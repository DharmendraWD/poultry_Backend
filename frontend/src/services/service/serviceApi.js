import api from "@/lib/axios";

export const getServiceContent = async () => {
  const res = await api.get("service/fixed-content");
  return res.data;
};

export const updateServiceContent = async (formData) => {
  const res = await api.put("service/fixed-content", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};