import { useState } from "react";
import { Box, Button, Container, Divider, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import { Search as SearchIcon } from '@mui/icons-material';

import { closeAddContactModal, openAddContactModal, toggleContactsModal, useModals } from "@/store/modals";
import AddContactsModal from "../AddContactsModal/AddContactsModal.component";
import Contacts from "../Contacts/Contacts.component";

const ContactsModal = () => {
  const isOpened = useModals(state => state.contactsModal);
  const isAddOpened = useModals(state => state.addContactModal);

  const [searchValue, setSearchValue] = useState('');

  return (
      <Modal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px'
        }}
        open={isOpened} 
        slotProps={{
          backdrop: {
            onClick: () => {
              toggleContactsModal();
              closeAddContactModal();
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
                maxWidth: 400,
                minHeight: '60vh',
                backgroundColor: 'white',
              }}
            >
              <Box>
                <Typography sx={{ padding: '24px 0px 24px 24px' }} variant='h5'>Контакты</Typography>
                <TextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
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
                <Contacts searchValue={searchValue} />
              </Box>
              <Divider />
              <Box
                sx={{
                  padding: '16px 8px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
              <Button onClick={openAddContactModal} variant="text">Добавить контакт</Button>
              <Button onClick={toggleContactsModal} variant="text">Закрыть</Button>
              </Box>
            </Container>
          )
        }
      </Modal>
  );
};

export default ContactsModal;
