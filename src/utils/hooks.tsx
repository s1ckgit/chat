/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deletePendingMessage, setChatId, useChat } from "../store/chat";
import { useQueryClient } from "@tanstack/react-query";
import { messagesKeys, userKeys } from "../api/queries/queryKeys";
import debounce from 'lodash.debounce';
import { useSocket } from "../store/socket";
import { useGetUserPropQuery, useUserMeQuery } from "../api/hooks/users";
import { formatStatus, preloadImageWithProgress, preloadPreview } from ".";
import { useMessagesQuery } from "../api/hooks/messages";
import Message from "../components/Chat/Message/Message.component";
import { IPendingMessage } from "../types";


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

export const useUpdateAttachmentProgress = () => {
  const queryClient = useQueryClient();

  const updateAttachmentProgress = useCallback(({ conversationId, messageId, progress }) => {
    queryClient.setQueryData(messagesKeys.id(conversationId), (oldMessages: any[]) => {
      if(!oldMessages) return;

      return oldMessages.map((m) => {
        if(m.id === messageId) {
          return {
            ...m,
            attachmentProgress: progress
          };
        }
        return m;
      });
    });
  }, [queryClient]);

  return updateAttachmentProgress;
};

export const useUpdateAttachmentsUrl = () => {
  const queryClient = useQueryClient();

  const updateAttachmentsUrl = useCallback(({ conversationId, messageId, url }) => {
    queryClient.setQueryData(messagesKeys.id(conversationId), (oldMessages: any[]) => {
      if(!oldMessages) return;

      return oldMessages.map((m) => {
        if(m.id === messageId) {
          return {
            ...m,
            attachments: [{
              secure_url: url,
              preview_url: url
            }]
          };
        }
        return m;
      });
    });
  }, [queryClient]);

  return updateAttachmentsUrl;
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

export const useUserAvatar = (id: string) => {
  const { data } = useGetUserPropQuery(id, 'avatarVersion');

  return data;
};

export const useChatWindow = () => {
  const { socket } = useSocket();
  const { id, pendingMessages, receiverId } = useChat();
  const { data, isFetching } = useMessagesQuery(id);
  const { data: user } = useUserMeQuery();

  const markMessageAsRead = useConversationReadMessages();
  const changeMessagesStatus = useMarkMessageAsRead();
  const addMessage = useAddMessageToList();
  const updateAttachmentProgress = useUpdateAttachmentProgress();
  const updateAttachmentsUrl = useUpdateAttachmentsUrl();

  const messages = useMemo(() => {
    return [...(data || []), ...Array.from(pendingMessages.values())];
  }, [data, pendingMessages]);

  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  const renderMessages = useCallback(() => {
    if (!messages.length) return null;
    
    const messagesComponents = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if(i === messages.length - 1) {
        messagesComponents.push(<Message renderAvatar={true} onRead={markMessageAsRead} messageData={message} key={message.id + message.status} />);
      } else {
        const senderId = messages[i].senderId;
        const nextSenderId = messages[i + 1].senderId;
        messagesComponents.push(<Message renderAvatar={senderId !== nextSenderId} onRead={markMessageAsRead} messageData={message} key={message.id + message.status} />);
      }
    }

    return messagesComponents;
    
  }, [markMessageAsRead, messages]);

  const handleNewMessage = useCallback(
    async ({ message }: { message: Message }) => {
      if(message.attachments?.length) {
        const previewUrl = await preloadPreview(message.attachments[0].preview_url);
        if(message.senderId === user?.id) {
          deletePendingMessage(message.id);
        }
        addMessage({ conversationId: id as string, message: {
          ...message,
          attachments: [{
            ...message.attachments[0],
            preview_url: previewUrl
          }],
          attachmentProgress: 0
        }});
        const url = await preloadImageWithProgress(message.attachments[0].secure_url, updateAttachmentProgress, { conversationId: id!, messageId: message.id });
        updateAttachmentsUrl({ conversationId: id!, messageId: message.id, url });
      } else {
        if(message.senderId === user?.id) {
          deletePendingMessage(message.id);
        }
        addMessage({ conversationId: id as string, message });
      }
    },
    [addMessage, id, updateAttachmentProgress, updateAttachmentsUrl, user?.id]
  );

  const handleMessagesRead = useCallback(({ ids }: { ids: string[] }) => {
    changeMessagesStatus({ conversationId: id!, ids });
  }, [changeMessagesStatus, id]);

  const handleNewConversation = useCallback(
    async (data: { id: string }) => {
      if(socket) {
        socket.on(`new_message_${data.id}`, handleNewMessage);
      }
    }, 
    [handleNewMessage, socket]
  );

  const handleNewConversationOpened = useCallback((data: { id: string; }) => {
    setChatId(data.id);
  }, []);

  useEffect(() => {
    if(socket) {
      socket.on(`messages_read_${id}`, handleMessagesRead);

      return () => {
        socket.off(`messages_read_${id}`, handleMessagesRead);
      };
    }
  }, [handleMessagesRead, id, socket]);

  useEffect(() => {
    if(socket) {
      if(id) {
        socket.on(`new_message_${id}`, handleNewMessage);
      }
      else {
        socket.on('new_conversation_opened', handleNewConversationOpened);
      }
      socket.on('new_conversation', handleNewConversation);

      return () => {
        socket.off('new_conversation_opened', handleNewConversationOpened);
        socket.off(`new_conversation`, handleNewConversation);
        socket.off(`new_message_${id}`, handleNewMessage);
      };
    }
  }, [socket, handleNewConversation, handleNewMessage, id, handleNewConversationOpened]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return {
    renderMessages,
    receiverId,
    isMessagesFetching: isFetching,
    chatWindowRef,
    id
  };

};
