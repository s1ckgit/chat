import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getConversations, getLastMessage, getMessages } from "../services/messages";
import { messagesKeys } from "../queries/queryKeys";


export const useMessagesQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: messagesKeys.id(id),
    queryFn: () => getMessages(id),
    placeholderData: keepPreviousData
  });
};

export const useConversationsQuery = () => {
  return useQuery({
    enabled: false,
    queryFn: getConversations,
    queryKey: messagesKeys.conversations,
    placeholderData: keepPreviousData
  });
};

export const useLastMessageQuery = (id: string) => {
  return useQuery({
    enabled: false,
    queryKey: messagesKeys.lastMessagge(id),
    queryFn: () => getLastMessage(id)
  });
};
