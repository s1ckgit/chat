import { type CredentialResponse } from '@react-oauth/google';
import type { IApiResponse, ICreateUserData, ITelegramProfileData, IUserCredentials } from '../../types';
import api from '../client';

export const login = async (userCredentials: IUserCredentials) => {
  const { data } = await api.post<{id: User['id']}>('/login', userCredentials);
  
  return data;
};

export const register = async (createUserData: ICreateUserData) => {
  const { data } = await api.post<{id: User['id']}>('/register', createUserData);

  return data;
};

export const telegram_auth = async (telegramProfileData: ITelegramProfileData) => {
  const { data } = await api.post<{id: User['id']}>('/telegram_auth', telegramProfileData);

  return data;
};

export const google_auth = async (credentialResponse: CredentialResponse) => {
  const { data } = await api.post('/google_auth', credentialResponse);

  return data;
};

export const logout = async () => {
  await api.post<IApiResponse>('/logout');
};
