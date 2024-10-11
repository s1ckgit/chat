import styles from './Chat.module.css';
import Message from './Message/Message.component';
import { Input, CircularProgress } from '@mui/material';
import { fetchMessages, useChat } from '../../store';
import { useEffect } from 'react';

const mockMessages = [
  {
    text: 'мы делили апельсин',

  },
  {
    text: 'много нас',

  },
  {
    text: 'а он один',

  },
  {
    text: 'хуй',

  },
  {
    text: 'хуй',

  },
];

interface IChatProps {
  id?: string;
}

const Chat = ({ id }: IChatProps) => {
  useEffect(() => {
    if(!id) return;
    fetchMessages(id);
  }, [id]);

  const { isLoading } = useChat((state) => state);

  return (
    isLoading ? (
      <div className='loading-container'>
        <CircularProgress />
      </div>
    ) : (
      <div className={styles.chat}>
        <div className={styles['chat-bar']}>
          <div className={styles['chat-bar-receiver']}>
            <p className={styles['chat-bar-name']}>Name</p>
            <p className={styles['chat-bar-activity']}>last seen recently</p>
          </div>
          <div className={styles['chat-bar-actions']}>

          </div>
        </div>

        <div className={styles['chat-window']}>
          {
            isLoading ? 'loading...' : mockMessages.map((item) => <Message text={item.text} />)
          }
        </div>

        <div className={styles['chat-actions']}>
          <Input disableUnderline placeholder='Сюда хуйню свою высирай' />
        </div>

      </div>
    )
  );
};

export default Chat;
