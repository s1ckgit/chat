import { Box } from '@mui/material';
import { useChat } from '../../store';

import ChatInput from './ChatInput/ChatInput.component';
import ChatWindow from './ChatWindow/ChatWindow.component';
import ChatBar from './ChatBar/ChatBar.component';


const Chat = () => {
  const { receiverName, id } = useChat();

  return (
    <Box 
      sx={{
        display: 'grid',
        overflow: 'hidden',
        height: '100vh',
        gridTemplateRows: receiverName || id ? 'auto 1fr 80px' : '1fr'
      }}
    >
      {(receiverName || id) && <ChatBar />}

      <ChatWindow />

      {(receiverName || id) && <ChatInput />}

    </Box>
  );
};

export default Chat;
