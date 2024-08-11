import { createContext, ReactNode, useMemo } from "react";
import { io, Socket } from "socket.io-client";

// Define the context type as Socket or null
export const SocketContext = createContext<Socket | null>(null);

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  // Create the socket instance with the proper URL
  const socket = useMemo(() => io("http://localhost:8200"), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
