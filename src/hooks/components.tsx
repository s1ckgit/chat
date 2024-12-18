import { format } from "date-fns";
import throttle from "lodash.throttle";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useMessagesQuery } from "@/api/hooks/messages";
import { useUserMeQuery } from "@/api/hooks/users";
import { deleteAllPendingMessages, deletePendingMessage, setChatId, setShowScrollButton, useChat } from "@/store/chat";
import { useSocket } from "@/store/socket";
import { enableSocketEventListeners, preloadImages, scrollChat } from "@/utils";
import { useConversationReadMessages } from "./helpers";
import { useAddMessageToList, useMarkMessageAsRead } from "./cache-handlers";
import MessagesGroup from "@/components/Chat/MessagesGroup/MessagesGroup.component";
import type { IPendingMessage } from "@/types";

export const useChatWindowComponent = () => {
  const NEW_MESSAGE_SCROLL_OFFSET = 150;

  const { messagesSocket: socket } = useSocket();
  const { id, pendingMessages, receiver, chatWindowElement, showScrollButton } = useChat();
  const { data, isFetching, isSuccess } = useMessagesQuery(id);
  const { data: user } = useUserMeQuery();

  const markMessageAsRead = useConversationReadMessages();
  const changeMessagesStatus = useMarkMessageAsRead();
  const addMessage = useAddMessageToList();

  const prevChatIdRef = useRef<string>('');

  const messages = useMemo(() => {
    const today = format(new Date(), 'dd.MM.yyyy');
    const groupedMessages = new Map<string, (Message | IPendingMessage)[]>();
  
    data?.forEach((group) => groupedMessages.set(group.date, group.messages));
  
    if (pendingMessages.size > 0) {
      const pendingArray = Array.from(pendingMessages.values());
      const todayMessages = groupedMessages.get(today) || [];
      groupedMessages.set(today, [...todayMessages, ...pendingArray]);
    }
  
    return [...groupedMessages.entries()].map(([date, messages]) => ({
      date,
      messages,
    }));
  }, [data, pendingMessages]);

  const firstUnreadMessagesId = useMemo(() => {
    const allMessages = messages.flatMap((group) => group.messages);
    const unreadMessage = allMessages.find((msg) => msg.status === 'delivered' && msg.senderId !== user?.id);
    return unreadMessage?.id || null;
  }, [messages, user?.id]);
  
  const messageGroups = useMemo(() => {
    if(!messages.length) return null;
    return messages.map((group, i) => (
      <MessagesGroup
        isLastGroup={i === messages.length - 1}
        key={group.date}
        date={group.date}
        messages={group.messages}
        onRead={markMessageAsRead}
      />
    ));
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

        if(!chatWindowElement) return;

        if(message.attachments?.length) {
          await preloadImages(message.attachments.map((attach) => attach.previewUrl));
        }
        if(message.senderId === user?.id) {
          deletePendingMessage(message.id);
        }

        addMessage({ conversationId: id as string, message, dateGroup });

        const scrolledHeight = Math.floor(chatWindowElement.scrollHeight - chatWindowElement.scrollTop - chatWindowElement.offsetHeight);
        if(scrolledHeight < NEW_MESSAGE_SCROLL_OFFSET) {
          scrollChat(chatWindowElement, message.id);
        } else {
          setShowScrollButton(true);
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

  useEffect(() => {
    if (isSuccess) {
      deleteAllPendingMessages();
    }
  }, [data, isSuccess]);

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
