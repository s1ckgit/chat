import { useCallback, useEffect } from 'react';
import { setChatId, setReceiverId, setReceiverName } from '../../../store/chat';
import { useColors, useTransitions, useTypography } from '../../../theme/hooks';
import { formatDate } from '../../../utils';
import styles from './Conversation.module.css';

import { Avatar, Badge, Box, Typography } from '@mui/material';
import { useStatus, useUnreadCount, useUpdateLastMessage } from '../../../utils/hooks';
import { useUserMeQuery } from '../../../api/hooks/users';
import { useSocket } from '../../../store/socket';
import { cld } from '../../../utils/сloudinary';

interface IConversationProps {
  id: string;
  receiver: User;
  lastMessage?: Message
}

const Conversation = ({ lastMessage, id, receiver }: IConversationProps) => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { socket } = useSocket();
  const { data: user } = useUserMeQuery();

  const updateLastMessage = useUpdateLastMessage();
  const count = useUnreadCount(id);
  const avatarSrc = receiver.avatarVersion ? cld.image(`avatars/${receiver.id}/thumbnail`).setVersion(receiver.avatarVersion).toURL() : '';
  
  let createdAt;
  let content;
  if(lastMessage) {
    createdAt = lastMessage.createdAt;
    content = lastMessage.content;
  }
  const status = useStatus(receiver.id);
  const date = createdAt ? formatDate(createdAt) : null;

  const onClick = () => {
    setReceiverName(receiver.login);
    setReceiverId(receiver.id);
    setChatId(id);
  };
  
  const onNewMessage = useCallback(({ message }: { message: Message }) => {
    updateLastMessage({ conversationId: id, lastMessage: message });
  }, [id, updateLastMessage]);

  useEffect(() => {
    if(socket) {
      socket.on(`new_message_${id}`,onNewMessage);

      return () => {
        socket.off(`new_message_${id}`, onNewMessage);
      };
    }
  }, [socket, onNewMessage, id, user?.id]);

  useEffect(() => {
    if(socket) {
      socket.emit('request_unread_count', {
        conversationId: id
      });
    }
  }, [id, socket]);

  if(status === '' && count === undefined) return null;

  return (
    <Box onClick={onClick} className={styles.conversation} sx={{ 
       '&:hover': {
          backgroundColor: colors['ghost-light'],
          transition: 'background-color',
          transitionDuration: transitions['shortest']
       }
     }}>
      <Badge
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px white`,
            top: '80%',
            left: '75%'
          },
        }}
        invisible={
          status !== 'online'
        }
        color="primary"
        overlap="circular"
        variant="dot"
      >
        <Avatar src={avatarSrc} />
      </Badge>
      <div className={styles['conversation-info']}>
        <p style={{ ...typography.name }} className={styles['conversation-name']}>{receiver.login}</p>
        <p style={{ ...typography.info, color: colors['ghost-main'] }} className={styles['conversation-date']}>{date}</p>
        <Typography sx={{ 
            ...typography['messages-text'], 
            color: colors['ghost-main'],
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow:'ellipsis',
         }} 
         className={styles['conversation-message']}
         >
          {content}
        </Typography>
        <Badge badgeContent={count} color='primary' max={99} />
      </div>
    </Box>
  );
};

export default Conversation;
