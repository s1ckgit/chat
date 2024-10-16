/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "../queries/queryKeys";
import { getMyInfo } from "../services/users";
import type { IUser } from '../../types';
import { AxiosError } from "axios";
import { register } from "../services/auth";

export const useUserMeQuery = () => {
  return useQuery<IUser, AxiosError>({
    queryKey: userKeys.me,
    queryFn: getMyInfo
  });
};

export const useNewUserMutation = ({ onSuccess, onError }: { onSuccess?: any; onError?: any }) => {
  return useMutation({
    mutationFn: register,
    onSuccess,
    onError
  });
};
