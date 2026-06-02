import api from "@/lib/axios";

export const getTestimonial = async () => {
  const res = await api.get("home/testimonial");
  return res.data;
};

export const deleteTestimonial = async (id) => {
  const res = await api.delete(`home/testimonial/${id}`);
  return res.data;
};

export const createTestimonial = async (formData) => {
  const res = await api.post("home/testimonial", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateTestimonial = async (id, formData) => {
  const res = await api.put(`home/testimonial/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};