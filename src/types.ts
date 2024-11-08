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

export interface IPendingMessage extends Omit<Message, 'sender' | 'conversation' | 'lastConversation'> {
  receiverId: string;
  attachmentProgress?: number;
}
