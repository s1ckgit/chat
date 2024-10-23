import { Box, IconButton, Typography } from "@mui/material";
import { useChat, useUser } from "../../../store";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useColors, useTransitions, useTypography } from "../../../theme/hooks";
import MessageTyping from "../../MessageTyping/MessageTyping.component";
import { useEffect, useRef, useState } from "react";
import { setIsTyping, useSocket } from "../../../store/chat";
import { useContactsQuery } from "../../../api/hooks/users";

const ChatBar = () => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { receiverName, receiverId, id: chatId, isTyping } = useChat();
  const { id } = useUser();
  const { socket } = useSocket();
  const { data: contacts } = useContactsQuery();

  const [typingName, setTypingName] = useState('');

  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTyping = ({ userId }: { userId: string }) => {
      if(userId !== id) {
        const name = contacts?.find(c => c.contactId === userId)?.contact.login;
        setTypingName(name!);
        setIsTyping(true);

        if(typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
  
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }

    };

    socket?.on(`typing_${chatId}`, handleTyping);

    return () => {
      socket?.off(`typing_${chatId}`, handleTyping);
    };

  }, [socket, id, chatId, contacts, receiverId]);

  return (
    <Box 
      sx={{ 
        display: 'grid',
        padding: '10px 16px',
        gridTemplateColumns: '1fr auto',
        borderBottom: '1px solid',
        borderColor: colors['ghost-light']
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '8px',

          fontSize: '14px'
        }}
      >
        <Typography 
          sx={{
            ...typography.name,

          }}
        >
          {receiverName}
        </Typography>
        <Typography 
          sx={{
            ...typography.info, 
            color: colors['ghost-main']
          }}
        >
          {
            isTyping ? <MessageTyping name={typingName} /> : 'last seen recently'
          }
        </Typography>
      </Box>
      <Box 
        sx={{}}
      >
        <IconButton 
          sx={{ 
              '&:hover svg': {
                transition: `color`,
                transitionDuration: transitions['standard'],
                color: colors['ghost-dark']
              }
            }}
        >
          <MoreVertIcon color='ghost' />
        </IconButton>
        <IconButton 
          sx={{ 
              '&:hover svg': {
                transition: `color`,
                transitionDuration: transitions['standard'],
                color: colors['ghost-dark']
              }
            }}
        >
          <SearchIcon color='ghost' />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatBar;
