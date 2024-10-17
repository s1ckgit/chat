import styles from './Chat.module.css';
import Message from './Message/Message.component';
import { Input, CircularProgress, IconButton } from '@mui/material';
import { useChat } from '../../store';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useColors, useTransitions, useTypography } from '../../theme/hooks';
import SendIcon from '@mui/icons-material/Send';
import { useMessagesQuery } from '../../api/hooks/messages';

const Chat = () => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { id } = useChat();

  const { data, isLoading, error } = useMessagesQuery(id);

  console.log(data);
  console.log(id);

  return (
    isLoading ? (
      <div className='loading-container'>
        <CircularProgress />
      </div>
    ) : !error ? (
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
            data && data.messages.map((message) => {
              return <Message text={message.content} senderID={message.senderId} timestamp={message.createdAt} />;
            })
          }
        </div>

        <div className={styles['chat-actions']} style={{ borderColor: colors['ghost-light'] }}>
          <Input disableUnderline placeholder='Сюда хуйню свою высирай' />
          <IconButton>
            <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
          </IconButton>
        </div>

      </div>
    ) : 'Диалог не найден'
  );
};

export default Chat;
