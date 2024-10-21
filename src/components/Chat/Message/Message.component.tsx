import cn from 'classnames';

import styles from './Message.module.css';
import { useColors, useTypography } from '../../../theme/hooks';
import { useUser } from '../../../store';
import { format } from 'date-fns';
import MessageStatus from './MessageStatus/MessageStatus.component';
import { useSocket } from '../../../store/chat';
import { useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";

interface IMessageProps {
  id: string;
  createdAt: Date;
  senderID?: string;
  text: string;
  status: 'pending' | 'delivered' | 'read';
  conversationId: string;
}

const Message = ({ createdAt, senderID, text, status, id, conversationId}: IMessageProps) => {
  const colors = useColors();
  const typography = useTypography();

  const { id: userId } = useUser();
  const { socket } = useSocket();

  const isInitiatorMessage = senderID ===  userId;
  const date = format(createdAt, 'HH:mm');
  const [statusState, setStatusState] = useState(status);
  const { ref, inView } = useInView();

  const oneMessageRead = () => {
    setStatusState('read');
  };

  useEffect(() => {
    if(inView && socket && senderID !== userId && status !== 'read') {
      socket?.emit('message_read', {
        id,
        conversationId
      });
    }
  }, [inView, id, socket, status, conversationId, userId, senderID]);

  useEffect(() => {
    if(socket) {
      socket.on(`message_read_${id}`, oneMessageRead);

      return () => {
        socket.off(`message_read_${id}`, oneMessageRead);
      };
    }
  }, [socket, id]);

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
