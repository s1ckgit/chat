/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface IChat {
  messages: any[];
  isLoading: boolean;
}


export const useChat = create<Partial<IChat>>(() => ({
  messages: undefined,
  isLoading: false,
}));

export const fetchMessages = async (id: string) => {
  if(!id) return;
  // const res = await fetch(`/chat/${id}`);
  // const messages = await res.json();
  useChat.setState(() => ({ isLoading: false }));
};
