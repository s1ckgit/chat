import { Badge, Box, Typography } from "@mui/material";

import { useColors, useTypography } from "@/theme/hooks";
import { setChatId, setReceiver } from "@/store/chat";
import { closeAllModals } from "@/store/modals";
import { useStatus } from "@/hooks/helpers";
import UserAvatarComponent from "../../UserAvatar/UserAvatar.component";
import HighlightText from "@/components/HighlightText/HighlightText.component";

interface IContactComponentProps {
  contactData: Contact;
  searchValue?: string;
}

const ContactComponent = ({ contactData, searchValue }: IContactComponentProps) => {
  const { id: contactId, login } = contactData.contact;
  const { conversationId } = contactData;
  const contactUser = contactData.contact;

  const colors = useColors();
  const typography = useTypography();
  const status = useStatus(contactId);

  if(status === '') return;
  
  return (
    <Box 
      onClick={() => {
        setChatId(conversationId);
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
          status !== 'online'
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
        <HighlightText 
          sx={{
            ...typography['name']
          }}
          text={login} 
          highlight={searchValue || ''} 
        />
        <Typography 
          sx={{
            ...typography.info, 
            color: colors['ghost-main']
          }}
        >
          {status}
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactComponent;
