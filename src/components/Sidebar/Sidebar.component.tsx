import { Box, IconButton, InputAdornment, TextField } from '@mui/material';

import { 
  Search as SearchIcon,
  Menu as MenuIcon
 } from '@mui/icons-material';

import { useColors, useTransitions } from '../../theme/hooks';
import Drawer from './Drawer.component';
import { toggleDrawer } from '../../store/modals';
import ContactsModal from '../ContactsModal/ContactsModal.component';
import { useState } from 'react';
import Conversations from '../Conversations/Conversations.component';


const Sidebar = () => {
  const transitions = useTransitions();
  const colors = useColors();

  const [searchValue, setSearchValue] = useState('');

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
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
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
      <Conversations searchValue={searchValue} />
    </Box>
  );
};

export default Sidebar;
