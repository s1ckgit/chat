import { useEffect, useRef } from "react";
import { Box, Button, Container, Modal, TextField, Typography } from "@mui/material";

import { toggleAttachFileModal, useModals } from "../../../store/modals";
import { setChatInput, useChatInput } from "../../../store/chat";
import { useSendMessage } from "../../../utils/hooks";
import AttachFileList from "./AttachFileList.component";

const AttachFileModal = () => {

  const chatInput = useChatInput();
  const { isOpened, attachments } = useModals(state => state.attachFileModal);
  const inputRef = useRef<HTMLInputElement>(null);
  const onSend = useSendMessage();
  
  const handleSendMessage = () => {
    onSend({ message: chatInput, attachments });
  };

  useEffect(() => {
    if (isOpened) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpened]);

  return (
    <Modal
      open={isOpened}
      slotProps={{
        backdrop: {
          onClick: () => {
            toggleAttachFileModal();
          }
        }
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          '&.MuiContainer-root': {
            padding: 0,
          },
          display: 'grid',
          gridTemplate: '1fr / 1fr ',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          maxWidth: 368,
          backgroundColor: 'white',

        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '24px',
            padding: '24px'
          }}
        >
          <Typography variant='h5'>Отправить файл</Typography>
          <AttachFileList />

          <TextField
            inputRef={inputRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            variant="standard"
            label="Описание"
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button onClick={toggleAttachFileModal} variant="text">
              Отмена
            </Button>
            <Button onClick={handleSendMessage} variant="text">
              Отправить
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};
export default AttachFileModal;
