import { useMutation } from "@tanstack/react-query";

import { google_auth, login, register, telegram_auth } from "../services/auth";
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

export const useTelegramAuthMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation({
    mutationFn: telegram_auth,
    onSuccess,
    onError
  });
};

export const useGoogleAuthMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation({
    mutationFn: google_auth,
    onSuccess,
    onError
  });
};
