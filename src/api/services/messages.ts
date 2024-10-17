import api from '../client';

export const getMessages = async (id: string | undefined) => {
  if(!id) return null;
  const { data } = await api.get(`/messages/${id}`, { withCredentials: true });
  
  return data;
};
