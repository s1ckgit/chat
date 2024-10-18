 
import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface IChat {
  id: string;
  receiverId: string;
  receiverName: string;
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
  conversations: IConversation[]
}

interface ISocket {
  socket: Socket | undefined;
}


export const useChat = create<Partial<IChat>>(() => ({
  id: undefined
}));

export const setChatId = (id: string) => {
  useChat.setState((state) => ({ ...state, id }));
};

export const setReceiverId = (id: string) => {
  useChat.setState((state) => ({ ...state, receiverId: id }));
};

export const setReceiverName = (name: string) => {
  useChat.setState((state) => ({
    ...state,
    receiverName: name
  }));
};

export const useConversations = create<Partial<IConversations>>(() => ({
  conversations: undefined
}));

export const setConversations = (conversations: IConversation[]) => {
  useConversations.setState(() => ({ conversations }));
};

export const useSocket = create<Partial<ISocket>>(() => ({
  socket: undefined
}));

export const setSocket = (socket: Socket) => {
  useSocket.setState(() => ({ socket }));
};
