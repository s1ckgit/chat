import { Box, IconButton, Typography } from "@mui/material";
import { useChat, useUser } from "../../../store";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useColors, useTransitions, useTypography } from "../../../theme/hooks";
import MessageTyping from "../../MessageTyping/MessageTyping.component";
import { useIsTyping, useStatus } from "../../../utils/hooks";

const ChatBar = () => {
  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();

  const { receiverName, id: chatId } = useChat();
  const { id } = useUser();

  const status = useStatus(id!);
  const isTyping = useIsTyping(chatId!);

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
            isTyping ? <MessageTyping /> : status
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
