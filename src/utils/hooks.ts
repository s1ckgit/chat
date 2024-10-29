import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "../store/chat";
import { useQueryClient } from "@tanstack/react-query";
import { messagesKeys } from "../api/queries/queryKeys";
import debounce from 'lodash.debounce';
import { useSocket } from "../store/socket";


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

export const useUnreadCount = (conversationId: string) => {
  const { socket } = useSocket();

  const [count, setCount] = useState<number>();

  const on_unread_count = ({ unreadCount }: { unreadCount: number }) => {
    setCount(unreadCount);
  };

  useEffect(() => {
    socket?.on(`unread_count_${conversationId}`, on_unread_count);

    return () => {
      socket?.off(`unread_count_${conversationId}`, on_unread_count);
    };

  }, [conversationId, socket]);

  return count;
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

export const useAddMessageToList = () => {
  const queryClient = useQueryClient();

  const addMessageToList = useCallback(({ conversationId, message }: { conversationId: string; message: Message }) => {
    queryClient.setQueryData(messagesKeys.id(conversationId), (oldMessages: Message[]) => {
      if(!oldMessages) return;
      return [...oldMessages, message];
    });
  }, [queryClient]);

  return addMessageToList;
};


export function useConversationReadMessages() {
  const { socket } = useSocket();
  const { id } = useChat();

  const readMessageIds = useRef(new Set());

  const sendReadMessages = useCallback(debounce(() => {
    if (readMessageIds.current.size > 0) {
      const messageIds = Array.from(readMessageIds.current);
      socket?.emit('messages_read', { ids: messageIds, conversationId: id });
      readMessageIds.current.clear();
    }
  }, 300), [socket, id]);

  const markMessageAsRead = useCallback((messageId: string) => {
    readMessageIds.current.add(messageId);
    sendReadMessages();
  }, [sendReadMessages]);

  return markMessageAsRead;
}
