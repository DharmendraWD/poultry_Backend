import api from "@/lib/axios";


export const changePassword = async (formData) => {
  const res = await api.put(`/auth/change-password`, formData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};