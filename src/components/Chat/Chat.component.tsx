import { Box } from '@mui/material';
import { useChat } from '@/store/chat';

import ChatInput from './ChatInput/ChatInput.component';
import ChatWindow from './ChatWindow/ChatWindow.component';
import ChatBar from './ChatBar/ChatBar.component';
import AttachFileModal from './AttachFileModal/AttachFileModal.component';


const Chat = () => {
  const { receiver, id } = useChat();

  return (
    <Box 
      sx={{
        display: 'grid',
        overflow: 'hidden',
        height: '100vh',
        gridTemplateRows: receiver || id ? 'auto 1fr auto' : '1fr'
      }}
    >
      <AttachFileModal />
  
      {(receiver || id) && <ChatBar />}

      <ChatWindow />

      {(receiver || id) && <ChatInput />}

    </Box>
  );
};

export default Chat;
