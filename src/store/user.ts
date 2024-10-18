 
import { create } from 'zustand';

interface IUser {
  name: string;
  id: string;
}


export const useUser = create<Partial<IUser>>(() => ({
  id: undefined,
  name: undefined
}));

export const setUserId = (id: string) => {
  useUser.setState((state) => ({
    ...state,
    id
  }));
};
