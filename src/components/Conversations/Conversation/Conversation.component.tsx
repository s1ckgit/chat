import { useCallback, useEffect } from 'react';
import { setChatId, setReceiver } from '../../../store/chat';
import { useColors, useTransitions, useTypography } from '../../../theme/hooks';

import { Badge, Box } from '@mui/material';

import { useSocket } from '@/store/socket';
import { useStatus } from '@/hooks/helpers';
import { useUpdateLastMessage } from '@/hooks/cache-handlers';

import ConversationLastMessage from './ConversationLastMessage.component';
import { enableSocketEventListeners } from '../../../utils';
import UserAvatarComponent from '@/components/UserAvatar/UserAvatar.component';
import HighlightText from '@/components/HighlightText/HighlightText.component';

interface IConversationProps {
  conversation: Conversation;
  searchValue?: string;
}

const Conversation = ({ conversation, searchValue }: IConversationProps) => {
  const { id } = conversation;
  const lastMessage = conversation.lastMessage ?? undefined;
  const receiver = conversation.participants[0];

  const colors = useColors();
  const transitions = useTransitions();
  const typography = useTypography();
  const status = useStatus(receiver.id);

  const { messagesSocket: socket } = useSocket();

  const updateLastMessage = useUpdateLastMessage();

  const onClick = () => {
    setReceiver(receiver);
    setChatId(id);
  };
  
  const onNewMessage = useCallback(({ message }: { message: Message }) => {
    updateLastMessage({ conversationId: id, lastMessage: message });
  }, [id, updateLastMessage]);

  const onLastMessageRead = useCallback(({ ids }: { ids: Message['id'][] }) => {
    const lastMessageIsRead = ids.some((id) => id === lastMessage!.id);
    if(lastMessageIsRead) {
      updateLastMessage({ conversationId: id, lastMessage: {
        ...lastMessage!,
        status: 'read'
      } });
    }
  }, [id, lastMessage, updateLastMessage]);

  useEffect(() => {
    if(!socket) return;
    const cleanup = enableSocketEventListeners(socket, [
      {
        eventName: `messages_read_${id}`,
        eventCallback: onLastMessageRead
      },
      {
        eventName: `new_message_${id}`,
        eventCallback: onNewMessage,
      },
    ]);
    return cleanup;
  }, [id, onLastMessageRead, onNewMessage, socket]);

  useEffect(() => {
    if(socket) {
      socket.emit('request_unread_count', {
        conversationId: id
      });
    }
  }, [id, socket]);

  if(status === '') return null;

  return (
    <Box 
      onClick={onClick} 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: '12px',
        padding: '12px',
        alignItems: 'center',
        justifyContent: 'center',
      
        cursor: 'pointer',
       '&:hover': {
          backgroundColor: colors['ghost-light'],
          transition: 'background-color',
          transitionDuration: transitions['shortest']
       }
     }}>
      <Badge
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px white`,
            top: '80%',
            left: '75%'
          },
        }}
        invisible={
          status !== 'online'
        }
        color="primary"
        overlap="circular"
        variant="dot"
      >
        <UserAvatarComponent
          id={receiver.id}
        />
      </Badge>
      <Box 
        component='div'
        sx={{
          display: 'grid',
          rowGap: '4px',
          gridTemplateColumns: '1fr auto',
          gridTemplateRows: '1fr 1fr',
        }}
      >
        <HighlightText 
            sx={{
              ...typography['name']
            }}
            text={receiver.login} 
            highlight={searchValue || ''} 
          />
        {
          lastMessage ? (
            <ConversationLastMessage message={lastMessage} />
          ) : null
        }
      </Box>
    </Box>
  );
};

export default Conversation;
