import { getAuthUser } from "@/Common/authSession";

export const getUserIdFromToken = () => {
  const user = getAuthUser();
  return user?.role === "farmer" ? user.userId : null; // Ensure correct role
};
