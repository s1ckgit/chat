import cn from 'classnames';

import styles from './Message.module.css';
import { useColors, useTypography } from '../../../theme/hooks';
import { useUser } from '../../../store';

interface IMessageProps {
  timestamp?: string;
  senderID?: string;
  text: string;
}

const Message = ({ timestamp, senderID, text }: IMessageProps) => {
  const colors = useColors();
  const typography = useTypography();
  const { id } = useUser();

  const isInitiatorMessage = senderID ===  id;
  const time = '9:17';

  return (
    <div 
      style={{ 
        borderColor: isInitiatorMessage ? colors['messages-initiator-border'] : colors['messages-receiver-border'], 
        backgroundColor: isInitiatorMessage ? colors['messages-initiator'] : colors['messages-receiver'] 
      }} 
      className={cn(styles.message, {
        [styles['message_initiator']]: isInitiatorMessage
      })}
    >
      <p style={{ ...typography['messages-text'] }} className={styles['message-text']}>{text}  <span className={styles['message-date']} style={{ ...typography['messages-date'], color: isInitiatorMessage ? colors['messages-initiator-date'] : colors['messages-receiver-date']}}>{time}</span>  </p>
      
    </div>
  );
};

export default Message;
