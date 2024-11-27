import { Box, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

import Conversation from './Conversation/Conversation.component';
import { useColors, useTransitions } from '../../theme/hooks';
import Drawer from './Drawer.component';
import { useSocket } from '../../store/socket';
import { toggleDrawer } from '../../store/modals';
import ContactsModal from '../ContactsModal/ContactsModal.component';
import { useCallback, useEffect } from 'react';
import { useConversationsQuery } from '../../api/hooks/messages';
import { enableSocketEventListeners } from '../../utils';


const Sidebar = () => {
  const transitions = useTransitions();
  const colors = useColors();
  const { messagesSocket: socket } = useSocket();
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
    if(!socket) return;
    const cleanup = enableSocketEventListeners(socket, [
      {
        eventName: 'conversations',
        eventCallback: handleGetConversations
      },
      {
        eventName: 'new_conversation',
        eventCallback: handleNewConversation
      }
    ]);
    return cleanup;
  }, [socket, handleNewConversation, handleGetConversations]);

  return (
    <Box 
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ContactsModal />
      <Drawer />
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          columnGap: '12px',
        
          padding: '8px 12px',
        }}
      >
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
      </Box>
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
           >
            {conversations.map((c) => {
              return <Conversation key={c.id} conversation={c} />;
            })}
          </Box>
          ) : isFetched && <>Нет диалогов</>
      }
    </Box>
  );
};

export default Sidebar;
