import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../store/chat";
import { useQueryClient } from "@tanstack/react-query";
import { messagesKeys } from "../api/queries/queryKeys";


export const useStatus = (id: string) => {
  const { statusSocket } = useSocket();
  const [status, setStatus] = useState('');

  const handleChangeStatus = useCallback(
    ({ status }: { status: string }) => {
      setStatus(status);
    },
    []
  );

  useEffect(() => {
    if (!id) return;
  
    statusSocket?.emit('get_status', { id });
    statusSocket?.on(`status_${id}`, handleChangeStatus);
  
    return () => {
      statusSocket?.off(`status_${id}`, handleChangeStatus);
      statusSocket?.emit('get_status_off', { id });
    };
  }, [id, statusSocket, handleChangeStatus]);

  return status;
};

export const useUnreadCount = ({ conversationId, userId }: { conversationId: string, userId: string }) => {
  const { socket } = useSocket();

  const [count, setCount] = useState<number>();

  const request_count = useCallback(() => {
    socket?.emit('request_unread_count', {
      conversationId, 
      userId
    });
  }, [conversationId, socket, userId]);

  const on_unread_count = ({ unreadCount }: { unreadCount: number }) => {
    setCount(unreadCount);
  };


  useEffect(() => {
    socket?.on(`unread_count_${conversationId}`, on_unread_count);
    request_count();

    return () => {
      socket?.off(`unread_count_${conversationId}`, on_unread_count);
    };

  }, [conversationId, request_count, socket]);

  return { count, request_count };
};

export const useUpdateLastMessage = () => {
  const queryClient = useQueryClient();

  const updateLastMessage = useCallback(({ conversationId, lastMessage }) => {

    queryClient.setQueryData(messagesKeys.conversations, (oldConversations: any[]) => {
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
