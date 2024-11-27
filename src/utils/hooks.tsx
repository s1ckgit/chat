 
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deletePendingMessage, setChatId, setChatInput, setPendingMessage, setShowScrollButton, useChat } from "../store/chat";
import { useQueryClient } from "@tanstack/react-query";
import { messagesKeys } from "../api/queries/queryKeys";
import debounce from 'lodash.debounce';
import { useSocket } from "../store/socket";
import { useUserMeQuery } from "../api/hooks/users";
import { enableSocketEventListeners, formatStatus, preloadImages, scrollChat } from ".";
import { useMessagesQuery, useSendMessageAttachmentsMutation } from "../api/hooks/messages";
import { IClientMessageAttachments, IPendingMessage, MessagesApiResponse } from "../types";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { toggleAttachFileModal } from "../store/modals";
import throttle from "lodash.throttle";
import MessagesGroup from "@/components/Chat/MessagesGroup/MessagesGroup.component";


export const useStatus = (id: User['id']) => {
  const { statusSocket } = useSocket();
  const [status, setStatus] = useState('');

  const handleChangeStatus = useCallback(
    ({ status }: { status: string }) => {
      setStatus(formatStatus(status));
    },
    []
  );

  useEffect(() => {
    if (!id || !statusSocket) return;
    
    const cleanup = enableSocketEventListeners(statusSocket, [
      {
        eventName: `status_${id}`,
        eventCallback: handleChangeStatus
      }
    ]);

    statusSocket.emit('get_status', { id });
  
    return () => {
      cleanup();
      statusSocket.emit('get_status_off', { id });
    };
  }, [id, statusSocket, handleChangeStatus]);

  return status;
};

export const useUnreadCount = (conversationId: Conversation['id']) => {
  const { messagesSocket: socket } = useSocket();

  const [count, setCount] = useState<number>(0);

  const on_unread_count = ({ unreadCount }: { unreadCount: number }) => {
    setCount(unreadCount);
  };

  useEffect(() => {
    if(!socket) return;

    const cleanup = enableSocketEventListeners(socket, [
      {
        eventName: `unread_count_${conversationId}`,
        eventCallback: on_unread_count
      }
    ]);

    return cleanup;

  }, [conversationId, socket]);

  return count;
};

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

export function useConversationReadMessages() {
  const { messagesSocket: socket } = useSocket();
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

  const markMessageAsRead = useCallback(({ conversationId, ids }: { conversationId: Conversation['id']; ids: Message['id'][] }) => {
    queryClient.setQueryData(messagesKeys.id(conversationId), (oldMessages: Message[]) => {
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

export const useIsTyping = (chatId: Conversation['id']) => {
  const [isTyping, setIsTyping] = useState<boolean>();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { messagesSocket: socket } = useSocket();
  const { data: user } = useUserMeQuery();

  useEffect(() => {
    if(!socket) return;

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

    const cleanup = enableSocketEventListeners(socket, [
      {
        eventName: `typing_${chatId}`,
        eventCallback: handleTyping
      }
    ]);

    return cleanup;

  }, [chatId, socket, user?.id]);

  return isTyping;
};

export const useChatWindowComponent = () => {
  const NEW_MESSAGE_SCROLL_OFFSET = 150;

  const { messagesSocket: socket } = useSocket();
  const { id, pendingMessages, receiver, chatWindowElement, showScrollButton } = useChat();
  const { data, isFetching } = useMessagesQuery(id);
  const { data: user } = useUserMeQuery();

  const markMessageAsRead = useConversationReadMessages();
  const changeMessagesStatus = useMarkMessageAsRead();
  const addMessage = useAddMessageToList();

  const prevChatIdRef = useRef<string>('');

  const messages = useMemo(() => {
    const today = format(new Date(), 'dd.MM.yyyy');
    const pendingArray = Array.from(pendingMessages.values());

    if (!data || data.length === 0) {
      return pendingArray.length > 0
        ? [{ date: today, messages: pendingArray }]
        : [];
    }
    if(!pendingArray.length) {
      return data;
    }

    const todayGroup = data.find(group => group.date === today);

    if (todayGroup) {
      return data.map(group =>
        group.date === today
          ? { ...group, messages: [...group.messages, ...pendingArray] }
          : group
      );
    } else {
      return [
        ...data,
        { date: today, messages: pendingArray }
      ];
    }
  }, [data, pendingMessages]);

  const firstUnreadMessagesId = useMemo(() => {
    for(const group of messages) {
      const unreadMessage = group.messages.find((msg) => msg.status === 'delivered' && msg.senderId !== user?.id);

      if(unreadMessage) {
        return unreadMessage.id;
      } else {
        return null;
      }
    }
  }, [messages, user?.id]);
  
  const messageGroups = useMemo(() => {
    if (!messages.length) return null;
    
    return messages.map((group, i) => (
      <MessagesGroup
        isLastGroup={i === messages.length - 1}
        key={i}
        date={group.date}
        messages={group.messages}
        onRead={markMessageAsRead}
      />
    )
  );
  }, [markMessageAsRead, messages]);

  const handleChatWindowScroll = useCallback(throttle(() => {
    if(!chatWindowElement) return;
    const windowOffsetHeight = chatWindowElement.offsetHeight;
    const scrolledHeight = Math.floor(chatWindowElement.scrollHeight - chatWindowElement.scrollTop - windowOffsetHeight);
    if(scrolledHeight > windowOffsetHeight && !showScrollButton) {
      setShowScrollButton(true);
    }
  }, 500), [chatWindowElement, setShowScrollButton, showScrollButton]);

  const handleOnScrollDownButton = useCallback(() => {
    if(chatWindowElement) {
      scrollChat(chatWindowElement, firstUnreadMessagesId ?? null, true);
      setShowScrollButton(false);
    }
  }, [chatWindowElement, firstUnreadMessagesId]);

  const scrollToFirstUnread = useCallback(() => {
    if(chatWindowElement && id) {
      prevChatIdRef.current = id;
      scrollChat(chatWindowElement, firstUnreadMessagesId ?? null);
    }
  }, [chatWindowElement, firstUnreadMessagesId, id]);

  const handleNewMessage = useCallback(
    async ({ message, dateGroup }: { message: Message, dateGroup: string }) => {
        if(message.attachments?.length) {
          await preloadImages(message.attachments.map((attach) => attach.previewUrl));
        }
        if(message.senderId === user?.id) {
          deletePendingMessage(message.id);
        }
        addMessage({ conversationId: id as string, message, dateGroup });

        if(chatWindowElement) {
          const windowOffsetHeight = chatWindowElement.offsetHeight;
          const scrolledHeight = Math.floor(chatWindowElement.scrollHeight - chatWindowElement.scrollTop - windowOffsetHeight);
          if(scrolledHeight < NEW_MESSAGE_SCROLL_OFFSET) {
            scrollChat(chatWindowElement, message.id);
          } else {
            setShowScrollButton(true);
          }
        }
    },
    [addMessage, chatWindowElement, id, user?.id]
  );

  const handleMessagesRead = useCallback(({ ids }: { ids: string[] }) => {
    changeMessagesStatus({ conversationId: id!, ids });
  }, [changeMessagesStatus, id]);

  const handleNewConversationOpened = useCallback((data: { id: string; }) => {
    setChatId(data.id);
  }, []);

  useEffect(() => {
    if(!socket) return;

    const cleanup = enableSocketEventListeners(socket, [
      {
        eventName: id ? `new_message_${id}` : 'new_conversation_opened',
        eventCallback: id ? handleNewMessage : handleNewConversationOpened
      },
      {
        eventName: `messages_read_${id}`, 
        eventCallback: handleMessagesRead
      }
    ]);

    return cleanup;
  }, [handleMessagesRead, handleNewConversationOpened, handleNewMessage, id, socket]);

  useEffect(() => {
    if (id && !isFetching && id !== prevChatIdRef.current) {
      scrollToFirstUnread();
    }
  }, [id, isFetching, scrollToFirstUnread]);

  useEffect(() => {
    if(chatWindowElement) {
      chatWindowElement.addEventListener('scroll', handleChatWindowScroll);

      return () => {
        chatWindowElement.removeEventListener('scroll', handleChatWindowScroll);
      };
    }
  }, [chatWindowElement, handleChatWindowScroll]);

  return {
    messageGroups,
    receiver,
    isMessagesFetching: isFetching,
    chatWindowElement,
    showScrollButton,
    id,
    handleOnScrollDownButton
  };
};

export const useMessage = (messageData: Message | IPendingMessage) => {
  const { data: user } = useUserMeQuery();

  const { senderId, id, content: text, status, createdAt, attachments } = messageData;

  const isInitiatorMessage = senderId ===  user?.id;
  const date = format(createdAt, 'HH:mm');

  return { id, text, status, attachments, isInitiatorMessage, date };
};

export const useSendMessage = () => {
  const { data: user } = useUserMeQuery();
  const { messagesSocket: socket } = useSocket();
  const { id, receiver, chatWindowElement } = useChat();
  const sendMessageAttachments = useSendMessageAttachmentsMutation({});

  const onSend = useCallback(async ({ message, attachments }: { message: string, attachments?: IClientMessageAttachments[] }) => {
    const messageId = uuidv4();
    const createdAt = new Date();

    const newPendingMessage: IPendingMessage = {
      id: messageId,
      createdAt,
      status: 'pending',
      conversationId: id as string,
      content: message,
      senderId: user?.id as string,
      receiverId: receiver?.id,
      attachments
    };
    setPendingMessage(newPendingMessage);
    setChatInput('');
    if(chatWindowElement) {
      scrollChat(chatWindowElement, messageId);
    }

    if(attachments) {
      toggleAttachFileModal();

      const formData = new FormData();
      formData.append('messageId', messageId);
      formData.append('conversationId', id!);
      attachments.forEach((attachment) => {
        formData.append('attachments', attachment.file);
      });

      const attachmentsLinks = await sendMessageAttachments.mutateAsync(formData);
      const newMessage = {
        ...newPendingMessage,
        attachments: attachmentsLinks
      };
      socket?.emit('send_message', newMessage);
    } 
    else {
      socket?.emit('send_message', newPendingMessage);
    }
  }, [chatWindowElement, id, receiver?.id, sendMessageAttachments, socket, user?.id]);
  return onSend;
};
