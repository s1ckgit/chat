import api from '../client';

export const getMessages = async (id: string | undefined) => {
  if(!id) return null;
  const { data } = await api.get(`/messages/${id}`, { withCredentials: true });
  
  return data;
};

export const getConversations = async () => {
  const { data } = await api.get('/me/conversations', { withCredentials: true });

  return data;
};

export const getLastMessage = async (id: string) => {
  const { data } = await api.get(`/lastmessage/${id}`, { withCredentials: true });

  return data;
};
