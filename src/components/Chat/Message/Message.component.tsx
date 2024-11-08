import styles from './Message.module.css';
import { useColors, useTypography } from '../../../theme/hooks';
import { format } from 'date-fns';
import MessageStatus from './MessageStatus/MessageStatus.component';
import { useEffect } from 'react';
import { useInView } from "react-intersection-observer";
import { useUserMeQuery } from '../../../api/hooks/users';
import type { IPendingMessage } from '../../../types';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import { useUserAvatar } from '../../../utils/hooks';
import { cld } from '../../../utils/сloudinary';
import { isPendingMessage } from '../../../utils';

interface IMessageProps {
  messageData: Message | IPendingMessage;
  renderAvatar: boolean;
  onRead: (messageId: string) => void;
}

const Message = ({ messageData, renderAvatar, onRead }: IMessageProps) => {
  const { senderId, id, content: text, status, createdAt, attachments } = messageData;
  const colors = useColors();
  const typography = useTypography();

  const { data: user } = useUserMeQuery();

  const isInitiatorMessage = senderId ===  user?.id;
  const avatarVersion = useUserAvatar(senderId);
  const date = format(createdAt, 'HH:mm');
  const { ref, inView } = useInView();
  const avatarSrc = avatarVersion && cld.image(`avatars/${senderId}/thumbnail`).setVersion(avatarVersion).toURL();
  const isAttachmentsLoading = isPendingMessage(messageData) && 
    messageData.attachmentProgress !== undefined && 
    messageData.attachmentProgress < 100;

  useEffect(() => {
    if (inView && senderId !== user?.id && status !== 'read') {
      onRead(id);
    }
  }, [inView, id, senderId, user?.id, status, onRead]);

  return (
    <Box
      sx={{
        display: 'flex',
        columnGap: '6px',
        alignItems: 'flex-end',
        position: 'relative'
      }}
      ref={ref} 
    >
      { renderAvatar ? <Avatar src={avatarSrc} /> : <Box sx={{ width: 40, height: 40 }} /> }
      {
        renderAvatar && (
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
              zIndex: 100,
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
        
          border: '1px solid',
          maxWidth: '500px',
          width: 'max-content',
        
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
  
          borderColor: isInitiatorMessage ? colors['messages-initiator-border'] : colors['messages-receiver-border'], 
          backgroundColor: isInitiatorMessage ? colors['messages-initiator'] : colors['messages-receiver'],
        }} 
      >
        {
          attachments?.length ? (
            <>
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  minWidth: '250px',
                  '&::after': {
                    content: "''",
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'block',
                    width: '100%',
                    height: '100%',

                    background: `url(${attachments[0].preview_url}) center center/cover no-repeat`,
                    filter: 'blur(10px) brightness(0.6)',
                  }
                }}
              >
                {
                  isAttachmentsLoading && (
                    <CircularProgress 
                      variant={messageData.attachmentProgress ? 'determinate' : 'indeterminate'}
                      value={messageData.attachmentProgress}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% 0',

                        zIndex: 100
                      }}
                    />
                  )
                }
                <img 
                  style={{
                    objectFit: 'contain',
                    position: 'relative',
                    maxWidth: '100%',
                    zIndex: 10,

                    filter: isAttachmentsLoading ? !isInitiatorMessage ? 'blur(10px) brightness(0.6)' : 'brightness(0.6)' : 'unset'
                  }} 
                  src={isAttachmentsLoading ? attachments[0].preview_url : attachments[0].secure_url}
                  alt='Вложение' 
                />
              </Box>
            </>
          ) : null
        }
        <Typography
          sx={{
            ...typography['messages-text'],
            wordWrap: 'break-word',
            wordBreak: 'break-all',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
            padding: '8px 14px',
          }}
        >
          {text}
          <span className={styles['message-date']} style={{ ...typography['messages-date'], color: isInitiatorMessage ? colors['messages-initiator-date'] : colors['messages-receiver-date'] }}>
            <MessageStatus status={status} />
            {date}
          </span>
        </Typography>
      </Box>
      
    </Box>
  );
};

export default Message;
