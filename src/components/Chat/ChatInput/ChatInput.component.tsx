import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import throttle from 'lodash.throttle';

import { Box, IconButton, Input, useMediaQuery } from "@mui/material";
import { 
  SentimentSatisfiedAlt as SentimentSatisfiedAltIcon, 
  AttachFile as AttachFileIcon, 
  Send as SendIcon
 } from '@mui/icons-material';
import Picker from '@emoji-mart/react';

import { useColors } from "../../../theme/hooks";
import { useChat } from "@/store/chat";
import { setChatInput, useChatInput } from "../../../store/chat";
import { useUserMeQuery } from "../../../api/hooks/users";
import { useSocket } from "../../../store/socket";
import { setAttachments, setFileInputRef, toggleAttachFileModal, useModals } from "../../../store/modals";
import { useSendMessage } from "@/hooks/helpers";
import { toast } from "sonner";

const ChatInput = () => {
  const colors = useColors();
  const { isOpened } = useModals(state => state.attachFileModal);
  const { chatWindowElement } = useChat();
  const [isEmojiPickerOpened, setIsEmojiPickerOpened] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const oneColumnMode = useMediaQuery('(max-width:860px)');

  const { messagesSocket: socket } = useSocket();
  const { data: user } = useUserMeQuery();
  const { id } = useChat();
  const onSend = useSendMessage();
  const chatInput = useChatInput();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [emojiData, setEmojiData] = useState<unknown>(null);

  const handleAutoFocusInput = useCallback((event: KeyboardEvent) => {
    const isLetterKey = /^[a-zA-Zа-яА-ЯёЁ]$/u.test(event.key);
    const activeElement = document.activeElement;

    const isActiveElementInput = 
      activeElement && 
      (activeElement.tagName === 'INPUT' || 
       activeElement.tagName === 'TEXTAREA');
  
    if (!isActiveElementInput && isLetterKey && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSendMessage = () => {
    if(chatInput.trim()) {
      onSend({ message: chatInput });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
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

  const handleEmojiSelect = (emoji: { native: string }) => {
    setChatInput(prev => prev + emoji.native);
  };

  useEffect(() => {
    if(fileInputRef.current) {
      setFileInputRef(fileInputRef);
    }
  }, [fileInputRef]);

  useEffect(() => {
    if(containerRef.current) {
      const containerElement = containerRef.current;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerElement) {
            setContainerHeight(entry.contentRect.height);
          }
        }
      });

      observer.observe(containerElement);

      return () => {
        if(containerElement) {
          observer.unobserve(containerElement);
        }
      };
    }
  }, [containerRef]);

  useEffect(() => {
    if(chatWindowElement) {
      requestAnimationFrame(() => {
        chatWindowElement.scrollTop = chatWindowElement.scrollHeight;
      });
    }
  }, [chatWindowElement, containerHeight]);

  useEffect(() => {
    window.addEventListener('keydown', handleAutoFocusInput);
    return () => {
      window.removeEventListener('keydown', handleAutoFocusInput);
    };
  }, [handleAutoFocusInput]);

  useEffect(() => {
    const getEmojiMartData = async () => {
      try {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
        );
      
        const data = await response.json();

        setEmojiData(data);
      } catch(error) {
        toast.error(`Ошибка загрузки эмодзи: ${error}`);
      }
    };

    getEmojiMartData();
  }, []);

  return (
    <Box 
      ref={containerRef}
      sx={{
        position: 'relative',
        padding: '10px',
        borderTop: '1px solid',
        borderColor: colors['ghost-light'],
    
        display: 'grid',
        gridTemplateColumns: '56px auto 56px 56px',
        alignItems: 'end',
        columnGap: '10px'
      }}
    >
      <IconButton
        sx={{
          width: '56px',
          height: '56px'
        }}

        component='label'
      >
        <input ref={fileInputRef} onChange={onImageLoad} hidden type="file" multiple accept=".png, .jpg, .jpeg"/>
        <AttachFileIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>

      {
        isEmojiPickerOpened && emojiData ? (
          <Box
            component='div'
            sx={{
              position: 'absolute',
              top: '-450px',
              right: '24px',
              height: '100%',
              zIndex: 10,
            }}
          >
            <Picker
              data={emojiData}
              onEmojiSelect={handleEmojiSelect} 
              locale='ru'
              skinTonePosition='none'
              previewPosition='none'
              perLine={
                oneColumnMode ? '6' : '9'
              }
              maxFrequentRows={1}
            />
          </Box>
        ) : null
      }


      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
          alignSelf: 'center',
        }}
      >
        <Input
          inputRef={inputRef}
          multiline
          sx={{
            width: '100%',

            '&.MuiInput-root': {
              maxHeight: '200px',
              overflow: 'auto'
            }
          }}
          autoFocus
          value={chatInput} 
          disableUnderline
          onChange={onTyping}
          onKeyDown={handleKeyDown}
          placeholder='Напишите сообщение...' 
        />
      </Box>
      
      <IconButton
        sx={{
          width: '56px',
          height: '56px'
        }}
        onClick={() => {
          if(emojiData) {
            setIsEmojiPickerOpened(isEmojiPickerOpened ? false : true);
          } else {
            toast.info('Эмодзи грузятся');
          }
        }}
      >
        <SentimentSatisfiedAltIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>

      <IconButton
        sx={{
          width: '56px',
          height: '56px'
        }}

        onClick={handleSendMessage}
      >
        <SendIcon sx={{ fontSize: 40 }} color={'primary'} />
      </IconButton>

    </Box>
    
  );
};

export default ChatInput;
