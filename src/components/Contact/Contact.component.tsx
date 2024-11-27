import { Badge, Box, Typography } from "@mui/material";

import { useColors } from "@/theme/hooks";
import { setChatId, setReceiver } from "@/store/chat";
import { closeAllModals } from "@/store/modals";
import { useStatus } from "@/utils/hooks";
import UserAvatarComponent from "../UserAvatar/UserAvatar.component";

interface IContactComponentProps {
  contactUser: User;
  conversationId: Contact['conversationId'];
}

const ContactComponent = ({ conversationId, contactUser }: IContactComponentProps) => {
  const { id: contactId, login } = contactUser;

  const colors = useColors();
  const status = useStatus(contactId);

  if(status === '') return;
  
  return (
    <Box 
      onClick={() => {
        setChatId(conversationId ?? undefined);
        setReceiver(contactUser);
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
        <UserAvatarComponent id={contactId} />
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
        <Typography variant="subtitle1">{status}</Typography>
      </Box>
    </Box>
  );
};

export default ContactComponent;
