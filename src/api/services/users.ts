import { isAxiosError } from 'axios';
import api from '../client';

const controller = new AbortController();

export const getUserInfo = async (userId: User['id']) => {
  const { data } = await api.get<User>(`/user/${userId}`);

  return data;
};

export const getMyInfo = async () => {
   try {
    const { data } = await api.get<User>('/me', {
      signal: controller.signal
    });
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.status === 401) {
      controller.abort();
    }
    return null;
  }
};

export const getContacts = async () => {
  const { data } = await api.get<Contact[]>('/me/contacts');

  return data;
};

export const addContact = async (login: User['login']) => {
  const { data } = await api.post('/contacts/add', { login });

  return data;
};

export const changeUserData = async (userData: Partial<User>) => {
  const { data } = await api.post('/me', userData);

  return data;
};
