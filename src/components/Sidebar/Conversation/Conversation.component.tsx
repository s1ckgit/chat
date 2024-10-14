import { useColors, useTransitions, useTypography } from '../../../theme/hooks';
import styles from './Conversation.module.css';

import { Avatar, Box, Badge } from '@mui/material';

const Conversation = () => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

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
        <p style={{ ...typography.name }} className={styles['conversation-name']}>name</p>
        <p style={{ ...typography.info, color: colors['ghost-main'] }} className={styles['conversation-date']}>date</p>
        <p style={{ ...typography['messages-text'], color: colors['ghost-main'] }} className={styles['conversation-message']}>last message</p>
        <Badge badgeContent={100} color='primary' max={99} />
      </div>
    </Box>
  );
};

export default Conversation;
