import { isAxiosError } from 'axios';
import { IUser } from '../../types';
import api from '../client';

const controller = new AbortController();

export const getUserInfo = async (userId: string) => {
  const { data } = await api.get(`/user/${userId}`);

  return data;
};

export const getMyInfo = async () => {
   try {
    const { data } = await api.get<IUser>('/me', {
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
  const { data } = await api.get('/me/contacts');

  return data;
};

export const addContact = async (login: string) => {
  const { data } = await api.post('/contacts/add', { login });

  return data;
};
