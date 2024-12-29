import { Box, Button } from "@mui/material";
import { useContactsQuery } from "../../../api/hooks/users";
import { toggleContactsModal } from "../../../store/modals";
import { useChatWindowComponent } from "@/hooks/components";
import { setChatWindowElement } from "@/store/chat";

import ScrollButtonComponent from "./ScrollButton.component";
import { useConversationsQuery } from "@/api/hooks/messages";
import { useCallback } from "react";

const ChatWindow = () => {
  const { 
    messageGroups, 
    handleOnScrollDownButton, 
    receiver,
    showScrollButton,
    id,
    chatWindowElement
  } = useChatWindowComponent();
  const { data: contacts, isLoading: contactsLoading } = useContactsQuery();
  const { data: conversations } = useConversationsQuery();

  const onChatWindowMount = useCallback((element: HTMLDivElement) => {
    if(element && !chatWindowElement) {
      setChatWindowElement(element);
    }
  }, [chatWindowElement]);

  return (
      <Box
        component='div'
        sx={{ 
          height: '100%',
          overflowY: 'hidden', 
          background: `url("chat-background.png") center center/cover no-repeat, 
            linear-gradient(to bottom, #c8e6c9, #a5d6a7)`
        }} 
      >
        { 
          (!receiver?.id && !id) ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  rowGap: '24px',
                  padding: '20px'
                }}
              >
                {
                  conversations?.length || contacts?.length ? (
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        padding: '4px 12px',
                        borderRadius: '24px',
                        textAlign: 'center',

                        color: 'white'
                      }}
                    >
                      Выберите диалог или контакт, чтобы отправить сообщение
                    </Box>
                  ) : null
                } 
                {
                  (!contacts?.length && !contactsLoading) ? (
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        padding: '16px',
                        borderRadius: '24px',

                        color: 'white',
                        textAlign: 'center',

                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        rowGap: '12px'
                      }}
                    >
                      Чтобы начать общение, добавьте пользователя в список контактов и отправьте сообщение <br />
                      (Добавьте пользователя с логином "user" для тестирования функционала приложения)
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
                      </Box>
                    </Box>
                  ) : null
                }
              </Box>
            </>
          ) : (
            <>
              <Box
                ref={onChatWindowMount}
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
                (showScrollButton && id) ? (
                  <ScrollButtonComponent
                    chatId={id}
                    onClick={handleOnScrollDownButton}
                  />
                ) : null
              }
            </>
          )
        }
        
    </Box>
    );
};

export default ChatWindow;
