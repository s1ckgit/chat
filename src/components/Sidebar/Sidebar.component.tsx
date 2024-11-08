import { Box, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

import Conversation from './Conversation/Conversation.component';
import styles from './Sidebar.module.css';
import { useColors, useTransitions } from '../../theme/hooks';
import Drawer from './Drawer/Drawer.component';
import { useSocket } from '../../store/socket';
import { toggleDrawer } from '../../store/modals';
import ContactsModal from './Drawer/ContactsModal/ContactsModal.component';
import { useCallback, useEffect } from 'react';
import { useConversationsQuery } from '../../api/hooks/messages';


const Sidebar = () => {
  const transitions = useTransitions();
  const colors = useColors();
  const { socket } = useSocket();
  const { data: conversations, isLoading, isPlaceholderData, refetch, isFetched } = useConversationsQuery();

  const handleGetConversations = useCallback(() => {
    refetch();
  }
  , [refetch]);

  const handleNewConversation = useCallback(({ id }: { id: string }) => {
    socket?.emit('new_conversation', {
      id
    });
    refetch();
  }, [refetch, socket]);

  useEffect(() => {
    if(socket) {
      socket.on('conversations', handleGetConversations);
      socket.on('new_conversation', handleNewConversation);

      return () => {
        socket.off('conversations', handleGetConversations);
        socket.off('new_conversation', handleNewConversation);
      };
    }
  }, [socket, handleNewConversation, handleGetConversations]);

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
              const receiver = c.participants[0];
              return <Conversation receiver={receiver} key={c.id} id={c.id} lastMessage={c.lastMessage}/>;
            })}
          </Box>
          ) : isFetched && <>Нет диалогов</>
      }
    </Box>
  );
};

export default Sidebar;
