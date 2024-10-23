import { Box, Button, CircularProgress } from "@mui/material";
import { useMessagesQuery } from "../../../api/hooks/messages";
import { useChat } from "../../../store";
import { deletePendingMessage, setChatId, useSocket } from "../../../store/chat";
import { useCallback, useEffect, useMemo, useRef } from "react";
import Message from "../Message/Message.component";
import { useContactsQuery } from "../../../api/hooks/users";
import { toggleContactsModal } from "../../../store/modals";

const ChatWindow = () => {
  const { socket } = useSocket();
  const { id, pendingMessages, receiverId } = useChat();


  const { data, isLoading, refetch, isPlaceholderData } = useMessagesQuery(id);
  const { data: contacts, isLoading: contactsLoading } = useContactsQuery();


  const messages = useMemo(() => {
    return [...(data?.messages || []), ...Array.from(pendingMessages.values())];
  }, [data, pendingMessages]);

  const deliveredMessages = useMemo(() => {
    if (!data?.messages) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.messages.filter((message: { id: string; }) => pendingMessages.get(message.id)).map((message: { id: any; }) => message.id);
  }, [data, pendingMessages]);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = useCallback(
    async () => {
      await refetch();
    },
    [refetch]
  );

  const handleNewConversation = useCallback(
    async (data: { id: string }) => {
      if(socket) {
        socket.on(`new_message_${data.id}`, handleNewMessage);
      }
    }, 
    [handleNewMessage, socket]
  );


  useEffect(() => {
    if(socket) {

      if(id) {
        socket.on(`new_message_${id}`, handleNewMessage);
      }
      else {
        socket.on('new_conversation_opened', async (data: { id: string; }) => {
          setChatId(data.id);
        });
      }
      
      socket.on('new_conversation', handleNewConversation);

      return () => {
        socket.off(`new_conversation`, handleNewConversation);
        socket.off(`new_message_${id}`, handleNewMessage);
      };
    }
  }, [socket, handleNewConversation, handleNewMessage, id]);

  useEffect(() => {
    if(deliveredMessages.length) {
      deletePendingMessage(deliveredMessages);
    }
  }, [deliveredMessages]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    isLoading && !isPlaceholderData ? (
      <Box className='loading-container'>
        <CircularProgress />
      </Box>
    ) : (
      <Box 
        ref={chatWindowRef} 
        sx={{ 
          overflowY: 'auto', 
          position: 'relative',
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto',
          gridAutoRows: 'min-content',
        
          gridTemplateColumns: '1fr',
          rowGap: '12px',
        
          padding: '10px 16px',
        
          background: 'linear-gradient(to bottom, #c8e6c9, #a5d6a7)'
        }} 
      >
        { 
          (!receiverId || !id) ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  rowGap: '24px'
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '24px',

                    color: 'white'
                  }}
                >
                  Выберите диалог, чтобы отправить сообщение
                </Box>
                {
                  !contacts?.length && !contactsLoading && (
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        padding: '16px',
                        borderRadius: '24px',

                        color: 'white',

                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        rowGap: '12px'
                      }}
                    >
                      Чтобы начать общение, добавьте контакты или найдите чаты
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          width: '100%'
                        }}
                      >
                        <Button 
                          onClick={() => {
                            toggleContactsModal();
                          }}
                          variant='text'
                        >
                          Добавить контакты
                        </Button>
                        <Button variant='text'>Найти чаты</Button>
                      </Box>
                    </Box>
                  )
                }
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ height: '100%' }} />
              { 
                messages && messages.map((message: { content: string; senderId: string | undefined; createdAt: Date; id: string; status: 'pending' | 'delivered' | 'read'; conversationId: string; }) => {
                  return <Message conversationId={message.conversationId} id={message.id} status={message.status} key={message.id + message.status} text={message.content} senderID={message.senderId} createdAt={message.createdAt} />;
                })
              }
            </>
          )
        }
        
    </Box>
    )
  );
};

export default ChatWindow;
