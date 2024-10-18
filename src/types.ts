export interface IUser {
  id: string;
  login: string;
}

export interface IContact {
  id: string;
  userId: string;
  contactId: string;
  conversationId: string | null;
  contact: {
    login: string
  }
}
