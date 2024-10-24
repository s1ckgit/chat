 
import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface IMessage {
  content: string;
  senderId: string; 
  conversationId: string;
  status: 'read' | 'delivered' | 'pending';
  id: string;
}

interface IChat {
  id?: string;
  isTyping: boolean;
  receiverId?: string;
  receiverName?: string;
  pendingMessages: Map<string, IMessage>;
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
  statusSocket: Socket | undefined;
}


export const useChat = create<IChat>(() => ({
  id: undefined,
  receiverId: undefined,
  receiverName: undefined,
  isTyping: false,
  pendingMessages: new Map()
}));

export const setChatId = (id: string | undefined) => {
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

export const setPendingMessage = (message: IMessage) => {
  useChat.setState((state) => {
    const newPendingMessages = new Map(state.pendingMessages);
    newPendingMessages.set(message.id, message);
    return {
      ...state,
      pendingMessages: newPendingMessages
    };
  });
};

export const deletePendingMessage = (id: string | string[]) => {
  useChat.setState((state) => {
    const newPendingMessages = new Map(state.pendingMessages);

    if(Array.isArray(id)) {
      id.forEach(id => newPendingMessages.delete(id));
    } else {
      newPendingMessages.delete(id);
    }

    return {
      ...state,
      pendingMessages: newPendingMessages
    };
  });
};

export const setIsTyping = (bool: boolean) => {
  useChat.setState((state) => ({
    ...state,
    isTyping: bool
  }));
};

export const useConversations = create<Partial<IConversations>>(() => ({
  conversations: undefined
}));

export const setConversations = (conversations: IConversation[]) => {
  useConversations.setState(() => ({ conversations }));
};

export const useSocket = create<ISocket>(() => ({
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
