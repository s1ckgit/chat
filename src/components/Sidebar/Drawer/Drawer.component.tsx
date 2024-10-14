import { Avatar, Button, ClickAwayListener, Divider, Drawer as MUIDrawer } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

import styles from './Drawer.module.css';
import { useColors, useTypography } from "../../../theme/hooks";
import { useState } from "react";

interface IDrawerProps {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const Drawer = ({ isOpened, setIsOpened }: IDrawerProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const onDarkModeToggle = () => setTheme((prev) => prev === 'light' ? 'dark' : 'light');
  const typography = useTypography();
  const colors = useColors();

  return (
    <MUIDrawer anchor='left' open={isOpened}>
      <ClickAwayListener onClickAway={() => setIsOpened(false)}>
        <div className={styles.drawer}>
          <div className={styles['drawer-top']}>
            <Avatar src='https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m.png' />
            <p style={{ ...typography.name }}>name</p>
          </div>
          <Divider sx={{ color: colors['ghost-light'] }} />
          <div className={styles['drawer-actions']}>
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
      </ClickAwayListener>
    </MUIDrawer>
  );
};

export default Drawer;
