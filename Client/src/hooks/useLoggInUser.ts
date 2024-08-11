import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const useLoggedInUser = () => {
  const context = useContext(UserContext);
  if (context === null)
    throw new Error("userLoggedInUser must be used within a UserProvider");

  return context;
};
