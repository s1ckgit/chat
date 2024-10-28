import cn from 'classnames';

import styles from './Message.module.css';
import { useColors, useTypography } from '../../../theme/hooks';
import { format } from 'date-fns';
import MessageStatus from './MessageStatus/MessageStatus.component';
import { useSocket } from '../../../store/chat';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";
import { useUnreadCount } from '../../../utils/hooks';
import { useUserMeQuery } from '../../../api/hooks/users';

interface IMessageProps {
  id: string;
  createdAt: Date;
  senderID?: string;
  text: string;
  status: 'pending' | 'delivered' | 'read';
  conversationId: string;
}

const Message = ({ createdAt, senderID, text, status, id, conversationId }: IMessageProps) => {
  const colors = useColors();
  const typography = useTypography();

  const { data: user } = useUserMeQuery();
  const { socket } = useSocket();

  const isInitiatorMessage = senderID ===  user?.id;
  const date = format(createdAt, 'HH:mm');
  const [statusState, setStatusState] = useState(status);
  const { ref, inView } = useInView();
  const { request_count } = useUnreadCount({
    conversationId,
    userId: user?.id as string
  });

  const oneMessageRead = useCallback(() => {
    setStatusState('read');
    request_count();
    
  }, [request_count]);

  useEffect(() => {
    if(inView && socket && senderID !== user?.id && status !== 'read') {
      socket?.emit('message_read', {
        id,
        conversationId
      });
    }
  }, [inView, id, socket, status, conversationId, user?.id, senderID]);

  useEffect(() => {
    if(socket) {
      socket.on(`message_read_${id}`, oneMessageRead);

      return () => {
        socket.off(`message_read_${id}`, oneMessageRead);
      };
    }
  }, [socket, id, oneMessageRead]);

  return (
    <div
      ref={ref} 
      style={{ 
        borderColor: isInitiatorMessage ? colors['messages-initiator-border'] : colors['messages-receiver-border'], 
        backgroundColor: isInitiatorMessage ? colors['messages-initiator'] : colors['messages-receiver'] 
      }} 
      className={cn(styles.message, {
        [styles['message_initiator']]: isInitiatorMessage
      })}
    >
      <p style={{ ...typography['messages-text'] }} className={styles['message-text']}>
        {text}
        <span className={styles['message-date']} style={{ ...typography['messages-date'], color: isInitiatorMessage ? colors['messages-initiator-date'] : colors['messages-receiver-date'] }}>
          <MessageStatus status={statusState} />
          {date}
        </span>
      </p>
      
    </div>
  );
};

export default Message;
