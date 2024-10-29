import api from '../client';

export const getMessages = async (id: Conversation['id'] | undefined) => {
  if(!id) return null;
  const { data } = await api.get<Message[]>(`/messages/${id}`, { withCredentials: true });
  
  return data;
};

export const getConversations = async () => {
  const { data } = await api.get<Conversation[]>('/me/conversations', { withCredentials: true });

  return data;
};

export const getLastMessage = async (id: Conversation['id']) => {
  const { data } = await api.get<Message>(`/lastmessage/${id}`, { withCredentials: true });

  return data;
};
