import { Badge, Box, Typography } from "@mui/material";

import { Image as ImageIcon } from '@mui/icons-material';
import { useColors, useTypography } from "../../../theme/hooks";
import { useUserMeQuery } from "../../../api/hooks/users";
import { formatDate } from "../../../utils";

import MessageStatus from '../../MessageStatus/MessageStatus.component';
import { useUnreadCount } from "@/hooks/helpers";



const ConversationLastMessage = ({ message }: { message: Message }) => {
  const colors = useColors();
  const typography = useTypography();

  const { data: user } = useUserMeQuery();

  const isUserMessage = message.senderId === user?.id;
  const date = formatDate(message.createdAt);
  const count = useUnreadCount(message.conversationId);

  const attachmentsLabel = message.attachments?.length
  ? message.attachments.length < 2
    ? 'Изображение'
    : `Изображения(${message.attachments.length})`
  : null;

  const renderMessageContent = () => {
    if (!attachmentsLabel) {
      return (
        <Typography
          sx={{
            ...typography['messages-text'],
            color: colors['ghost-main'],
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {message.content}
        </Typography>
      );
    }
    return (
      <Box
        component='span'
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          component='span'
          sx={{
            color: colors['ghost-main'],
            fontStyle: 'italic'
          }}
        >
          {attachmentsLabel}
        </Typography>
        <ImageIcon 
          sx={{
            color: colors['ghost-main']
          }}
        />
      </Box>
    );
  };

  return (
    <>
      { isUserMessage ? 
        <MessageStatus 
          status={message.status} 
          date={date} 
          isInitiator={isUserMessage} 
        /> : 
        <Typography 
          sx={{ 
            ...typography.info, 
            justifySelf: 'center',
            color: colors['ghost-main'] 
          }}
        >
          {date}
        </Typography>
      }
    {
      renderMessageContent()
    }
    <Badge
      sx={{
        width: '70px',
        '& .MuiBadge-badge': {
          top: '10%',
          right: '50%',
          transform: 'translate(50%, 0)'
        },
      }}
      badgeContent={count} 
      color='primary' 
      max={99} 
    />
  </>
  );
};

export default ConversationLastMessage;
