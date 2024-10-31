import { useCallback, useEffect } from 'react';
import { setChatId, setReceiverId, setReceiverName } from '../../../store/chat';
import { useColors, useTransitions, useTypography } from '../../../theme/hooks';
import { formatDate } from '../../../utils';
import styles from './Conversation.module.css';

import { Avatar, Badge, Box } from '@mui/material';
import { useStatus, useUnreadCount, useUpdateLastMessage } from '../../../utils/hooks';
import { useUserMeQuery } from '../../../api/hooks/users';
import { useSocket } from '../../../store/socket';

interface IConversationProps {
  id: string;
  login: string;
  receiverId: string;
  lastMessage?: Message
}

const Conversation = ({ login, lastMessage, id, receiverId }: IConversationProps) => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { socket } = useSocket();
  const { data: user } = useUserMeQuery();

  const updateLastMessage = useUpdateLastMessage();
  const count = useUnreadCount(id);
  
  let createdAt;
  let content;
  if(lastMessage) {
    createdAt = lastMessage.createdAt;
    content = lastMessage.content;
  }
  const status = useStatus(receiverId);
  const date = createdAt ? formatDate(createdAt) : null;

  const onClick = () => {
    setReceiverName(login);
    setReceiverId(receiverId);
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
        <Avatar src="https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" />
      </Badge>
      <div className={styles['conversation-info']}>
        <p style={{ ...typography.name }} className={styles['conversation-name']}>{login}</p>
        <p style={{ ...typography.info, color: colors['ghost-main'] }} className={styles['conversation-date']}>{date}</p>
        <p style={{ ...typography['messages-text'], color: colors['ghost-main'] }} className={styles['conversation-message']}>{content}</p>
        <Badge badgeContent={count} color='primary' max={99} />
      </div>
    </Box>
  );
};

export default Conversation;
