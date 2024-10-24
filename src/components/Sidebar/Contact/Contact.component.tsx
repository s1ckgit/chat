import { Avatar, Badge, Box, Typography } from "@mui/material";
import { useColors } from "../../../theme/hooks";
import { setChatId, setReceiverId, setReceiverName, useSocket } from "../../../store/chat";
import { closeAllModals } from "../../../store/modals";
import { useCallback, useEffect, useState } from "react";

interface IContactComponentProps {
  login: string;
  converstaionId: string | null;
  id: string;
}

const ContactComponent = ({ login, converstaionId, id }: IContactComponentProps) => {
  const colors = useColors();

  const { statusSocket } = useSocket();

  const [status, setStatus] = useState('');

  const handleChangeStatus = useCallback(
    ({ status }: { status: string }) => {
      setStatus(status);
    },
    []
  );

  useEffect(() => {
    if (!id) return;
    console.log(id);
  
    statusSocket?.emit('get_status', { id });
    statusSocket?.on(`status_${id}`, handleChangeStatus);
  
    return () => {
      statusSocket?.off(`status_${id}`, handleChangeStatus);
      statusSocket?.emit('get_status_off', { id });
    };
  }, [id, statusSocket, handleChangeStatus]);

  if(status === '') return;
  
  return (
    <Box 
      onClick={() => {
        console.log(id);
        setChatId(converstaionId ?? undefined);
        setReceiverName(login);
        setReceiverId(id);
        closeAllModals();
      }}
      sx={{
        '&:hover': {
          backgroundColor: colors['ghost-light']
        },
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        columnGap: '16px',
        cursor: 'pointer'
      }}
    >
      <Badge
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px white`,
            top: '80%',
            left: '75%'
          },
        }}
        invisible={
          status == 'offline'
        }
        color="primary"
        overlap="circular"
        variant="dot"
      >
        <Avatar src="https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" />
      </Badge>
      <Box
        sx={{
          padding: '8px 0px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="subtitle2">{login}</Typography>
        <Typography variant="subtitle1">last seen recently</Typography>
      </Box>
    </Box>
  );
};

export default ContactComponent;
