import api from '../client';

interface IUserCredentials {
  login: string;
  password: string;
}

interface ICreateUserData {
  login: string;
  password: string;
}

export const login = async (userCredentials: IUserCredentials) => {
  const { data } = await api.post('/login', userCredentials);

  return data;
};

export const register = async (createUserData: ICreateUserData) => {
  const { data } = await api.post('/register', createUserData, {
    withCredentials: true,
  });

  return data;
};
