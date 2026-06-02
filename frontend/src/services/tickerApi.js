import api from "@/lib/axios";

export const getTicker = async () => {
  const res = await api.get("home/ticker");
  return res.data;
};

export const deleteTicker = async (id) => {
  const res = await api.delete(`home/ticker/${id}`);
  return res.data;
};

// sends array: [{ text: "..." }, { text: "..." }]
export const createTicker = async (items) => {
    console.log(items)
  const res = await api.post("home/ticker", items);
  return res.data;
};

export const updateTicker = async (id, payload) => {
  const res = await api.put(`home/ticker/${id}`, payload);
  return res.data;
};