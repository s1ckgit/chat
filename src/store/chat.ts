 
import { create } from 'zustand';
import { IPendingMessage } from '../types';

interface IChat {
  id?: string;
  receiver?: User;
  pendingMessages: Map<string, IPendingMessage>;
  chatWindowElement: HTMLDivElement | null;
  showScrollButton: boolean;
}


export const useChat = create<IChat>(() => ({
  id: undefined,
  receiver: undefined,
  pendingMessages: new Map(),
  chatWindowElement: null,
  showScrollButton: false
}));

export const setChatId = (id: string | undefined) => {
  useChat.setState((state) => ({ ...state, id }));
};

export const setReceiver = (receiver: User) => {
  useChat.setState((state) => ({ ...state, receiver }));
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

export const setChatWindowElement = (element: HTMLDivElement) => {
  useChat.setState((state) => ({
    ...state,
    chatWindowElement: element
  }));
};

export const setShowScrollButton = (boolean: boolean) => {
  useChat.setState((state) => ({
    ...state,
    showScrollButton: boolean
  }));
};

export const useChatInput = create<string>(() => (''));

export const setChatInput = (update: ((prev: string) => string) | string) => {
  useChatInput.setState((state) => {
    return typeof update === 'function' ? update(state) : update;
  });
};
