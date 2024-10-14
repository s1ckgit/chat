import styles from './Chat.module.css';
import Message from './Message/Message.component';
import { Input, CircularProgress, IconButton } from '@mui/material';
import { fetchMessages, useChat } from '../../store';
import { useEffect } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useColors, useTransitions, useTypography } from '../../theme/hooks';
import SendIcon from '@mui/icons-material/Send';

const mockMessages = [
  {
    text: 'мы делили апельсин ksrnghrsjknsroih ',

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
  const typography = useTypography();

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
            <p style={{ ...typography.name }} className={styles['chat-bar-name']}>Name</p>
            <p style={{ ...typography.info, color: colors['ghost-main'] }} className={styles['chat-bar-activity']}>last seen recently</p>
          </div>
          <div className={styles['chat-bar-actions']}>
            <IconButton 
              sx={{ 
                  '&:hover svg': {
                    transition: `color`,
                    transitionDuration: transitions['standard'],
                    color: colors['ghost-dark']
                  }
               }}
            >
              <MoreVertIcon color='ghost' />
            </IconButton>
            <IconButton 
              sx={{ 
                  '&:hover svg': {
                    transition: `color`,
                    transitionDuration: transitions['standard'],
                    color: colors['ghost-dark']
                  }
               }}
            >
              <SearchIcon color='ghost' />
            </IconButton>
          </div>
        </div>

        <div className={styles['chat-window']}>
          {
            isLoading ? 'loading...' : mockMessages.map((item) => <Message text={item.text} />)
          }
        </div>

        <div className={styles['chat-actions']} style={{ borderColor: colors['ghost-light'] }}>
          <Input disableUnderline placeholder='Сюда хуйню свою высирай' />
          <IconButton>
            <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
          </IconButton>
        </div>

      </div>
    )
  );
};

export default Chat;
