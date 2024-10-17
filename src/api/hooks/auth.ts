/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { login, register } from "../services/auth";

interface IMutationCallbacks {
  onSuccess?: any; 
  onError?: any
}

export const useNewUserMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation({
    mutationFn: register,
    onSuccess,
    onError
  });
};

export const useAuthorizeUserMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError
  });
};
