import styles from './Chat.module.css';
import Message from './Message/Message.component';
import { Input, CircularProgress } from '@mui/material';
import { fetchMessages, useChat } from '../../store';
import { useEffect } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Button from '../ui/Button/Button.ui';
import { useColors, useTransitions } from '../../theme/hooks';
import SendIcon from '@mui/icons-material/Send';

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
  const colors = useColors();
  const transitions = useTransitions();

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
        <div className={styles['chat-bar']} style={{ borderColor: colors['ghost-light'] }}>
          <div className={styles['chat-bar-receiver']}>
            <p className={styles['chat-bar-name']}>Name</p>
            <p style={{ color: colors['ghost-main'] }} className={styles['chat-bar-activity']}>last seen recently</p>
          </div>
          <div className={styles['chat-bar-actions']}>
            <Button variant="icon">
              <MoreVertIcon sx={{ 
                transition: `color`,
                transitionDuration: transitions['standard'],
                '&:hover': {
                  color: colors['ghost-dark']
                }
               }} color='ghost' />
            </Button>
            <Button variant="icon">
              <SearchIcon sx={{ 
                transition: `color`,
                transitionDuration: transitions['standard'],
                '&:hover': {
                  color: colors['ghost-dark']
                }
               }} color='ghost' />
            </Button>
          </div>
        </div>

        <div className={styles['chat-window']}>
          {
            isLoading ? 'loading...' : mockMessages.map((item) => <Message text={item.text} />)
          }
        </div>

        <div className={styles['chat-actions']} style={{ borderColor: colors['ghost-light'] }}>
          <Input disableUnderline placeholder='Сюда хуйню свою высирай' />
          <Button variant='icon'>
            <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
          </Button>
        </div>

      </div>
    )
  );
};

export default Chat;
