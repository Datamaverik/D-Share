import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { signUpCredentials } from "../services/users";

export interface UserContextType {
  currentUser: signUpCredentials | null;
  setCurrentUser: Dispatch<SetStateAction<signUpCredentials | null>>;
}
export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  user: signUpCredentials | null;
  children: ReactNode;
}
export const UserProvider = ({ user, children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<signUpCredentials | null>(
    user
  );

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
