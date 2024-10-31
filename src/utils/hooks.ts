import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "../store/chat";
import { useQueryClient } from "@tanstack/react-query";
import { messagesKeys, userKeys } from "../api/queries/queryKeys";
import debounce from 'lodash.debounce';
import { useSocket } from "../store/socket";
import { useUserMeQuery } from "../api/hooks/users";
import { formatStatus } from ".";


export const useStatus = (id: string) => {
  const { statusSocket } = useSocket();
  const [status, setStatus] = useState('');

  const handleChangeStatus = useCallback(
    ({ status }: { status: string }) => {
      setStatus(formatStatus(status));
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

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  const markMessageAsRead = useCallback(({ conversationId, ids }: { conversationId: string; ids: string[] }) => {
    queryClient.setQueryData(messagesKeys.id(conversationId), (oldMessages: Message[] | undefined) => {
      if (!oldMessages) return;

      return oldMessages.map((m) => {
        if (ids.includes(m.id)) {
          return { ...m, status: 'read' };
        }
        return m;
      });
    });
  }, [queryClient]);

  return markMessageAsRead;
};

export const useChangeAvatarSrc = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUserMeQuery();

  const changeAvatarSrc = useCallback((avatarSrc: string) => {
    queryClient.setQueryData(userKeys.me(user!.id), (oldData: User) => {
      return {
        ...oldData,
        avatarSrc
      };
    });
  }, [queryClient, user]);

  return changeAvatarSrc;
};

export const useIsTyping = (chatId: string) => {
  const [isTyping, setIsTyping] = useState<boolean>();
  const typingTimeoutRef = useRef<number | null>(null);

  const { socket } = useSocket();
  const { data: user } = useUserMeQuery();

  useEffect(() => {
    const handleTyping = ({ userId }: { userId: User['id'] }) => {
      if(userId !== user?.id) {
        setIsTyping(true);

        if(typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
  
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }

    };

    socket?.on(`typing_${chatId}`, handleTyping);

    return () => {
      socket?.off(`typing_${chatId}`, handleTyping);
    };

  }, [chatId, socket, user?.id]);

  return isTyping;
};
