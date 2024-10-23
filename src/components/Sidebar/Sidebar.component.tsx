import { Box, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

import Conversation from './Conversation/Conversation.component';
import styles from './Sidebar.module.css';
import { useColors, useTransitions } from '../../theme/hooks';
import Drawer from './Drawer/Drawer.component';
import { useSocket } from '../../store/chat';
import { toggleDrawer } from '../../store/modals';
import ContactsModal from './Drawer/ContactsModal/ContactsModal.component';
import { useCallback, useEffect } from 'react';
import { useConversationsQuery } from '../../api/hooks/messages';


const Sidebar = () => {
  const transitions = useTransitions();
  const colors = useColors();
  const { socket } = useSocket();
  const { data: conversations, isLoading, isPlaceholderData, refetch, isFetched } = useConversationsQuery();

  const handleNewConversations = useCallback(() => {
    refetch();
  }
, [refetch]);

  useEffect(() => {
    if(socket) {
      socket.on('conversations', handleNewConversations);
      socket.on('new_conversation', handleNewConversations);

      return () => {
        socket.off('conversations', handleNewConversations);
        socket.off('new_conversations', handleNewConversations);
      };
    }
  }, [socket, handleNewConversations]);

  return (
    <Box 
      sx={{
        height: '100vh'
      }}
      className={styles.root}
    >
      <ContactsModal />
      <Drawer />
      <div className={styles.actions}>
      <IconButton 
        onClick={() => toggleDrawer()}
        sx={{ 
            '&:hover svg': {
              transition: `color`,
              transitionDuration: transitions['standard'],
              color: colors['ghost-dark']
            }
          }}
      >
        <MenuIcon color='ghost' />
      </IconButton>

      <TextField
        variant="outlined"
        placeholder="Поиск..."
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }
        }}
        fullWidth
      />
      </div>
      {
        isLoading && !isPlaceholderData ? (
        <Box className='loading-container'>
          <CircularProgress />
        </Box>
        ) : 
        conversations ? (
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto'
            }}
            className={styles.conversations}
           >
            {conversations.map((c) => {
              const receiverId = c.participants[0].id;
              return <Conversation receiverId={receiverId} key={c.id} id={c.id} login={c.participants[0].login} lastMessage={c.lastMessage}/>;
            })}
          </Box>
          ) : isFetched && <>Нет диалогов</>
      }
    </Box>
  );
};

export default Sidebar;
