import cn from 'classnames';

import styles from './Message.module.css';

interface IMessageProps {
  timestamp?: string;
  senderID?: string;
  text: string;
}

const Message = ({ timestamp, senderID, text }: IMessageProps) => {
  // const isInitiatorMessage = senderID === user.id;
  const isInitiatorMessage = Math.random() * 10 > 5 ? true : false;
  const time = '9:17';

  return (
    <div className={cn(styles.message, {
      [styles['message_initiator']]: isInitiatorMessage
    })}>
      <p className={styles['message-text']}>{text}</p>
      <span>{time}</span>
    </div>
  );
};

export default Message;
