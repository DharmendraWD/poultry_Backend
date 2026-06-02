import api from "@/lib/axios";

export const getServiceFeatures = async () => {
  const res = await api.get("service/features");
  return res.data;
};

export const deleteServiceFeature = async (id) => {
  const res = await api.delete(`service/features/${id}`);
  return res.data;
};

export const createServiceFeature = async (payload) => {
  const res = await api.post("service/features", payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateServiceFeature = async (id, payload) => {
  const res = await api.put(`service/features/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};


export const getServiceDetailBox = async () => {
  const res = await api.get("service/detail-box");
  return res.data;
};

export const deleteServiceDetailBox = async (id) => {
  const res = await api.delete(`service/detail-box/${id}`);
  return res.data;
};

export const createServiceDetailBox = async (payload) => {
  const res = await api.post("service/detail-box", payload);
  return res.data;
};

export const updateServiceDetailBox = async (id, payload) => {
  const res = await api.put(`service/detail-box/${id}`, payload);
  return res.data;
};