import api from "@/lib/axios";

export const getSiteSettings = async () => {
  const res = await api.get("home/site-settings");
  return res.data;
};

export const updateSiteSettings = async (formData) => {
  const res = await api.put("home/site-settings", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};