import type { MessageAttachments } from "./types"; 
declare global {
  interface User {
    id: string;
    login: string;
    password: string;
    refreshToken: string;
    status: string;
    avatars: {
      thumbnailUrl: string,
      originalUrl: string
    };
    contacts?: Contact[];
    contactOf?: Contact[];
    conversations?: Conversation[];
    sendMessages?: Message[];
  }

  interface Contact {
    id: string;
    userId: string;
    contactId: string;
    conversationId?: string;
    user: User;
    contact: User;
    conversation?: Conversation;
    createdAt: string;
  }

  interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    lastMessage?: Message;
    lastMessageId?: string;
    contacts?: Contact[];
    createdAt: string;
  }

  interface Message {
    id: string;
    content: string;
    senderId: string;
    conversationId: string;
    createdAt: string;
    status: 'pending' | 'delivered' | 'read';
    attachments?: MessageAttachments[];
    sender: User;
    conversation: Conversation;
    lastConversation: Conversation; 
  }
}
