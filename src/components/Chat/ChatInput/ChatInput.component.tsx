import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import throttle from 'lodash.throttle';

import { Box, IconButton, Input } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { useColors } from "../../../theme/hooks";
import { useChat } from "@/store/chat";
import { setChatInput, useChatInput } from "../../../store/chat";
import { useUserMeQuery } from "../../../api/hooks/users";
import { useSocket } from "../../../store/socket";
import { setAttachments, setFileInputRef, toggleAttachFileModal, useModals } from "../../../store/modals";
import { useSendMessage } from "@/hooks/helpers";

const ChatInput = () => {
  const colors = useColors();
  const { isOpened } = useModals(state => state.attachFileModal);
  const [isEmojiPickerOpened, setIsEmojiPickerOpened] = useState<boolean>(false);

  const { messagesSocket: socket } = useSocket();
  const { data: user } = useUserMeQuery();
  const { id } = useChat();
  const onSend = useSendMessage();
  const chatInput = useChatInput();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    onSend({ message: chatInput });
  };

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

  const onImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.length) {
      const files = Array.from(e.target.files).slice(0, 9);
      const attachments = files.map((file, i) => ({
        id: i,
        previewUrl: URL.createObjectURL(file),
        originalUrl: '',
        file
      }));
      setAttachments(attachments);
      if(!isOpened) {
        toggleAttachFileModal();
      }
    };
  };

  const handleToggleEmojiPicker = () => {
    setIsEmojiPickerOpened(prev => !prev);
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setChatInput(prev => prev + emoji.native);
  };

  useEffect(() => {
    if(fileInputRef.current) {
      setFileInputRef(fileInputRef);
    }
  }, [fileInputRef]);

  return (
    <Box 
      sx={{
        position: 'relative',
        padding: '10px',
        borderTop: '1px solid',
        borderColor: colors['ghost-light'],
    
        display: 'grid',
        gridTemplateColumns: '56px auto 56px 56px',
        columnGap: '10px'
      }}
    >
      <IconButton
        sx={{
          width: '56px'
        }}

        component='label'
      >
        <input ref={fileInputRef} onChange={onImageLoad} hidden type="file" multiple accept=".png, .jpg, .jpeg"/>
        <AttachFileIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>

      {
        isEmojiPickerOpened && (
          <Box
            sx={{
              position: 'absolute',
              top: '-450px',
              right: '56px',
              zIndex: 10,
            }}
          >
            <Picker 
              data={data} 
              onEmojiSelect={handleEmojiSelect} 
              locale='ru'
              skinTonePosition='none'
              previewPosition='none'
              perLine='9'
              maxFrequentRows={1}
            />
          </Box>
        )
      }


      <Input 
        sx={{
          width: '100%'
        }}
        value={chatInput} 
        onChange={onTyping} 
        disableUnderline 
        placeholder='Сюда хуйню свою высирай' 
      />

      <IconButton
        sx={{
          width: '56px'
        }}
        onClick={handleToggleEmojiPicker}
      >
        <SentimentSatisfiedAltIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>

      <IconButton
        sx={{
          width: '56px'
        }}

        onClick={handleSendMessage}
      >
        <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>

    </Box>
    
  );
};

export default ChatInput;
