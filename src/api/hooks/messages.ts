import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { getConversations, getLastMessage, getMessages, sendMessageAttachments } from "../services/messages";
import { messagesKeys } from "../queries/queryKeys";
import type { IMutationCallbacks, MessagesApiResponse } from "../../types";


export const useMessagesQuery = (id: Conversation['id'] | undefined) => {
  return useQuery<MessagesApiResponse | null, AxiosError>({
    queryKey: messagesKeys.id(id),
    queryFn: () => getMessages(id),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
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
  return useMutation<Message['attachments'], AxiosError, FormData>({
    mutationFn: (formData) => sendMessageAttachments(formData),
    onSuccess,
    onError
  });
};
