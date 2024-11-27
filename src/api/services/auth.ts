import type { IApiResponse, ICreateUserData, IUserCredentials } from '../../types';
import api from '../client';

export const login = async (userCredentials: IUserCredentials) => {
  const { data } = await api.post<IApiResponse>('/login', userCredentials);
  
  return data;
};

export const register = async (createUserData: ICreateUserData) => {
  const { data } = await api.post<{id: User['id']}>('/register', createUserData);

  return data;
};

export const logout = async () => {
  await api.post<IApiResponse>('/logout');
};
