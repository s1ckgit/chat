import { IUser } from '../../types';
import api from '../client';


export const getUserInfo = async (userId: string) => {
  const { data } = await api.get(`/user/${userId}`);

  return data;
};

export const getMyInfo = async () => {
  const { data } = await api.get<IUser>('/me', { timeout: 1000 });
  
  return data;
};

export const getContacts = async () => {
  const { data } = await api.get('/me/contacts');

  return data;
};

export const addContact = async (login: string) => {
  const { data } = await api.post('/contacts/add', { login });

  return data;
};
