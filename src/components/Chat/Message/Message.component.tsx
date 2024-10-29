import cn from 'classnames';

import styles from './Message.module.css';
import { useColors, useTypography } from '../../../theme/hooks';
import { format } from 'date-fns';
import MessageStatus from './MessageStatus/MessageStatus.component';
import { useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";
import { useUserMeQuery } from '../../../api/hooks/users';

interface IMessageProps {
  id: string;
  createdAt: Date;
  senderID?: string;
  text: string;
  status: 'pending' | 'delivered' | 'read';
  conversationId: string;
  onRead: (messageId: string) => void
}

const Message = ({ createdAt, senderID, text, status, id, onRead }: IMessageProps) => {
  const colors = useColors();
  const typography = useTypography();

  const { data: user } = useUserMeQuery();

  const isInitiatorMessage = senderID ===  user?.id;
  const date = format(createdAt, 'HH:mm');
  const [statusState, setStatusState] = useState(status);
  const { ref, inView } = useInView();

  // const oneMessageRead = useCallback(() => {
  //   setStatusState('read');
  //   request_count();
    
  // }, [request_count]);

  useEffect(() => {
    if (inView && senderID !== user?.id && status !== 'read') {
      onRead(id);
      setStatusState('read');
    }
  }, [inView, id, senderID, user?.id, status, onRead]);

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
