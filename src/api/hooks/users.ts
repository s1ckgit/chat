/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "../queries/queryKeys";
import { addContact, getContacts, getMyInfo } from "../services/users";
import type { IUser, IContact } from '../../types';
import { AxiosError } from "axios";
import { logout } from "../services/auth";

export const useUserMeQuery = () => {
  const id = localStorage.getItem('id');
  console.log(id);
  return useQuery<IUser | null, AxiosError>({
    queryKey: userKeys.me(id),
    queryFn: getMyInfo,
    placeholderData: keepPreviousData
  });
};

export const useContactsQuery = () => {
  return useQuery<IContact[], AxiosError>({
    queryKey: userKeys.contacts,
    queryFn: getContacts
  });
};

export const useAddContactMutation = ({ onSuccess, onError }: { onSuccess?: any; onError?: any; }) => {
  return useMutation<void, unknown, string>({
    mutationFn: (login) => addContact(login),
    onSuccess,
    onError
  });
};

export const useLogoutMutation = ({ onSuccess, onError }: { onSuccess?: any; onError?: any; }) => {
  return useMutation({
    mutationFn: logout,
    onSuccess,
    onError
  });
};
