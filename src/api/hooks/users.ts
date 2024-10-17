 
import { useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "../queries/queryKeys";
import { addContact, getContacts, getMyInfo } from "../services/users";
import type { IUser } from '../../types';
import { AxiosError } from "axios";

export const useUserMeQuery = () => {
  return useQuery<IUser, AxiosError>({
    queryKey: userKeys.me,
    queryFn: getMyInfo
  });
};

export const useContactsQuery = () => {
  return useQuery<IUser[], AxiosError>({
    queryKey: userKeys.contacts,
    queryFn: getContacts
  });
};

export const useAddContactMutation = () => {
  return useMutation<void, unknown, string>({
    mutationFn: (login) => addContact(login),
  });
};
