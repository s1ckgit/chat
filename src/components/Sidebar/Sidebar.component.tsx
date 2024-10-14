import { IconButton, InputAdornment, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

import Conversation from './Conversation/Conversation.component';
import styles from './Sidebar.module.css';
import { useColors, useTransitions } from '../../theme/hooks';
import Drawer from './Drawer/Drawer.component';
import { useState } from 'react';


const Sidebar = () => {
  const transitions = useTransitions();
  const colors = useColors();

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);


  return (
    <div className={styles.root}>
      <Drawer isOpened={isDrawerOpened} setIsOpened={setIsDrawerOpened} />
      <div className={styles.actions}>
      <IconButton 
        onClick={() => setIsDrawerOpened(true)}
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
      <div className={styles.conversations}>
        {[1,1,1,1,1,1,1,1,1,1].map(() => <Conversation />)}
      </div>
    </div>
  );
};

export default Sidebar;
