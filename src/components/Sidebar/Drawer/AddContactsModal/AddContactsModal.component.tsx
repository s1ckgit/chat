import { Box, Button, Container, InputAdornment, TextField, Typography } from "@mui/material";
import { forwardRef, useState } from "react";
import ContactsIcon from '@mui/icons-material/Contacts';
import { useAddContactMutation } from "../../../../api/hooks/users";
import { toggleAddContactModal } from "../../../../store/modals";

const AddContactsModal = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Container>>((props, ref) => {
  const [value, setValue] = useState('');
  const addContactMutation = useAddContactMutation();

  const onAdd = () => {
    addContactMutation.mutate(value);
    toggleAddContactModal();
  };

  return (
    <Container
      ref={ref}
      maxWidth={false}
      sx={{
        '&.MuiContainer-root': {
          padding: 0,
        },
        position: 'absolute',
        display: 'grid',
        gridTemplate: 'auto 1fr auto / 1fr',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '30vh',
        minHeight: '300px',
        maxWidth: 400,
        backgroundColor: 'white',
      }}
    >
      <Typography 
        sx={{ padding: '24px 0px 24px 24px' }}
        variant="h5"
      >
        Новый контакт
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '16px'
        }}
      >
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{
            padding: '0px 24px 8px 24px'
          }}
          variant="standard"
          placeholder="Логин"
          slotProps={{
            input: {
              sx: {
                paddingBottom: '8px'
              },
              startAdornment: (
                <InputAdornment position="start">
                  <ContactsIcon />
                </InputAdornment>
              )
            }
          }}
          fullWidth
        />
      </Box>
      <Button onClick={onAdd} variant="text">Добавить</Button>
    </Container>
  );
});

export default AddContactsModal;
