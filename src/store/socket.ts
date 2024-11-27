import { create } from "zustand";
import type { Socket } from "socket.io-client";

interface ISocketStore {
  messagesSocket: Socket | undefined;
  statusSocket: Socket | undefined;
  usersSocket: Socket | undefined;
}

export const useSocket = create<ISocketStore>(() => ({
  messagesSocket: undefined,
  statusSocket: undefined,
  usersSocket: undefined
}));

export const setUsersSocket = (socket: Socket) => {
  useSocket.setState((state) => ({
    ...state,
    usersSocket: socket
  }));
};

export const setStatusSocket = (socket: Socket) => {
  useSocket.setState((state) => ({ 
    ...state,
    statusSocket: socket
   }));
};

export const setSocket = (socket: Socket) => {
  useSocket.setState((state) => ({ 
    ...state,
    messagesSocket: socket
   }));
};
