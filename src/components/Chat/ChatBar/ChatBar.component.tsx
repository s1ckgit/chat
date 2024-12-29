import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { setChatId, setReceiver, useChat } from "@/store/chat";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import SearchIcon from '@mui/icons-material/Search';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useColors, useTypography } from "@/theme/hooks";
import MessageTyping from "../../MessageTyping/MessageTyping.component";
import { useIsTyping, useStatus } from "@/hooks/helpers";

const ChatBar = () => {
  const colors = useColors();
  const typography = useTypography();
  const oneColumnMode = useMediaQuery('(max-width:860px)');

  const { receiver, id: chatId } = useChat();

  const status = useStatus(receiver?.id ?? '');
  const isTyping = useIsTyping(chatId!);

  const closeChatWindow = () => {
    setReceiver(undefined);
    setChatId(undefined);
  };

  return (
    <Box 
      sx={{ 
        display: 'grid',
        padding: '10px 16px',
        gridTemplateColumns: oneColumnMode ? 'auto 1fr auto' : '1fr auto',
        gap: '8px',
        borderBottom: '1px solid',
        borderColor: colors['ghost-light'],
        minHeight: '70px'
      }}
    >
      {
        oneColumnMode && 
        (
          <IconButton
            sx={{
              width: '50px',
              heigth: '50px'
            }}
            onClick={closeChatWindow}
          >
            <ArrowBackIcon color="ghost" />
          </IconButton>
        )
      }
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
          {receiver?.login}
        </Typography>
        <Typography 
          sx={{
            ...typography.info, 
            color: colors['ghost-main']
          }}
        >
          {
            isTyping ? <MessageTyping /> : status.length ? status : null
          }
        </Typography>
      </Box>
      {/* <Box
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
      </Box> */}
    </Box>
  );
};

export default ChatBar;
