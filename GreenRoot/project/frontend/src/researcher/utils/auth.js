
import { getAuthUser } from "@/Common/authSession";

export const getResearcherId = () => {
  const user = getAuthUser();
  return user?.role === "researcher" ? user.userId : null;
};