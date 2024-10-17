import { Avatar, Button, Divider, Drawer as MUIDrawer } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ContactsIcon from '@mui/icons-material/Contacts';

import styles from './Drawer.module.css';
import { useColors, useTypography } from "../../../theme/hooks";
import { useState } from "react";
import { toggleContactsModal, toggleDrawer, useModals } from "../../../store/modals";

const Drawer = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const onDarkModeToggle = () => setTheme((prev) => prev === 'light' ? 'dark' : 'light');

  const typography = useTypography();
  const colors = useColors();

  const isOpened = useModals(state => state.drawer);

  return (
    <MUIDrawer 
      slotProps={{
        backdrop: {
          onClick: toggleDrawer
        }
      }} 
      anchor='left' 
      open={isOpened}
    >
      <div className={styles.drawer}>
        <div className={styles['drawer-top']}>
          <Avatar src='https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m.png' />
          <p style={{ ...typography.name }}>name</p>
        </div>
        <Divider sx={{ color: colors['ghost-light'] }} />
        <div className={styles['drawer-actions']}>
          <Button onClick={() => toggleContactsModal()} sx={{ color: "#000", justifyContent: 'start', paddingLeft: '32px' }} startIcon={<ContactsIcon />}>Контакты</Button>
          <Button sx={{ color: "#000", justifyContent: 'start', paddingLeft: '32px' }} startIcon={<SettingsIcon />}>Настройки</Button>
          <Button 
            onClick={onDarkModeToggle} 
            sx={{ 
              '.MuiButton-endIcon': { 
                marginLeft: 'auto', 
                '& svg': {
                  fontSize: '32px',
                }, 
              },
              color: "#000", 
              justifyContent: 'start',
              paddingLeft: '32px', 
              paddingRight: '32px' 
            }} 
            startIcon={<DarkModeIcon />} 
            endIcon={theme === 'light' ? <ToggleOffIcon color="ghost" /> : <ToggleOnIcon/>}
          >
            Тёмный режим
          </Button>
        </div>
      </div>
    </MUIDrawer>
  );
};

export default Drawer;
