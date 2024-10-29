 
import { create } from 'zustand';
import { IPendingMessage } from '../types';

interface IChat {
  id?: string;
  isTyping: boolean;
  receiverId?: string;
  receiverName?: string;
  pendingMessages: Map<string, IPendingMessage>;
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

export const setPendingMessage = (message: IPendingMessage) => {
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
