import { Box, Button, Container, Divider, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import { toggleAddContactModal, toggleContactsModal, useModals } from "../../../../store/modals";
import SearchIcon from '@mui/icons-material/Search';
import { useContactsQuery } from "../../../../api/hooks/users";
import Contact from "../../Contact/Contact.component";
import AddContactsModal from "../AddContactsModal/AddContactsModal.component";

const ContactsModal = () => {
  const isOpened = useModals(state => state.contactsModal);
  const isAddOpened = useModals(state => state.addContactModal);
  console.log(isAddOpened);
  const { data, isLoading } = useContactsQuery();

  return (
      <Modal
        open={isOpened} 
        slotProps={{
          backdrop: {
            onClick: toggleContactsModal
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
              <Box>
                {/* {
                  isLoading ? <CircularProgress /> : data && (
                    data.map((contact) => <Contact />)
                  )
                } */}
                <Contact login={""} />
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
