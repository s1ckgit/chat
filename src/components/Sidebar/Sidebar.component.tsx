import { IconButton, InputAdornment, TextField } from '@mui/material';

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
  const { data: conversations, refetch } = useConversationsQuery();

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

  console.log(conversations);


  return (
    <div className={styles.root}>
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
        conversations && (
        <div className={styles.conversations}>
          {conversations.map((c) => <Conversation key={c.id} id={c.id} login={c.participants[0].login} lastMessage={c.lastMessage}/>)}
        </div>
        )
      }
    </div>
  );
};

export default Sidebar;
