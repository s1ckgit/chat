import { create } from "zustand";

interface ILastMessage {
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    login: string;
    password: string;
  };
}

interface IConversation {
  id: string;
  participants: {
    login: string;
    id: string;
  }[];
  lastMessage: ILastMessage
}

interface IConversations {
  conversations: IConversation[] | undefined;
}


export const useConversations = create<IConversations>(() => ({
  conversations: undefined
}));

export const setConversations = (conversations: IConversation[]) => {
  useConversations.setState(() => ({ conversations: [...conversations] }));
};
