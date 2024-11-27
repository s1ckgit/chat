/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMutationCallbacks {
  onSuccess?: (...args: any) => void; 
  onError?: (...args: any) => void
}

export interface IUserCredentials {
  login: string;
  password: string;
}

export interface ICreateUserData {
  login: string;
  password: string;
}

export interface IPendingMessage extends Omit<Message, 'sender' | 'conversation' | 'lastConversation' | 'createdAt'> {
  createdAt: Date;
  receiverId?: string;
}

export interface IMessagesDateGroupApiResponse {
  date: string;
  messages: Message[]
}

export type MessagesApiResponse = IMessagesDateGroupApiResponse[];

export interface IApiResponse {
  message: string;
}

export interface MessageAttachments {
  originalUrl: string;
  previewUrl: string;
}

export interface IClientMessageAttachments extends MessageAttachments {
  id: number;
  file: File;
}
