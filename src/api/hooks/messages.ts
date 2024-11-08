import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { getConversations, getLastMessage, getMessages, sendMessageAttachments } from "../services/messages";
import { messagesKeys } from "../queries/queryKeys";
import { AxiosError } from "axios";
import type { IMutationCallbacks } from "../../types";


export const useMessagesQuery = (id: Conversation['id'] | undefined) => {
  return useQuery<Message[] | null, AxiosError>({
    queryKey: messagesKeys.id(id),
    queryFn: () => getMessages(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: !!id
  });
};

export const useConversationsQuery = () => {
  return useQuery<Conversation[], AxiosError>({
    enabled: false,
    queryFn: getConversations,
    queryKey: messagesKeys.conversations,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};

export const useLastMessageQuery = (id: Conversation['id']) => {
  return useQuery<Message, AxiosError>({
    enabled: false,
    queryKey: messagesKeys.lastMessagge(id),
    refetchOnWindowFocus: false,
    queryFn: () => getLastMessage(id)
  });
};

export const useSendMessageAttachmentsMutation = ({ onSuccess, onError }: IMutationCallbacks) => {
  return useMutation<{secure_url: string, preview_url: string}[], AxiosError, FormData>({
    mutationFn: (formData) => sendMessageAttachments(formData),
    onSuccess,
    onError
  });
};
