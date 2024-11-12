import { Box, IconButton, Input } from "@mui/material";
import { ChangeEvent, useCallback, useRef } from "react";
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useColors } from "../../../theme/hooks";
import { useChat } from "../../../store";
import { setChatInput, setPendingMessage, useChatInput } from "../../../store/chat";
import { v4 as uuidv4 } from 'uuid';
import throttle from 'lodash.throttle';
import { useUserMeQuery } from "../../../api/hooks/users";
import { useSocket } from "../../../store/socket";
import { IPendingMessage } from "../../../types";
import { setAttachments, toggleAttchFileModal } from "../../../store/modals";

const ChatInput = () => {
  const colors = useColors();

  const { socket } = useSocket();
  const { data: user } = useUserMeQuery();
  const { id, receiverId } = useChat();
  const chatInput = useChatInput();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emitTyping = useCallback(() => {
    if (socket) {
      socket.emit(`typing`, {
        userId: user?.id,
        conversationId: id
      });
    }
  }, [socket, user?.id, id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledTyping = useCallback(throttle(emitTyping, 500), [emitTyping]);

  const onTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    throttledTyping();
  };

  const onSendMessage = () => {
    if(socket) {
      const messageId = uuidv4();
      const createdAt = new Date();

      const newMessage: IPendingMessage = {
        id: messageId,
        createdAt,
        status: 'pending',
        conversationId: id as string,
        content: chatInput,
        senderId: user?.id as string,
        receiverId: receiverId as string
      };

      setPendingMessage(newMessage);

      socket.emit('send_message', newMessage);
    }

    setChatInput('');
  };

  const onImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.length) {
      const files = Array.from(e.target.files).slice(0, 9);
      const attachments = files.map((file) => ({
        previewUrl: URL.createObjectURL(file),
        originalUrl: '',
        file
      }));
      setAttachments(attachments);
      
      toggleAttchFileModal(fileInputRef);
    }
  };

  return (
    <Box 
      sx={{
        padding: '10px',
        borderTop: '1px solid',
        borderColor: colors['ghost-light'],
    
        display: 'grid',
        gridTemplateColumns: '56px 1fr 56px',
        columnGap: '10px'
      }}
    >
      <IconButton 
        component='label'
      >
        <input ref={fileInputRef} onChange={onImageLoad} hidden type="file" multiple accept=".png, .jpg, .jpeg"/>
        <AttachFileIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>
      <Input value={chatInput} onChange={onTyping} disableUnderline placeholder='Сюда хуйню свою высирай' />
      <IconButton onClick={onSendMessage}>
        <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>
    </Box>
    
  );
};

export default ChatInput;
