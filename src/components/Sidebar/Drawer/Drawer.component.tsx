import { Avatar, Box, Button, Divider, IconButton, Drawer as MUIDrawer } from "@mui/material";

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ContactsIcon from '@mui/icons-material/Contacts';

import styles from './Drawer.module.css';
import { useColors, useTransitions, useTypography } from "../../../theme/hooks";
import { ChangeEvent, useState } from "react";
import { toggleContactsModal, toggleDrawer, useModals } from "../../../store/modals";
import { useChangeUserAvatarMutation, useLogoutMutation, useUserMeQuery } from "../../../api/hooks/users";
import { cld } from "../../../utils/сloudinary";

const Drawer = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const onDarkModeToggle = () => setTheme((prev) => prev === 'light' ? 'dark' : 'light');
  const [isHover, setIsHover] = useState(false);

  const typography = useTypography();
  const colors = useColors();
  const transitions = useTransitions();

  const { data: me, refetch } = useUserMeQuery();
  const changeUserAvatarMutation = useChangeUserAvatarMutation({
    onSuccess: () => {
      refetch();
    }
  });
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      localStorage.removeItem('id');
      window.location.reload();
    },
    onError: (e: unknown) => console.error(e)
  });
  const avatarSrc = (me && me.avatarVersion) ? cld.image(`avatars/${me.id}/thumbnail`).setVersion(me.avatarVersion).toURL() : '';

  const onLogout = () => {
    logoutMutation.mutate({});
  };

  const isOpened = useModals(state => state.drawer);

  const onUploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.length) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      await changeUserAvatarMutation.mutateAsync(formData);
    }
  };

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
          <Box
            component='div'
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            sx={{
              overflow: 'hidden',
              width: 'min-content',
              position: 'relative',
              borderRadius: '100%'
            }}
          >
            <Avatar
              sx={{ width: 96, height: 96 }} 
              src={avatarSrc}
            />

            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bottom: isHover ? '0' : '-100%',
                left: '0',
                width: '100%',
                height: '30px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                transition: `bottom ${transitions.standard}`
              }}
            >
              <IconButton
                component='label'
                sx={{
                  height: 20,
                  width: 20
                }}
              >
                <PhotoCameraIcon 
                  sx={{
                    color: 'white',
                  }}
                />
                <input onChange={onUploadAvatar} hidden type="file" />
              </IconButton>
            </Box>
          </Box>
          <p style={{ ...typography.name }}>{me?.login}</p>
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

        <Button
          variant="text"
          sx={{
            color: 'red',
            marginTop: 'auto'
          }}
          onClick={onLogout}
        >
          Выйти
        </Button>
      </div>
    </MUIDrawer>
  );
};

export default Drawer;
