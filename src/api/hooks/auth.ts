import { useMutation } from "@tanstack/react-query";

import { login, register } from "../services/auth";
import type { IMutationCallbacks } from "../../types";

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
