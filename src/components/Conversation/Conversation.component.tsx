import { useColors, useTransitions } from '../../theme/hooks';
import styles from './Conversation.module.css';

import { Avatar, Box } from '@mui/material';

const Conversation = () => {
  const colors = useColors();
  const transitions = useTransitions();

  const onClick = () => {
    // Change chat id
  };

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
        <p className={styles['conversation-name']}>name</p>
        <p style={{ color: colors['ghost-main'] }} className={styles['conversation-date']}>date</p>
        <p style={{ color: colors['ghost-main'] }} className={styles['conversation-message']}>last message</p>
        <div style={{ backgroundColor: colors['ghost-main'] }} className={styles['conversation-notifications']}>99+</div>
      </div>
    </Box>
  );
};

export default Conversation;
