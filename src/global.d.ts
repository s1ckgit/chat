export {};

declare global {
  interface User {
    id: string;
    login: string;
    password: string;
    refreshToken: string;
    status: string;
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
    createdAt: Date;
  }

  interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    lastMessage?: Message;
    lastMessageId?: string;
    contacts?: Contact[];
    createdAt: Date;
  }

  interface Message {
    id: string;
    content: string;
    senderId: string;
    conversationId: string;
    createdAt: Date;
    status: 'pending' | 'delivered' | 'read';
    sender: User;
    conversation: Conversation;
    lastConversation: Conversation; 
  }
}
