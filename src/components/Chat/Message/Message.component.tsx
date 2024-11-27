import { useColors, useTypography } from '../../../theme/hooks';
import MessageStatus from '../../MessageStatus/MessageStatus.component';
import { useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import { Box, Typography } from '@mui/material';
import { useMessage } from '../../../utils/hooks';
import type { IPendingMessage } from '../../../types';
import MessageAttachment from './MessageAttachment.component';
import { buildGridForAttachments } from '../../../utils';
import { setShowScrollButton } from '@/store/chat';
import UserAvatarComponent from '@/components/UserAvatar/UserAvatar.component';

interface IMessageProps {
  messageData: Message | IPendingMessage;
  renderAvatar: boolean;
  isLastMessage?: boolean;
  onRead: (messageId: string) => void;
}

const Message = ({ messageData, renderAvatar, isLastMessage, onRead }: IMessageProps) => {
  const { id, text, status, isInitiatorMessage, date, attachments } = useMessage(messageData);
  const noText = text.length < 1;

  const colors = useColors();
  const typography = useTypography();

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
    triggerOnce: !isLastMessage
  });

  useEffect(() => {
    if (inView && !isInitiatorMessage && status !== 'read') {
      onRead(id);
    }
  }, [id, inView, isInitiatorMessage, onRead, status]);

  useEffect(() => {
    if (!isLastMessage) return;

    if(inView) {
      setShowScrollButton(false);
    }

  }, [inView, isLastMessage]);

  return (
    <Box
      component='div'
      data-message-id={messageData.id}
      sx={{
        display: 'flex',
        columnGap: '6px',
        alignItems: 'flex-end',
        position: 'relative',
        gridColumn: '1'
      }}
      ref={ref} 
    >
      { renderAvatar ? <UserAvatarComponent id={messageData.senderId} /> : <Box sx={{ width: 40, height: 40 }} /> }
      {
        renderAvatar && !noText && (
          <Box
            sx={{
              content: '""',
              position: 'absolute',
  
              bottom: '10px',
              left: '40px',
              width: '0px',
              height: '0px',
  
              borderTop: '8px solid transparent',
              borderLeft: '8px solid transparent',
  
              borderRight: `8px solid ${isInitiatorMessage ? colors['messages-initiator'] : colors['messages-receiver']}`,
              borderBottom: `8px solid ${isInitiatorMessage ? colors['messages-initiator'] : colors['messages-receiver']}`,

              borderBottomLeftRadius: '3px',
              borderTopLeftRadius: '3px',
              zIndex: 2,
            }}
          />
        )
      }
      <Box 
        sx={{ 
          borderRadius: '24px',
          height:' max-content',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        
          maxWidth: '500px',
          width: 'max-content',
        
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
  
          ...(!noText ? {
            border: '1px solid',
            borderColor: isInitiatorMessage ? colors['messages-initiator-border'] : colors['messages-receiver-border'], 
            backgroundColor: isInitiatorMessage ? colors['messages-initiator'] : colors['messages-receiver'],
          }: {})
        }} 
      >
        {
          attachments?.length ? (
            <Box
              sx={{
                ...buildGridForAttachments(attachments.length)
              }}
            >
              { attachments.map((attach, i) => <MessageAttachment key={i} data={attach} />) }
            </Box>
          ) : null
        }
        <Typography
          sx={{
            ...typography['messages-text'],
            wordWrap: 'break-word',
            wordBreak: 'break-all',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
            padding: '6px',
            paddingLeft: '16px',
            ...(noText ? {
              padding: '0px'
            }: {})
          }}
        >
          {text}
          <MessageStatus variant={noText ? 'no-text' : 'default'} isInitiator={isInitiatorMessage} date={date} status={status} />
        </Typography>
      </Box>
      
    </Box>
  );
};

export default Message;
