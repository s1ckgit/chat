import type { MessagesApiResponse } from '@/types';
import api from '../client';

export const getMessages = async (id: Conversation['id'] | undefined) => {
  if(!id) return null;
  const { data } = await api.get<MessagesApiResponse>(`/messages/${id}`, { withCredentials: true });
  console.log(typeof data[0].date);
  
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

export const sendMessageAttachments = async (formData: FormData) => {
  const { data } = await api.post<NonNullable<Message['attachments']>>('/messages/attachments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return data;
};
