import { isAxiosError } from 'axios';
import api from '../client';
import { IApiResponse } from '../../types';

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
  const { data } = await api.post<Contact>('/contacts/add', { login });

  return data;
};

export const changeUserData = async (userData: Partial<User>) => {
  const { data } = await api.post<User>('/me', userData);

  return data;
};

export const changeUserAvatar = async (formData: FormData) => {
  const { data } = await api.post<IApiResponse>('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return data;
};

export const getUserProp = async <K extends keyof User>(id: string | undefined, prop: K) => {
  if(!id) return;
  const { data } = await api.get<User[K]>(`/user/${id}/${prop}`);

  return data;
};
