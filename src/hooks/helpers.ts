import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useUserMeQuery } from "@/api/hooks/users";
import { setChatInput, setPendingMessage, useChat } from "@/store/chat";
import { useSocket } from "@/store/socket";
import { enableSocketEventListeners, formatStatus, scrollChat } from "@/utils";
import { IClientMessageAttachments, IPendingMessage } from "@/types";
import { format } from "date-fns";
import { toggleAttachFileModal } from "@/store/modals";
import { useSendMessageAttachmentsMutation } from "@/api/hooks/messages";

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

export const useMessage = (messageData: Message | IPendingMessage) => {
  const { data: user } = useUserMeQuery();

  const { senderId, id, content: text, status, createdAt, attachments } = messageData;

  const isInitiatorMessage = senderId ===  user?.id;
  const date = format(createdAt, 'HH:mm');

  return { id, text, status, attachments, isInitiatorMessage, date };
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

export const useSendMessage = () => {
  const { data: user } = useUserMeQuery();
  const { messagesSocket: socket } = useSocket();
  const { id, receiver, chatWindowElement } = useChat();
  const sendMessageAttachments = useSendMessageAttachmentsMutation({});

  const onSend = useCallback(async ({ message, attachments }: { message: string, attachments?: IClientMessageAttachments[] }) => {
    if(!chatWindowElement) return;

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
    scrollChat(chatWindowElement, messageId);

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
