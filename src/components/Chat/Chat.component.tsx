import styles from './Chat.module.css';
import Message from './Message/Message.component';
import { Input, CircularProgress, IconButton, Box } from '@mui/material';
import { useChat, useUser } from '../../store';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useColors, useTransitions, useTypography } from '../../theme/hooks';
import SendIcon from '@mui/icons-material/Send';
import { useMessagesQuery } from '../../api/hooks/messages';
import { useSocket } from '../../store/chat';
import { useEffect, useState } from 'react';

const Chat = () => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { socket } = useSocket();
  const { id, receiverId, receiverName } = useChat();
  const { id: userId } = useUser();
  const { data, isLoading, error, refetch } = useMessagesQuery(id);

  const [message, setMessage] = useState('');

  useEffect(() => {
    if(socket) {
      socket.on(`new_message_${id}`, () => {
        console.log('вернулось новое сообщение');
        refetch();
      });

      return () => {
        socket.off(`new_message_${id}`);
      };
    }
  }, [socket, refetch, id]);

  const onSendMessage = () => {
    if(socket) {
      socket.emit('send_message', {
        conversationId: id,
        content: message,
        senderId: userId,
        receiverId
      });
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
          height: '100vh',
          gridTemplateRows: receiverId ? 'auto 1fr 80px' : '1fr 80px'
        }}
      >
        <Box sx={{ display: receiverId ? 'grid' : 'none' }} className={styles['chat-bar']} style={{ borderColor: colors['ghost-light'] }}>
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

        <div className={styles['chat-window']}>
          { 
            data && data.messages.map((message: { content: string; senderId: string | undefined; createdAt: string | undefined; }) => {
              return <Message text={message.content} senderID={message.senderId} timestamp={message.createdAt} />;
            })
          }
        </div>

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
