import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { userKeys } from "../queries/queryKeys";
import { addContact, changeUserAvatar, changeUserData, getContacts, getMyInfo, getUserProp } from "../services/users";
import { logout } from "../services/auth";
import type { IApiResponse, IMutationCallbacks } from "../../types";

export const useUserMeQuery = () => {
  return useQuery<User | null, AxiosError>({
    queryKey: userKeys.me,
    queryFn: getMyInfo,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useContactsQuery = () => {
  return useQuery<Contact[], AxiosError>({
    queryKey: userKeys.contacts,
    queryFn: getContacts,
    refetchOnWindowFocus: false
  });
};

export const useGetUserPropQuery = <K extends keyof User>(id: string | undefined, prop: K) => {
  return useQuery<User[K] | undefined, AxiosError>({
    queryKey: userKeys.prop(id, prop),
    queryFn: () => getUserProp(id, prop),
    refetchOnWindowFocus: false
  });
};

export const useAddContactMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation<Contact, AxiosError, string>({
    mutationFn: (login) => addContact(login),
    onSuccess,
    onError
  });
};

export const useLogoutMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation<void, AxiosError>({
    mutationFn: logout,
    onSuccess,
    onError
  });
};

export const useChangeUserDataMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation<User, AxiosError, Partial<User>>({
    mutationFn: (userData) => changeUserData(userData),
    onSuccess,
    onError
  });
};

export const useChangeUserAvatarMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation<IApiResponse, AxiosError, FormData>({
    mutationFn: (formData: FormData) => changeUserAvatar(formData),
    onSuccess,
    onError
  });
};
