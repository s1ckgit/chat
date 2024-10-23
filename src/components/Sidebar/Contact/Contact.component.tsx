import { Avatar, Box, Typography } from "@mui/material";
import { useColors } from "../../../theme/hooks";
import { setChatId, setReceiverId, setReceiverName } from "../../../store/chat";
import { closeAllModals } from "../../../store/modals";

interface IContactComponentProps {
  login: string;
  converstaionId: string | null;
  id: string;
}

const ContactComponent = ({ login, converstaionId, id }: IContactComponentProps) => {
  const colors = useColors();
  
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
      <Avatar src="https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" />
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
