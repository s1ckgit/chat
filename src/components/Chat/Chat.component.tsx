import styles from './Chat.module.css';
import Message from './Message/Message.component';
import { Input, CircularProgress, IconButton, Box } from '@mui/material';
import { useChat, useUser } from '../../store';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useColors, useTransitions, useTypography } from '../../theme/hooks';
import SendIcon from '@mui/icons-material/Send';
import { useMessagesQuery } from '../../api/hooks/messages';
import { deletePendingMessage, setChatId, setPendingMessage, useSocket } from '../../store/chat';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { socket } = useSocket();
  const { id, receiverId, receiverName, pendingMessages } = useChat();
  const { id: userId } = useUser();
  const { data, isLoading, error, refetch } = useMessagesQuery(id);

  const [message, setMessage] = useState('');

  console.log(id);

  const messages = useMemo(() => {
    return [...(data?.messages || []), ...Array.from(pendingMessages.values())];
  }, [data, pendingMessages]);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = useCallback(
    async (data: { id: string }) => {
      await refetch();
      deletePendingMessage(data.id);
    },
    [refetch]
  );

  const handleNewConversation = useCallback(
    async (data: { id: string }) => {
      if(socket) {
        socket.on(`new_message_${data.id}`, handleNewMessage);
      }
    }, 
    [handleNewMessage, socket]
  );


  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if(socket) {
      socket.on('new_conversation_opened', async (data: { id: string }) => {
        setChatId(data.id);
      });
      socket.on('new_conversation', handleNewConversation);

      return () => {
        socket.off(`new_conversation`, handleNewConversation);
        socket.off(`new_message_${id}`, handleNewMessage);
      };
    }
  }, [socket, handleNewConversation, handleNewMessage, id]);

  const onSendMessage = () => {
    if(socket) {
      const messageId = uuidv4();
      const createdAt = new Date();

      const newMessage = {
        id: messageId,
        createdAt,
        status: 'pending' as const,
        conversationId: id as string,
        content: message,
        senderId: userId as string,
        receiverId
      };

      setPendingMessage(newMessage);

      socket.emit('send_message', newMessage);
    }

    setMessage('');
  };

  return (
    isLoading ? (
      <div className='loading-container'>
        <CircularProgress />
      </div>
    ) : !error ? (
      <Box 
        sx={{
          display: 'grid',
          overflow: 'hidden',
          height: '100vh',
          gridTemplateRows: receiverName ? 'auto 1fr 80px' : '1fr 80px'
        }}
      >
        <Box sx={{ display: receiverName ? 'grid' : 'none' }} className={styles['chat-bar']} style={{ borderColor: colors['ghost-light'] }}>
          <div className={styles['chat-bar-receiver']}>
            <p style={{ ...typography.name }} className={styles['chat-bar-name']}>{receiverName}</p>
            <p style={{ ...typography.info, color: colors['ghost-main'] }} className={styles['chat-bar-activity']}>last seen recently</p>
          </div>
          <div className={styles['chat-bar-actions']}>
            <IconButton 
              sx={{ 
                  '&:hover svg': {
                    transition: `color`,
                    transitionDuration: transitions['standard'],
                    color: colors['ghost-dark']
                  }
               }}
            >
              <MoreVertIcon color='ghost' />
            </IconButton>
            <IconButton 
              sx={{ 
                  '&:hover svg': {
                    transition: `color`,
                    transitionDuration: transitions['standard'],
                    color: colors['ghost-dark']
                  }
               }}
            >
              <SearchIcon color='ghost' />
            </IconButton>
          </div>
        </Box>

        <Box ref={chatWindowRef} sx={{ overflowY: 'scroll' }} className={styles['chat-window']}>
          { 
            messages && messages.map((message: { content: string; senderId: string | undefined; createdAt: Date; id: string; status: 'pending' | 'delivered' | 'read'; conversationId: string; }) => {
              return <Message conversationId={message.conversationId} id={message.id} status={message.status} key={message.id} text={message.content} senderID={message.senderId} createdAt={message.createdAt} />;
            })
          }
        </Box>

        <div className={styles['chat-actions']} style={{ borderColor: colors['ghost-light'] }}>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} disableUnderline placeholder='Сюда хуйню свою высирай' />
          <IconButton onClick={onSendMessage}>
            <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
          </IconButton>
        </div>

      </Box>
    ) : 'Диалог не найден'
  );
};

export default Chat;
