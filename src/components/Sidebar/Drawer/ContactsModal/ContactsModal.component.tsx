import { Box, Button, CircularProgress, Container, Divider, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import { toggleAddContactModal, toggleContactsModal, useModals } from "../../../../store/modals";
import SearchIcon from '@mui/icons-material/Search';
import { useContactsQuery } from "../../../../api/hooks/users";
import Contact from "../../Contact/Contact.component";
import AddContactsModal from "../AddContactsModal/AddContactsModal.component";
import { useCallback, useEffect } from "react";
import { useSocket } from "../../../../store/chat";

const ContactsModal = () => {
  const isOpened = useModals(state => state.contactsModal);
  const isAddOpened = useModals(state => state.addContactModal);
  const { data, isFetching, refetch } = useContactsQuery();
  const { socket } = useSocket();

  const handleNewConversation = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if(socket) {
      socket.on('new_conversation', handleNewConversation);

      return () => {
        socket.off('new_conversation', handleNewConversation);
      };
    }
  }, [socket, handleNewConversation]);

  return (
      <Modal
        open={isOpened} 
        slotProps={{
          backdrop: {
            onClick: () => {
              toggleContactsModal();
              toggleAddContactModal();
            }
          }
        }}
      >
        {
          isAddOpened ? (
            <AddContactsModal />
          ) : (
            <Container
              maxWidth={false}
              sx={{
                '&.MuiContainer-root': {
                  padding: 0,
                },
                display: 'grid',
                gridTemplate: 'auto 1fr auto auto / 1fr ',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '60vh',
                maxWidth: 400,
                backgroundColor: 'white',

              }}
            >
              <Box>
                <Typography sx={{ padding: '24px 0px 24px 24px' }} variant='h5'>Контакты</Typography>
                <TextField
                  sx={{
                    paddingLeft: '24px',
                    paddingBottom: '8px'
                  }}
                  variant="standard"
                  placeholder="Поиск..."
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }
                  }}
                  fullWidth
                />
                <Divider />
              </Box>
              <Box 
                sx={{
                  overflowY: 'scroll'
                }}
              >
                {
                  isFetching ? (
                    <Box 
                      sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : data && (
                    data.map((contact) => <Contact key={contact.id} converstaionId={contact.conversationId} id={contact.contactId} login={contact.contact.login} />)
                  )
                }
              </Box>
              <Divider />
              <Box
                sx={{
                  padding: '16px 8px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
              <Button onClick={toggleAddContactModal} variant="text">Добавить контакт</Button>
              <Button onClick={toggleContactsModal} variant="text">Закрыть</Button>
              </Box>
            </Container>
          )
        }
      </Modal>
  );
};

export default ContactsModal;
