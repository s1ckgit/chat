import { Box, Button, CircularProgress } from "@mui/material";
import { useContactsQuery } from "../../../api/hooks/users";
import { toggleContactsModal } from "../../../store/modals";
import { useChatWindowComponent } from "../../../utils/hooks";
import { useEffect, useRef } from "react";
import { setChatWindowElement } from "@/store/chat";

import ScrollButtonComponent from "./ScrollButton.component";

const ChatWindow = () => {
  const { 
    messageGroups, 
    handleOnScrollDownButton, 
    receiver, 
    isMessagesFetching,
    showScrollButton,
    id 
  } = useChatWindowComponent();
  const { data: contacts, isLoading: contactsLoading } = useContactsQuery();

  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(chatWindowRef.current) {
      setChatWindowElement(chatWindowRef.current);
    }
  }, [chatWindowRef, isMessagesFetching]);

  return (
    isMessagesFetching ? (
      <Box className='loading-container'>
        <CircularProgress />
      </Box>
    ) : (
      <Box
        component='div'
        sx={{ 
          height: '100%',
          overflowY: 'hidden', 
          background: 'linear-gradient(to bottom, #c8e6c9, #a5d6a7)'
        }} 
      >
        { 
          (!receiver?.id || !id) ? (
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
              <Box
                ref={chatWindowRef}
                component='div'
                sx={{
                  overflowY: 'auto', 
                  display: 'grid',
                  height: '100%',
                  gridTemplateRows: '1fr',
                  gridAutoRows: 'auto',
                  gridTemplateColumns: '1fr',
                  rowGap: '24px',
                  padding: '10px 16px',
                }}
              >
                <Box 
                  sx={{ 
                    height: '100%', 
                    position: 'relative' 
                  }} 
                />
                { 
                  messageGroups
                }
              </Box>
              {
                showScrollButton && (
                  <ScrollButtonComponent
                    chatId={id}
                    onClick={handleOnScrollDownButton}
                  />
                )
              }
            </>
          )
        }
        
    </Box>
    )
  );
};

export default ChatWindow;
