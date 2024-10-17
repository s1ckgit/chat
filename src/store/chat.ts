/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface IChat {
  id: string | undefined;
}

interface IConversation {
  id: string;
    participants: {
      login: string;
    }[];
    lastMessage: {
      createdAt: Date;
      content: string;
      sender: {
          id: string;
          login: string;
          password: string;
      };
    }
}

interface IConversations {
  conversations: IConversation[] | undefined
}

interface ISocket {
  socket: Socket | undefined;
}


export const useChat = create<Partial<IChat>>(() => ({
  id: undefined
}));

export const setChatId = (id: string | undefined) => {
  useChat.setState(() => ({ id }));
};

export const useConversations = create<Partial<IConversations>>(() => ({
  conversations: undefined
}));

export const setConversations = (conversations: IConversations) => {
  useConversations.setState(() => ({ ...conversations }));
};

export const useSocket = create<Partial<ISocket>>(() => ({
  socket: undefined
}));

export const setSocket = (socket: Socket) => {
  useSocket.setState(() => ({ socket }));
};
