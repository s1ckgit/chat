import { Box, IconButton, Input } from "@mui/material";
import { ChangeEvent, useCallback, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useColors } from "../../../theme/hooks";
import { useChat, useUser } from "../../../store";
import { setPendingMessage, useSocket } from "../../../store/chat";
import { v4 as uuidv4 } from 'uuid';
import throttle from 'lodash.throttle';

const ChatInput = () => {
  const colors = useColors();

  const { socket } = useSocket();
  const { id, receiverId } = useChat();
  const { id: userId } = useUser();

  const [message, setMessage] = useState('');

  const emitTyping = useCallback(() => {
    if (socket) {
      socket.emit(`typing`, {
        userId,
        conversationId: id
      });
    }
  }, [socket, userId, id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledTyping = useCallback(throttle(emitTyping, 500), [emitTyping]);

  const onTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    throttledTyping();
  };

  const onSendMessage = () => {
    if(socket) {
      const messageId = uuidv4();
      const createdAt = new Date();

      const newMessage = {
        id: messageId,
        createdAt,
        status: 'pending' as const,
        conversationId: id as string,
        content: message,
        senderId: userId as string,
        receiverId
      };

      setPendingMessage(newMessage);

      socket.emit('send_message', newMessage);
    }

    setMessage('');
  };

  return (
    <Box 
      sx={{
        padding: '10px 16px',
        borderTop: '1px solid',
        borderColor: colors['ghost-light'],
    
        display: 'grid',
        gridTemplateColumns: '1fr 56px'
      }}
    >
      <Input value={message} onChange={onTyping} disableUnderline placeholder='Сюда хуйню свою высирай' />
      <IconButton onClick={onSendMessage}>
        <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>
    </Box>
    
  );
};

export default ChatInput;
