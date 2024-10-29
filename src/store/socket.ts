import { create } from "zustand";
import type { Socket } from "socket.io-client";

interface ISocketStore {
  socket: Socket | undefined;
  statusSocket: Socket | undefined;
}

export const useSocket = create<ISocketStore>(() => ({
  socket: undefined,
  statusSocket: undefined
}));

export const setStatusSocket = (socket: Socket) => {
  useSocket.setState((state) => ({ 
    ...state,
    statusSocket: socket
   }));
};

export const setSocket = (socket: Socket) => {
  useSocket.setState(() => ({ socket }));
};
