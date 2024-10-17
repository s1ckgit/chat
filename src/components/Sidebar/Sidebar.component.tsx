import { IconButton, InputAdornment, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

import Conversation from './Conversation/Conversation.component';
import styles from './Sidebar.module.css';
import { useColors, useTransitions } from '../../theme/hooks';
import Drawer from './Drawer/Drawer.component';
import { setConversations, useConversations, useSocket } from '../../store/chat';
import { toggleDrawer } from '../../store/modals';
import ContactsModal from './Drawer/ContactsModal/ContactsModal.component';


const Sidebar = () => {
  const transitions = useTransitions();
  const colors = useColors();
  const { socket } = useSocket();

  if(socket) {
    socket.on('connect', () => {
      console.log('connected');
    });
  
    socket.on('conversations', (data) => {
      setConversations(data);
    });
  }

  const { conversations } = useConversations();


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
