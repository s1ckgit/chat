import { Box, Button, CircularProgress } from "@mui/material";
import { useContactsQuery } from "../../../api/hooks/users";
import { toggleContactsModal } from "../../../store/modals";
import { useChatWindow } from "../../../utils/hooks";

const ChatWindow = () => {
  const { renderMessages, receiverId, isMessagesFetching, chatWindowRef, id } = useChatWindow();
  const { data: contacts, isLoading: contactsLoading } = useContactsQuery();

  return (
    isMessagesFetching ? (
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
                renderMessages()
              }
            </>
          )
        }
        
    </Box>
    )
  );
};

export default ChatWindow;
