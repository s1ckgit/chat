import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "../queries/queryKeys";
import { addContact, changeUserData, getContacts, getMyInfo } from "../services/users";
import { AxiosError } from "axios";
import { logout } from "../services/auth";
import type { IMutationCallbacks } from "../../types";

export const useUserMeQuery = () => {
  const id = localStorage.getItem('id');

  return useQuery<User | null, AxiosError>({
    queryKey: userKeys.me(id),
    queryFn: getMyInfo,
    placeholderData: keepPreviousData
  });
};

export const useContactsQuery = () => {
  return useQuery<Contact[], AxiosError>({
    queryKey: userKeys.contacts,
    queryFn: getContacts
  });
};

export const useAddContactMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation<void, unknown, string>({
    mutationFn: (login) => addContact(login),
    onSuccess,
    onError
  });
};

export const useLogoutMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation({
    mutationFn: logout,
    onSuccess,
    onError
  });
};

export const useChangeUserDataMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation({
    mutationFn: (userData) => changeUserData(userData),
    onSuccess,
    onError
  });
};
