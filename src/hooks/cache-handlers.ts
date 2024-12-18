import { messagesKeys } from "@/api/queries/queryKeys";
import { MessagesApiResponse } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useUpdateLastMessage = () => {
  const queryClient = useQueryClient();

  const updateLastMessage = useCallback(({ conversationId, lastMessage }: { conversationId: Conversation['id'], lastMessage: Message }) => {

    queryClient.setQueryData(messagesKeys.conversations, (oldConversations: Conversation[]) => {
      if(!oldConversations) return [];

      return oldConversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage
          };
        }
        return c;
      });
    });
  }, [queryClient]);

  return updateLastMessage;
};

export const useAddMessageToList = () => {
  const queryClient = useQueryClient();

  const addMessageToList = useCallback(({ conversationId, message, dateGroup }: { conversationId: Conversation['id']; message: Message; dateGroup: string; }) => {
    queryClient.setQueryData(messagesKeys.id(conversationId), (oldMessages: MessagesApiResponse) => {
      if(!oldMessages) return;

      return [...oldMessages.map((group) => {
        if(group.date === dateGroup) {
          return {
            ...group,
            messages: [...group.messages, message]
          };
        }
      })];
    });
  }, [queryClient]);

  return addMessageToList;
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  const markMessageAsRead = useCallback(
    ({ conversationId, ids }: { conversationId: Conversation['id']; ids: Message['id'][] }) => {
      const idsSet = new Set(ids);
  
      queryClient.setQueryData(messagesKeys.id(conversationId), (oldMessages: MessagesApiResponse) => {
        if (!oldMessages) return;
  
        return oldMessages.map((group) => ({
          ...group,
          messages: group.messages.map((message) =>
            idsSet.has(message.id)
              ? { ...message, status: 'read' }
              : message
          ),
        }));
      });
    },
    [queryClient]
  );
  
  return markMessageAsRead;

};
