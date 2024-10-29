import type { ICreateUserData, IUserCredentials } from '../../types';
import api from '../client';

export const login = async (userCredentials: IUserCredentials) => {
  const { data } = await api.post('/login', userCredentials);
  
  return data;
};

export const register = async (createUserData: ICreateUserData) => {
  const { data } = await api.post('/register', createUserData);

  return data;
};

export const logout = async () => {
  await api.post('/logout');
};
