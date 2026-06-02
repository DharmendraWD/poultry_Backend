import toast from "react-hot-toast";

export function handleApiMessage(message = "") {
  const text = message.toLowerCase();

  if (text.includes("deleted")) {
    toast.success("Deleted successfully");
    return "deleted";
  }

  if (text.includes("updated") || text.includes("edited")) {
    toast.success("Updated successfully");
    return "updated";
  }

  if (text.includes("created")) {
    toast.success("Created successfully");
    return "created";
  }

  return null;
}