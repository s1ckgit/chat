/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface IUser {
  name: string;
}


export const useUser = create<Partial<IUser>>(() => ({
  id: undefined,
  name: undefined
}));

export const fetchUser = async () => {
  const res = await fetch(`/me`);
  const user = await res.json();
  useUser.setState(() => ({ ...user }));
};
