import { useCallback, useEffect } from 'react';
import { useLastMessageQuery } from '../../../api/hooks/messages';
import { setChatId, setReceiverId, setReceiverName, useSocket } from '../../../store/chat';
import { useColors, useTransitions, useTypography } from '../../../theme/hooks';
import { formatDate } from '../../../utils';
import styles from './Conversation.module.css';

import { Avatar, Box } from '@mui/material';

interface IConversationProps {
  id: string;
  login: string;
  receiverId: string;
  lastMessage: {
    content: string;
    createdAt: Date;
    sender: {
      login: string;
    }
  }
}

const Conversation = ({ login, lastMessage, id, receiverId }: IConversationProps) => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { data: newLastMessage, refetch } = useLastMessageQuery(id);
  const { socket } = useSocket();

  const { createdAt, content } = newLastMessage ?? lastMessage;

  const date = formatDate(createdAt);

  const onClick = () => {
    setReceiverName(login);
    setReceiverId(receiverId);
    setChatId(id);
  };
  
  const onNewMessage = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if(socket) {
      socket.on(`new_message_${id}`,onNewMessage);

      return () => {
        socket.off(`new_message_${id}`, onNewMessage);
      };
    }
  }, [socket, onNewMessage, id]);

  return (
    <Box onClick={onClick} className={styles.conversation} sx={{ 
       '&:hover': {
          backgroundColor: colors['ghost-light'],
          transition: 'background-color',
          transitionDuration: transitions['shortest']
       }
     }}>
      <Avatar src='https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m.png' />
      <div className={styles['conversation-info']}>
        <p style={{ ...typography.name }} className={styles['conversation-name']}>{login}</p>
        <p style={{ ...typography.info, color: colors['ghost-main'] }} className={styles['conversation-date']}>{date}</p>
        <p style={{ ...typography['messages-text'], color: colors['ghost-main'] }} className={styles['conversation-message']}>{content}</p>
        {/* <Badge badgeContent={100} color='primary' max={99} /> */}
      </div>
    </Box>
  );
};

export default Conversation;
